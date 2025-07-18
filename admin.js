// ===== CONFIGURAÇÃO DO SUPABASE =====
// SUBSTITUA PELAS SUAS CREDENCIAIS
const SUPABASE_URL = "YOUR_SUPABASE_URL"
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"

// Verificar se as credenciais foram configuradas
if (SUPABASE_URL === "YOUR_SUPABASE_URL" || SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY") {
  alert(
    "⚠️ ATENÇÃO: Configure as credenciais do Supabase no arquivo admin.html!\n\nSubstitua YOUR_SUPABASE_URL e YOUR_SUPABASE_ANON_KEY pelas suas credenciais.",
  )
}

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ===== VARIÁVEIS GLOBAIS =====
let currentSection = "dashboard"
let categories = []
let products = []
let orders = []
let settings = {}
let addons = []

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Iniciando painel administrativo...")

  try {
    await initializeAdmin()
    setupEventListeners()
    console.log("✅ Painel administrativo carregado com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao inicializar:", error)
    alert("Erro ao carregar painel. Verifique as credenciais do Supabase.")
  }
})

// ===== CONFIGURAR EVENT LISTENERS =====
function setupEventListeners() {
  console.log("🔧 Configurando event listeners...")

  // Navegação
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      switchSection(this.dataset.section)
    })
  })

  // Toggle da loja
  const storeToggle = document.getElementById("store-toggle")
  if (storeToggle) {
    storeToggle.addEventListener("change", toggleStore)
  }

  // Botões de adicionar
  const addProductBtn = document.getElementById("add-product-btn")
  const addCategoryBtn = document.getElementById("add-category-btn")
  const addAddonBtn = document.getElementById("add-addon-btn")
  const refreshOrdersBtn = document.getElementById("refresh-orders")

  if (addProductBtn) addProductBtn.addEventListener("click", () => openProductModal())
  if (addCategoryBtn) addCategoryBtn.addEventListener("click", () => openCategoryModal())
  if (addAddonBtn) addAddonBtn.addEventListener("click", () => openAddonModal())
  if (refreshOrdersBtn) refreshOrdersBtn.addEventListener("click", loadOrders)

  // Formulários
  const productForm = document.getElementById("product-form")
  const categoryForm = document.getElementById("category-form")
  const addonForm = document.getElementById("addon-form")
  const settingsForm = document.getElementById("settings-form")

  if (productForm) productForm.addEventListener("submit", saveProduct)
  if (categoryForm) categoryForm.addEventListener("submit", saveCategory)
  if (addonForm) addonForm.addEventListener("submit", saveAddon)
  if (settingsForm) settingsForm.addEventListener("submit", saveSettings)

  // Modais
  document.querySelectorAll(".close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", function () {
      this.closest(".modal").style.display = "none"
    })
  })

  // Filtro de pedidos
  const orderFilter = document.getElementById("order-status-filter")
  if (orderFilter) {
    orderFilter.addEventListener("change", loadOrders)
  }

  console.log("✅ Event listeners configurados!")
}

// ===== INICIALIZAR ADMIN =====
async function initializeAdmin() {
  console.log("📊 Carregando dados...")

  await loadSettings()
  await loadCategories()
  await loadProducts()
  await loadAddons()
  await loadOrders()

  updateStoreStatus()
  loadDashboard()

  console.log("✅ Dados carregados!")
}

// ===== ALTERNAR SEÇÃO =====
function switchSection(section) {
  console.log(`🔄 Mudando para seção: ${section}`)

  // Remover classe active de todas as seções e botões
  document.querySelectorAll(".admin-section").forEach((s) => s.classList.remove("active"))
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"))

  // Adicionar classe active na seção e botão atual
  const sectionElement = document.getElementById(section)
  const buttonElement = document.querySelector(`[data-section="${section}"]`)

  if (sectionElement) sectionElement.classList.add("active")
  if (buttonElement) buttonElement.classList.add("active")

  currentSection = section

  // Carregar dados específicos da seção
  switch (section) {
    case "dashboard":
      loadDashboard()
      break
    case "products":
      displayProducts()
      break
    case "categories":
      displayCategories()
      break
    case "addons":
      displayAddons()
      break
    case "orders":
      displayOrders()
      break
    case "settings":
      displaySettings()
      break
  }
}

