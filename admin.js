// Import or declare the auth variable before using it
const auth = {
  requireAdmin: () => window.supabaseClient.auth.user()?.role === "admin", // Real implementation
  getCurrentUser: () => window.supabaseClient.auth.user(), // Real implementation
}

class AdminManager {
  constructor() {
    this.items = []
    this.init()
  }

  async init() {
    // Verificar autenticação de admin usando o sistema real
    if (!auth.requireAdmin()) {
      return
    }

    // Mostrar nome do usuário
    const user = auth.getCurrentUser()
    document.getElementById("currentUsername").textContent = user.username

    // Configurar formulário
    document.getElementById("itemForm").addEventListener("submit", (e) => this.handleSubmit(e))

    // Carregar itens
    await this.loadItems()
  }

  async loadItems() {
    try {
      const { data: items, error } = await window.supabaseClient
        .from("checklist_items")
        .select("*")
        .order("order_number", { ascending: true })

      if (error) {
        console.error("Erro ao carregar itens:", error)
        return
      }

      this.items = items || []
      this.renderItems()
    } catch (error) {
      console.error("Erro ao carregar itens:", error)
    }
  }

  renderItems() {
    const container = document.getElementById("itemsList")

    if (this.items.length === 0) {
      container.innerHTML = "<p>Nenhum item cadastrado.</p>"
      return
    }

    container.innerHTML = this.items
      .map(
        (item) => `
            <div class="admin-item">
                <div class="admin-item-header">
                    <div>
                        <span class="order-badge">${item.order_number}</span>
                        <strong>${item.task_description}</strong>
                    </div>
                    <div>
                        <button onclick="adminManager.editItem(${item.id})" class="btn-secondary">Editar</button>
                        <button onclick="adminManager.deleteItem(${item.id})" class="btn-danger">Excluir</button>
                    </div>
                </div>
                ${item.observations ? `<p class="item-observations">${item.observations}</p>` : ""}
            </div>
        `,
      )
      .join("")
  }

  async handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const itemData = {
      order_number: Number.parseInt(formData.get("orderNumber")),
      task_description: formData.get("taskDescription"),
      observations: formData.get("observations") || null,
    }

    const itemId = document.getElementById("itemId").value

    try {
      let result

      if (itemId) {
        // Atualizar item existente
        result = await window.supabaseClient.from("checklist_items").update(itemData).eq("id", itemId)
      } else {
        // Criar novo item
        result = await window.supabaseClient.from("checklist_items").insert([itemData])
      }

      if (result.error) {
        console.error("Erro ao salvar item:", result.error)
        alert("Erro ao salvar item. Tente novamente.")
        return
      }

      // Limpar formulário e recarregar lista
      this.clearForm()
      await this.loadItems()

      alert(itemId ? "Item atualizado com sucesso!" : "Item adicionado com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar item:", error)
      alert("Erro ao salvar item. Tente novamente.")
    }
  }

  editItem(id) {
    const item = this.items.find((i) => i.id === id)
    if (!item) return

    document.getElementById("itemId").value = item.id
    document.getElementById("orderNumber").value = item.order_number
    document.getElementById("taskDescription").value = item.task_description
    document.getElementById("observations").value = item.observations || ""

    // Scroll para o formulário
    document.querySelector(".admin-form").scrollIntoView({ behavior: "smooth" })
  }

  async deleteItem(id) {
    if (!confirm("Tem certeza que deseja excluir este item?")) {
      return
    }

    try {
      const { error } = await window.supabaseClient.from("checklist_items").delete().eq("id", id)

      if (error) {
        console.error("Erro ao excluir item:", error)
        alert("Erro ao excluir item. Tente novamente.")
        return
      }

      await this.loadItems()
      alert("Item excluído com sucesso!")
    } catch (error) {
      console.error("Erro ao excluir item:", error)
      alert("Erro ao excluir item. Tente novamente.")
    }
  }

  clearForm() {
    document.getElementById("itemForm").reset()
    document.getElementById("itemId").value = ""
  }
}

// Função global para limpar formulário
function clearForm() {
  adminManager.clearForm()
}

// Inicializar gerenciador admin
const adminManager = new AdminManager()
