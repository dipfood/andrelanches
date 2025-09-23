// Import the auth module
import { auth } from "./auth.js"

class ChecklistManager {
  constructor() {
    this.items = []
    this.userStatuses = []
    this.currentUser = null
    this.currentTab = "all"
    this.init()
  }

  async init() {
    // Verify authentication using the real system from auth.js
    if (!auth.requireAuth()) {
      return
    }

    this.currentUser = auth.getCurrentUser()

    // Show user information
    document.getElementById("currentUsername").textContent = this.currentUser.username
    document.getElementById("currentDate").textContent = new Date().toLocaleDateString("pt-BR")

    // Show admin button only for manager
    if (this.currentUser.role === "admin") {
      document.getElementById("adminButton").style.display = "inline-block"
    }

    // Load data
    await this.loadData()
  }

  async loadData() {
    try {
      // Load checklist items
      const { data: items, error: itemsError } = await window.supabaseClient
        .from("checklist_items")
        .select("*")
        .order("order_number", { ascending: true })

      if (itemsError) {
        console.error("Error loading items:", itemsError)
        return
      }

      this.items = items || []

      // Load user status
      const { data: statuses, error: statusError } = await window.supabaseClient
        .from("user_checklist_status")
        .select("*")
        .eq("user_id", this.currentUser.id)

      if (statusError) {
        console.error("Error loading status:", statusError)
      }

      this.userStatuses = statuses || []

      this.updateStats()
      this.renderChecklist()
    } catch (error) {
      console.error("Error loading data:", error)
      document.getElementById("checklistContainer").innerHTML =
        '<div class="error-message">Error loading checklist. Please try reloading the page.</div>'
    }
  }

  updateStats() {
    const total = this.items.length
    const completed = this.items.filter((item) => {
      const status = this.getUserStatus(item.id)
      return status && status.status === "completed"
    }).length
    const pending = total - completed
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0

    document.getElementById("totalItems").textContent = total
    document.getElementById("completedItems").textContent = completed
    document.getElementById("pendingItems").textContent = pending
    document.getElementById("progressPercent").textContent = `${progress}%`
  }

  renderChecklist() {
    const container = document.getElementById("checklistContainer")

    if (this.items.length === 0) {
      container.innerHTML = "<p>No items in the checklist.</p>"
      return
    }

    const filteredItems = this.getFilteredItems()

    if (filteredItems.length === 0) {
      container.innerHTML = `<p>No ${this.getTabLabel()} items found.</p>`
      return
    }

    container.innerHTML = filteredItems
      .map((item) => {
        const status = this.getUserStatus(item.id)
        return this.renderItem(item, status)
      })
      .join("")
  }

  renderItem(item, status) {
    const isCompleted = status && status.status === "completed"
    const isNotDone = status && status.status === "not_done"
    const userObservations = status ? status.user_observations || "" : ""

    return `
            <div class="checklist-item">
                <div class="item-header">
                    <div class="item-task">
                        <span class="order-badge">${item.order_number}</span>
                        ${item.task_description}
                    </div>
                    <div class="item-actions">
                        <button onclick="checklistManager.updateStatus(${item.id}, 'completed')" 
                                class="btn-success ${isCompleted ? "active" : ""}"
                                title="Mark as done">
                            ✓ Done
                        </button>
                        <button onclick="checklistManager.updateStatus(${item.id}, 'not_done')" 
                                class="btn-danger ${isNotDone ? "active" : ""}"
                                title="Mark as not done">
                            ✗ Not Done
                        </button>
                    </div>
                </div>
                
                ${item.observations ? `<div class="item-observations">Observations: ${item.observations}</div>` : ""}
                
                <div class="user-observations-section">
                    <label for="obs_${item.id}">Your observations:</label>
                    <textarea id="obs_${item.id}" 
                              class="user-observations" 
                              placeholder="Note here what you did and why..."
                              onblur="checklistManager.saveObservations(${item.id})">${userObservations}</textarea>
                </div>
            </div>
        `
  }

  getFilteredItems() {
    if (this.currentTab === "all") {
      return this.items
    }

    return this.items.filter((item) => {
      const status = this.getUserStatus(item.id)
      if (this.currentTab === "completed") {
        return status && status.status === "completed"
      } else if (this.currentTab === "pending") {
        return !status || status.status !== "completed"
      }
      return true
    })
  }

  getTabLabel() {
    switch (this.currentTab) {
      case "completed":
        return "completed"
      case "pending":
        return "pending"
      default:
        return ""
    }
  }

  getUserStatus(itemId) {
    return this.userStatuses.find((s) => s.checklist_item_id === itemId)
  }

  async updateStatus(itemId, status) {
    try {
      const existingStatus = this.getUserStatus(itemId)
      const userObservations = document.getElementById(`obs_${itemId}`).value

      const statusData = {
        user_id: this.currentUser.id,
        checklist_item_id: itemId,
        status: status,
        user_observations: userObservations,
        updated_at: new Date().toISOString(),
      }

      let result
      if (existingStatus) {
        // Update existing status
        result = await window.supabaseClient
          .from("user_checklist_status")
          .update(statusData)
          .eq("id", existingStatus.id)
      } else {
        // Create new status
        result = await window.supabaseClient.from("user_checklist_status").insert([statusData])
      }

      if (result.error) {
        console.error("Error updating status:", result.error)
        alert("Error updating status. Please try again.")
        return
      }

      // Reload data
      await this.loadData()
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Error updating status. Please try again.")
    }
  }

  async saveObservations(itemId) {
    const userObservations = document.getElementById(`obs_${itemId}`).value
    const existingStatus = this.getUserStatus(itemId)

    if (!existingStatus && !userObservations.trim()) {
      return // Do not create empty record
    }

    try {
      const statusData = {
        user_id: this.currentUser.id,
        checklist_item_id: itemId,
        status: existingStatus ? existingStatus.status : "pending",
        user_observations: userObservations,
        updated_at: new Date().toISOString(),
      }

      let result
      if (existingStatus) {
        result = await window.supabaseClient
          .from("user_checklist_status")
          .update({ user_observations: userObservations, updated_at: statusData.updated_at })
          .eq("id", existingStatus.id)
      } else {
        result = await window.supabaseClient.from("user_checklist_status").insert([statusData])
      }

      if (result.error) {
        console.error("Error saving observations:", result.error)
      }
    } catch (error) {
      console.error("Error saving observations:", error)
    }
  }

  switchTab(tab) {
    this.currentTab = tab

    // Update tab visual
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"))
    event.target.classList.add("active")

    // Re-render list
    this.renderChecklist()
  }
}

// Global function to switch tabs
function switchTab(tab) {
  checklistManager.switchTab(tab)
}

// Initialize checklist manager
const checklistManager = new ChecklistManager()