// ===== CARREGAR CONFIGURAÇÕES =====
async function loadSettings() {
  try {
    console.log("⚙️ Carregando configurações...")

    const { data, error } = await supabase.from("settings").select("*")

    if (error) throw error

    settings = {}
    data.forEach((setting) => {
      settings[setting.key] = setting.value
    })

    // Parse active_days from string to array
    if (settings.active_days) {
      try {
        settings.active_days = JSON.parse(settings.active_days)
      } catch (e) {
        console.error("Erro ao parsear active_days:", e)
        settings.active_days = [] // Fallback para array vazio em caso de erro
      }
    } else {
      settings.active_days = []
    }

    console.log("✅ Configurações carregadas:", settings)
  } catch (error) {
    console.error("❌ Erro ao carregar configurações:", error)
  }
}

// ===== CARREGAR CATEGORIAS =====
async function loadCategories() {
  try {
    console.log("📂 Carregando categorias...")

    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) throw error
    categories = data || []

    console.log(`✅ ${categories.length} categorias carregadas`)
  } catch (error) {
    console.error("❌ Erro ao carregar categorias:", error)
    categories = []
  }
}

// ===== CARREGAR PRODUTOS =====
async function loadProducts() {
  try {
    console.log("🛍️ Carregando produtos...")

    const { data, error } = await supabase
      .from("products")
      .select(`
                        *,
                        categories (name)
                    `)
      .order("name")

    if (error) throw error
    products = data || []

    console.log(`✅ ${products.length} produtos carregados`)
  } catch (error) {
    console.error("❌ Erro ao carregar produtos:", error)
    products = []
  }
}

// ===== CARREGAR ACRÉSCIMOS =====
async function loadAddons() {
  try {
    console.log("➕ Carregando acréscimos...")

    const { data, error } = await supabase.from("addons").select("*").order("name")

    if (error) throw error
    addons = data || []

    console.log(`✅ ${addons.length} acréscimos carregados`)
  } catch (error) {
    console.error("❌ Erro ao carregar acréscimos:", error)
    addons = []
  }
}

// ===== CARREGAR PEDIDOS =====
async function loadOrders() {
  try {
    console.log("📋 Carregando pedidos...")

    const statusFilter = document.getElementById("order-status-filter")?.value || ""
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (statusFilter) {
      query = query.eq("status", statusFilter)
    }

    const { data, error } = await query

    if (error) throw error
    orders = data || []

    console.log(`✅ ${orders.length} pedidos carregados`)

    if (currentSection === "orders") {
      displayOrders()
    }
  } catch (error) {
    console.error("❌ Erro ao carregar pedidos:", error)
    orders = []
  }
}

// ===== CARREGAR DASHBOARD =====
async function loadDashboard() {
  try {
    console.log("📊 Carregando dashboard...")

    // Pedidos de hoje
    const today = new Date().toISOString().split("T")[0]
    const { data: todayOrders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .gte("created_at", today + "T00:00:00")
      .lte("created_at", today + "T23:59:59")

    if (ordersError) throw ordersError

    // Calcular estatísticas
    const ordersCount = todayOrders?.length || 0
    const revenue = todayOrders?.reduce((sum, order) => sum + Number.parseFloat(order.total_amount || 0), 0) || 0
    const activeProducts = products.filter((p) => p.active).length

    // Atualizar dashboard
    const ordersElement = document.getElementById("orders-today")
    const revenueElement = document.getElementById("revenue-today")
    const productsElement = document.getElementById("active-products")
    const statusElement = document.getElementById("store-status")

    if (ordersElement) ordersElement.textContent = ordersCount
    if (revenueElement) revenueElement.textContent = `R$ ${revenue.toFixed(2).replace(".", ",")}`
    if (productsElement) productsElement.textContent = activeProducts
    if (statusElement) statusElement.textContent = settings.store_open === "true" ? "Aberto" : "Fechado"

    // Pedidos recentes
    const recentOrders = todayOrders?.slice(0, 5) || []
    displayRecentOrders(recentOrders)

    console.log("✅ Dashboard atualizado!")
  } catch (error) {
    console.error("❌ Erro ao carregar dashboard:", error)
  }
}

// ===== EXIBIR PEDIDOS RECENTES =====
function displayRecentOrders(orders) {
  const container = document.getElementById("recent-orders-list")
  if (!container) return

  if (orders.length === 0) {
    container.innerHTML = "<p>Nenhum pedido hoje.</p>"
    return
  }

  container.innerHTML = orders
    .map(
      (order) => `
        <div class="order-card">
            <div class="order-header">
                <strong>#${order.id}</strong>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-info">
                <p><strong>${order.customer_name}</strong> - ${order.customer_phone}</p>
                <p>R$ ${Number.parseFloat(order.total_amount || 0)
                  .toFixed(2)
                  .replace(".", ",")}</p>
                <small>${new Date(order.created_at).toLocaleString("pt-BR")}</small>
            </div>
        </div>
    `,
    )
    .join("")
}

// ===== EXIBIR PRODUTOS =====
function displayProducts() {
  const container = document.getElementById("products-list")
  if (!container) return

  if (products.length === 0) {
    container.innerHTML = "<p>Nenhum produto cadastrado.</p>"
    return
  }

  container.innerHTML = products
    .map(
      (product) => `
        <div class="item-card">
            <div class="item-info">
                <h3>${product.name}</h3>
                <p>${product.description || ""}</p>
                <p><strong>R$ ${Number.parseFloat(product.price || 0)
                  .toFixed(2)
                  .replace(".", ",")}</strong></p>
                <p><small>Categoria: ${product.categories?.name || "N/A"}</small></p>
                <span class="status-badge ${product.active ? "active" : "inactive"}">
                    ${product.active ? "Ativo" : "Inativo"}
                </span>
            </div>
            <div class="item-actions">
                <button onclick="editProduct(${product.id})" class="btn-edit">Editar</button>
                <button onclick="deleteProduct(${product.id})" class="btn-delete">Excluir</button>
            </div>
        </div>
    `,
    )
    .join("")
}

// ===== EXIBIR CATEGORIAS =====
function displayCategories() {
  const container = document.getElementById("categories-list")
  if (!container) return

  if (categories.length === 0) {
    container.innerHTML = "<p>Nenhuma categoria cadastrada.</p>"
    return
  }

  container.innerHTML = categories
    .map(
      (category) => `
        <div class="item-card">
            <div class="item-info">
                <h3>${category.name}</h3>
                <p>${category.description || ""}</p>
                <span class="status-badge ${category.active ? "active" : "inactive"}">
                    ${category.active ? "Ativa" : "Inativa"}
                </span>
            </div>
            <div class="item-actions">
                <button onclick="editCategory(${category.id})" class="btn-edit">Editar</button>
                <button onclick="deleteCategory(${category.id})" class="btn-delete">Excluir</button>
            </div>
        </div>
    `,
    )
    .join("")
}

// ===== EXIBIR ACRÉSCIMOS =====
function displayAddons() {
  const container = document.getElementById("addons-list")
  if (!container) return

  if (addons.length === 0) {
    container.innerHTML = "<p>Nenhum acréscimo cadastrado.</p>"
    return
  }

  container.innerHTML = addons
    .map(
      (addon) => `
        <div class="item-card">
            <div class="item-info">
                <h3>${addon.name}</h3>
                <p><strong>R$ ${Number.parseFloat(addon.price || 0)
                  .toFixed(2)
                  .replace(".", ",")}</strong></p>
                <span class="status-badge ${addon.active ? "active" : "inactive"}">
                    ${addon.active ? "Ativo" : "Inativo"}
                </span>
            </div>
            <div class="item-actions">
                <button onclick="editAddon(${addon.id})" class="btn-edit">Editar</button>
                <button onclick="deleteAddon(${addon.id})" class="btn-delete">Excluir</button>
            </div>
        </div>
    `,
    )
    .join("")
}

// ===== EXIBIR PEDIDOS =====
function displayOrders() {
  const container = document.getElementById("orders-list")
  if (!container) return

  if (orders.length === 0) {
    container.innerHTML = "<p>Nenhum pedido encontrado.</p>"
    return
  }

  container.innerHTML = orders
    .map((order) => {
      const orderItems = JSON.parse(order.items || "[]")
      const itemsHtml = orderItems
        .map((item) => {
          let itemAddonsHtml = ""
          if (item.selectedAddons && item.selectedAddons.length > 0) {
            itemAddonsHtml = item.selectedAddons
              .map(
                (addon) => `
                    <li style="font-size: 0.85em; color: #555;">+ ${addon.name} (R$ ${Number.parseFloat(addon.price).toFixed(2).replace(".", ",")})</li>
                `,
              )
              .join("")
            itemAddonsHtml = `<ul style="list-style: none; padding-left: 10px; margin-top: 5px;">${itemAddonsHtml}</ul>`
          }
          return `
                <div class="order-item">
                    ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    ${itemAddonsHtml}
                </div>
            `
        })
        .join("")

      return `
            <div class="order-card">
                <div class="order-header">
                    <strong>#${order.id}</strong>
                    <select onchange="updateOrderStatus(${order.id}, this.value)" class="status-select">
                        <option value="pending" ${order.status === "pending" ? "selected" : ""}>Pendente</option>
                        <option value="confirmed" ${order.status === "confirmed" ? "selected" : ""}>Confirmado</option>
                        <option value="preparing" ${order.status === "preparing" ? "selected" : ""}>Preparando</option>
                        <option value="ready" ${order.status === "ready" ? "selected" : ""}>Pronto</option>
                        <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Entregue</option>
                        <option value="cancelled" ${order.status === "cancelled" ? "selected" : ""}>Cancelado</option>
                    </select>
                </div>
                <div class="order-details">
                    <p><strong>Cliente:</strong> ${order.customer_name}</p>
                    <p><strong>Telefone:</strong> ${order.customer_phone}</p>
                    <p><strong>Tipo:</strong> ${order.delivery_type === "delivery" ? "Entrega" : "Retirada"}</p>
                    ${order.customer_address ? `<p><strong>Endereço:</strong> ${order.customer_address}</p>` : ""}
                    <p><strong>Pagamento:</strong> ${getPaymentText(order.payment_method)}</p>
                    ${order.change_for ? `<p><strong>Troco para:</strong> R$ ${Number.parseFloat(order.change_for).toFixed(2).replace(".", ",")}</p>` : ""}
                    <p><strong>Total:</strong> R$ ${Number.parseFloat(order.total_amount || 0)
                      .toFixed(2)
                      .replace(".", ",")}</p>
                    <p><strong>Data:</strong> ${new Date(order.created_at).toLocaleString("pt-BR")}</p>

                    <div class="order-items">
                        <h4>Itens:</h4>
                        ${itemsHtml}
                    </div>
                    <button onclick="printOrder(${order.id})" class="btn-print">Imprimir Pedido</button>
                </div>
            </div>
        `
    })
    .join("")
}

// ===== EXIBIR CONFIGURAÇÕES =====
function displaySettings() {
  const elements = {
    "store-name-setting": settings.store_name || "",
    "store-phone-setting": settings.store_phone || "",
    "store-address-setting": settings.store_address || "",
    "opening-time-setting": settings.opening_time || "",
    "closing-time-setting": settings.closing_time || "",
    "delivery-fee-setting": settings.delivery_fee || "",
    "pix-key-setting": settings.pix_key || "",
    "whatsapp-number-setting": settings.whatsapp_number || "",
    "header-color-start-setting": settings.header_color_start || "#667eea", // Default
    "header-color-end-setting": settings.header_color_end || "#764ba2", // Default
    "background-color-setting": settings.background_color || "#f8f9fa", // Default
  }

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id)
    if (element) element.value = value
  })

  // Preencher checkboxes de dias de funcionamento
  document.querySelectorAll('.days-checkbox-group input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = settings.active_days.includes(Number.parseInt(checkbox.value))
  })
}

// ===== TOGGLE DA LOJA =====
async function toggleStore() {
  const isOpen = document.getElementById("store-toggle")?.checked || false

  try {
    console.log(`🏪 ${isOpen ? "Abrindo" : "Fechando"} loja...`)

    const { error } = await supabase.from("settings").update({ value: isOpen.toString() }).eq("key", "store_open")

    if (error) throw error

    settings.store_open = isOpen.toString()
    const statusText = document.getElementById("status-text")
    if (statusText) statusText.textContent = isOpen ? "Aberto" : "Fechado"

    if (currentSection === "dashboard") {
      loadDashboard()
    }

    console.log(`✅ Loja ${isOpen ? "aberta" : "fechada"}!`)
  } catch (error) {
    console.error("❌ Erro ao alterar status da loja:", error)
    alert("Erro ao alterar status da loja")
  }
}

// ===== MODAL DE PRODUTO =====
function openProductModal(productId = null) {
  const modal = document.getElementById("product-modal")
  const title = document.getElementById("product-modal-title")
  const form = document.getElementById("product-form")

  if (!modal || !title || !form) return

  // Limpar formulário
  form.reset()
  document.getElementById("product-id").value = ""

  // Carregar categorias no select
  const categorySelect = document.getElementById("product-category")
  if (categorySelect) {
    categorySelect.innerHTML = categories.map((cat) => `<option value="${cat.id}">${cat.name}</option>`).join("")
  }

  if (productId) {
    // Editar produto
    const product = products.find((p) => p.id === productId)
    if (product) {
      title.textContent = "Editar Produto"
      document.getElementById("product-id").value = product.id
      document.getElementById("product-name").value = product.name
      document.getElementById("product-description").value = product.description || ""
      document.getElementById("product-price").value = product.price
      document.getElementById("product-category").value = product.category_id
      document.getElementById("product-image").value = product.image_url || ""
      document.getElementById("product-active").checked = product.active
    }
  } else {
    // Novo produto
    title.textContent = "Adicionar Produto"
    document.getElementById("product-active").checked = true
  }

  modal.style.display = "block"
}

// ===== MODAL DE CATEGORIA =====
function openCategoryModal(categoryId = null) {
  const modal = document.getElementById("category-modal")
  const title = document.getElementById("category-modal-title")
  const form = document.getElementById("category-form")

  if (!modal || !title || !form) return

  // Limpar formulário
  form.reset()
  document.getElementById("category-id").value = ""

  if (categoryId) {
    // Editar categoria
    const category = categories.find((c) => c.id === categoryId)
    if (category) {
      title.textContent = "Editar Categoria"
      document.getElementById("category-id").value = category.id
      document.getElementById("category-name").value = category.name
      document.getElementById("category-description").value = category.description || ""
      document.getElementById("category-active").checked = category.active
    }
  } else {
    // Nova categoria
    title.textContent = "Adicionar Categoria"
    document.getElementById("category-active").checked = true
  }

  modal.style.display = "block"
}

// ===== MODAL DE ACRÉSCIMO =====
function openAddonModal(addonId = null) {
  const modal = document.getElementById("addon-modal")
  const title = document.getElementById("addon-modal-title")
  const form = document.getElementById("addon-form")

  if (!modal || !title || !form) return

  // Limpar formulário
  form.reset()
  document.getElementById("addon-id").value = ""

  if (addonId) {
    // Editar acréscimo
    const addon = addons.find((a) => a.id === addonId)
    if (addon) {
      title.textContent = "Editar Acréscimo"
      document.getElementById("addon-id").value = addon.id
      document.getElementById("addon-name").value = addon.name
      document.getElementById("addon-price").value = addon.price
      document.getElementById("addon-active").checked = addon.active
    }
  } else {
    // Novo acréscimo
    title.textContent = "Adicionar Acréscimo"
    document.getElementById("addon-active").checked = true
  }

  modal.style.display = "block"
}

// ===== SALVAR PRODUTO =====
async function saveProduct(e) {
  e.preventDefault()

  const productId = document.getElementById("product-id")?.value
  const productData = {
    name: document.getElementById("product-name")?.value,
    description: document.getElementById("product-description")?.value,
    price: Number.parseFloat(document.getElementById("product-price")?.value || 0),
    category_id: Number.parseInt(document.getElementById("product-category")?.value || 0),
    image_url: document.getElementById("product-image")?.value || null,
    active: document.getElementById("product-active")?.checked || false,
  }

  try {
    console.log("💾 Salvando produto...", productData)

    let result
    if (productId) {
      // Atualizar
      result = await supabase.from("products").update(productData).eq("id", productId)
    } else {
      // Inserir
      result = await supabase.from("products").insert([productData])
    }

    if (result.error) throw result.error

    document.getElementById("product-modal").style.display = "none"
    await loadProducts()
    displayProducts()

    console.log("✅ Produto salvo com sucesso!")
    alert("Produto salvo com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao salvar produto:", error)
    alert("Erro ao salvar produto: " + error.message)
  }
}

// ===== SALVAR CATEGORIA =====
async function saveCategory(e) {
  e.preventDefault()

  const categoryId = document.getElementById("category-id")?.value
  const categoryData = {
    name: document.getElementById("category-name")?.value,
    description: document.getElementById("category-description")?.value,
    active: document.getElementById("category-active")?.checked || false,
  }

  try {
    console.log("💾 Salvando categoria...", categoryData)

    let result
    if (categoryId) {
      // Atualizar
      result = await supabase.from("categories").update(categoryData).eq("id", categoryId)
    } else {
      // Inserir
      result = await supabase.from("categories").insert([categoryData])
    }

    if (result.error) throw result.error

    document.getElementById("category-modal").style.display = "none"
    await loadCategories()
    displayCategories()

    console.log("✅ Categoria salva com sucesso!")
    alert("Categoria salva com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao salvar categoria:", error)
    alert("Erro ao salvar categoria: " + error.message)
  }
}

// ===== SALVAR ACRÉSCIMO =====
async function saveAddon(e) {
  e.preventDefault()

  const addonId = document.getElementById("addon-id")?.value
  const addonData = {
    name: document.getElementById("addon-name")?.value,
    price: Number.parseFloat(document.getElementById("addon-price")?.value || 0),
    active: document.getElementById("addon-active")?.checked || false,
  }

  try {
    console.log("💾 Salvando acréscimo...", addonData)

    let result
    if (addonId) {
      // Atualizar
      result = await supabase.from("addons").update(addonData).eq("id", addonId)
    } else {
      // Inserir
      result = await supabase.from("addons").insert([addonData])
    }

    if (result.error) throw result.error

    document.getElementById("addon-modal").style.display = "none"
    await loadAddons()
    displayAddons()

    console.log("✅ Acréscimo salvo com sucesso!")
    alert("Acréscimo salvo com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao salvar acréscimo:", error)
    alert("Erro ao salvar acréscimo: " + error.message)
  }
}

// ===== SALVAR CONFIGURAÇÕES =====
async function saveSettings(e) {
  e.preventDefault()

  // Coletar dias de funcionamento
  const activeDays = Array.from(document.querySelectorAll('.days-checkbox-group input[type="checkbox"]:checked')).map(
    (checkbox) => Number.parseInt(checkbox.value),
  )

  const settingsData = [
    { key: "store_name", value: document.getElementById("store-name-setting")?.value || "" },
    { key: "store_phone", value: document.getElementById("store-phone-setting")?.value || "" },
    { key: "store_address", value: document.getElementById("store-address-setting")?.value || "" },
    { key: "opening_time", value: document.getElementById("opening-time-setting")?.value || "" },
    { key: "closing_time", value: document.getElementById("closing-time-setting")?.value || "" },
    { key: "delivery_fee", value: document.getElementById("delivery-fee-setting")?.value || "" },
    { key: "pix_key", value: document.getElementById("pix-key-setting")?.value || "" },
    { key: "whatsapp_number", value: document.getElementById("whatsapp-number-setting")?.value || "" },
    { key: "header_color_start", value: document.getElementById("header-color-start-setting")?.value || "#667eea" },
    { key: "header_color_end", value: document.getElementById("header-color-end-setting")?.value || "#764ba2" },
    { key: "background_color", value: document.getElementById("background-color-setting")?.value || "#f8f9fa" },
    { key: "active_days", value: JSON.stringify(activeDays) }, // Salvar como string JSON
  ]

  try {
    console.log("💾 Salvando configurações...")

    for (const setting of settingsData) {
      const { error } = await supabase.from("settings").upsert(
        {
          key: setting.key,
          value: setting.value,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "key",
        },
      )

      if (error) throw error
    }

    await loadSettings() // Recarregar configurações para atualizar o estado global

    console.log("✅ Configurações salvas com sucesso!")
    alert("Configurações salvas com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao salvar configurações:", error)
    alert("Erro ao salvar configurações: " + error.message)
  }
}

// ===== FUNÇÕES DE EDIÇÃO E EXCLUSÃO =====
function editProduct(productId) {
  openProductModal(productId)
}

function editCategory(categoryId) {
  openCategoryModal(categoryId)
}

function editAddon(addonId) {
  openAddonModal(addonId)
}

async function deleteProduct(productId) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return

  try {
    console.log(`🗑️ Excluindo produto ${productId}...`)

    const { error } = await supabase.from("products").delete().eq("id", productId)

    if (error) throw error

    await loadProducts()
    displayProducts()

    console.log("✅ Produto excluído com sucesso!")
    alert("Produto excluído com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao excluir produto:", error)
    alert("Erro ao excluir produto: " + error.message)
  }
}

async function deleteCategory(categoryId) {
  if (!confirm("Tem certeza que deseja excluir esta categoria?")) return

  try {
    console.log(`🗑️ Excluindo categoria ${categoryId}...`)

    const { error } = await supabase.from("categories").delete().eq("id", categoryId)

    if (error) throw error

    await loadCategories()
    displayCategories()

    console.log("✅ Categoria excluída com sucesso!")
    alert("Categoria excluída com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao excluir categoria:", error)
    alert("Erro ao excluir categoria: " + error.message)
  }
}

async function deleteAddon(addonId) {
  if (!confirm("Tem certeza que deseja excluir este acréscimo?")) return

  try {
    console.log(`🗑️ Excluindo acréscimo ${addonId}...`)

    const { error } = await supabase.from("addons").delete().eq("id", addonId)

    if (error) throw error

    await loadAddons()
    displayAddons()

    console.log("✅ Acréscimo excluído com sucesso!")
    alert("Acréscimo excluído com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao excluir acréscimo:", error)
    alert("Erro ao excluir acréscimo: " + error.message)
  }
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    console.log(`📋 Atualizando status do pedido ${orderId} para ${newStatus}...`)

    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

    if (error) throw error

    await loadOrders()

    console.log("✅ Status do pedido atualizado!")
  } catch (error) {
    console.error("❌ Erro ao atualizar status do pedido:", error)
    alert("Erro ao atualizar status do pedido: " + error.message)
  }
}

// ===== FUNÇÃO DE IMPRESSÃO DE PEDIDO =====
function printOrder(orderId) {
  const order = orders.find((o) => o.id === orderId)
  if (!order) {
    alert("Pedido não encontrado para impressão.")
    return
  }

  const orderItems = JSON.parse(order.items || "[]")
  const itemsHtml = orderItems
    .map((item) => {
      let itemAddonsHtml = ""
      let itemTotalPrice = item.price * item.quantity
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        itemAddonsHtml = item.selectedAddons
          .map((addon) => {
            itemTotalPrice += addon.price * item.quantity // Adiciona o preço do acréscimo ao total do item
            return `<p style="margin-left: 15px; font-size: 0.9em;">+ ${addon.name} (R$ ${Number.parseFloat(addon.price).toFixed(2).replace(".", ",")})</p>`
          })
          .join("")
      }
      return `
            <tr>
                <td>${item.quantity}x ${item.name}</td>
                <td style="text-align: right;">R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}</td>
            </tr>
            ${itemAddonsHtml}
        `
    })
    .join("")

  const subtotal = Number.parseFloat(order.total_amount || 0) - Number.parseFloat(order.delivery_fee || 0)

  const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Pedido #${order.id}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; color: #333; }
                .receipt-header { text-align: center; margin-bottom: 20px; }
                .receipt-header h1 { font-size: 1.8em; margin-bottom: 5px; color: #007bff; }
                .receipt-header p { font-size: 0.9em; color: #666; }
                .order-details-print { margin-bottom: 20px; border-bottom: 1px dashed #ccc; padding-bottom: 15px; }
                .order-details-print p { margin-bottom: 5px; }
                .order-details-print strong { color: #007bff; }
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .items-table th, .items-table td { border-bottom: 1px solid #eee; padding: 8px 0; text-align: left; }
                .items-table th { background-color: #f8f9fa; }
                .totals-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                .totals-table td { padding: 5px 0; text-align: right; }
                .totals-table .total-line { font-weight: bold; font-size: 1.1em; border-top: 1px solid #ccc; padding-top: 10px; }
                .totals-table .total-final { font-size: 1.3em; color: #28a745; }
                .footer-print { text-align: center; margin-top: 30px; font-size: 0.8em; color: #999; }
                @media print {
                    body { margin: 0; }
                    .receipt-header, .order-details-print, .items-table, .totals-table, .footer-print { page-break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="receipt-header">
                <h1>${settings.store_name || "Cardápio Digital"}</h1>
                <p>${settings.store_address || ""}</p>
                <p>${settings.store_phone || ""}</p>
                <h2>PEDIDO #${order.id}</h2>
                <p>${new Date(order.created_at).toLocaleString("pt-BR")}</p>
            </div>

            <div class="order-details-print">
                <p><strong>Cliente:</strong> ${order.customer_name}</p>
                <p><strong>Telefone:</strong> ${order.customer_phone}</p>
                <p><strong>Tipo:</strong> ${order.delivery_type === "delivery" ? "Entrega" : "Retirada"}</p>
                ${order.customer_address ? `<p><strong>Endereço:</strong> ${order.customer_address}</p>` : ""}
                <p><strong>Pagamento:</strong> ${getPaymentText(order.payment_method)}</p>
                ${order.payment_method === "pix" ? `<p><strong>Chave PIX:</strong> ${settings.pix_key || "Não configurado"}</p>` : ""}
                ${order.change_for ? `<p><strong>Troco para:</strong> R$ ${Number.parseFloat(order.change_for).toFixed(2).replace(".", ",")}</p>` : ""}
                <p><strong>Status:</strong> ${getStatusText(order.status)}</p>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th style="text-align: right;">Preço</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <table class="totals-table">
                <tr>
                    <td>Subtotal:</td>
                    <td>R$ ${subtotal.toFixed(2).replace(".", ",")}</td>
                </tr>
                ${
                  order.delivery_fee > 0
                    ? `
                <tr>
                    <td>Taxa de Entrega:</td>
                    <td>R$ ${Number.parseFloat(order.delivery_fee || 0)
                      .toFixed(2)
                      .replace(".", ",")}</td>
                </tr>`
                    : ""
                }
                <tr class="total-line">
                    <td>Total:</td>
                    <td class="total-final">R$ ${Number.parseFloat(order.total_amount || 0)
                      .toFixed(2)
                      .replace(".", ",")}</td>
                </tr>
            </table>

            <div class="footer-print">
                <p>Obrigado pelo seu pedido!</p>
            </div>
        </body>
        </html>
    `

  const printWindow = window.open("", "_blank")
  printWindow.document.write(printContent)
  printWindow.document.close() // Importante para o documento estar pronto

  printWindow.onload = () => {
    printWindow.print()
    // printWindow.close(); // Opcional: fechar após imprimir
  }
}

// ===== FUNÇÕES AUXILIARES =====
function updateStoreStatus() {
  const isOpen = settings.store_open === "true"
  const toggle = document.getElementById("store-toggle")
  const statusText = document.getElementById("status-text")

  if (toggle) toggle.checked = isOpen
  if (statusText) statusText.textContent = isOpen ? "Aberto" : "Fechado"
}

function getStatusText(status) {
  const statusMap = {
    pending: "Pendente",
    confirmed: "Confirmado",
    preparing: "Preparando",
    ready: "Pronto",
    delivered: "Entregue",
    cancelled: "Cancelado",
  }
  return statusMap[status] || status
}

function getPaymentText(method) {
  const methodMap = {
    pix: "PIX",
    money: "Dinheiro",
    card: "Cartão",
  }
  return methodMap[method] || method
}

// ===== AUTO-REFRESH DOS PEDIDOS =====
setInterval(async () => {
  if (currentSection === "orders" || currentSection === "dashboard") {
    await loadOrders()
    if (currentSection === "dashboard") {
      loadDashboard()
    }
  }
}, 30000) // Atualiza a cada 30 segundos

console.log("🎯 Admin script carregado!")
