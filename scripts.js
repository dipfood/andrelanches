// Configuração do Supabase - SUBSTITUA PELAS SUAS CREDENCIAIS
const SUPABASE_URL = "https://ckydrwnnlcusczqcppxi.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNreWRyd25ubGN1c2N6cWNwcHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTY1NjMsImV4cCI6MjA2NzgzMjU2M30.KKvmpj0gb66BWLHlL6_YD_b0VAUIKP4rj75lhGeCklk"
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Variáveis globais
let categories = []
let products = []
let settings = {}
let cart = []
let currentCategory = "all"
let allAddons = [] // Nova variável para todos os acréscimos ativos
let currentProductInDetailModal = null // Armazena o produto atualmente no modal de detalhes
let currentQuantityInDetailModal = 1 // Quantidade do produto no modal de detalhes

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
})

// Configurar event listeners
function setupEventListeners() {
  // Botões do carrinho
  document.getElementById("clear-cart").addEventListener("click", clearCart)
  document.getElementById("checkout-btn").addEventListener("click", openCheckoutModal)

  // Formulário de checkout
  document.getElementById("checkout-form").addEventListener("submit", submitOrder)
  document.getElementById("delivery-type").addEventListener("change", toggleAddressField)
  document.getElementById("payment-method").addEventListener("change", togglePaymentSpecificFields)

  // Modais
  document.querySelectorAll(".close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", function () {
      this.closest(".modal").style.display = "none"
    })
  })

  // Novo pedido
  document.getElementById("new-order-btn").addEventListener("click", () => {
    document.getElementById("success-modal").style.display = "none"
    clearCart()
    window.location.reload()
  })

  // Fechar modal clicando fora
  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none"
    }
  })

  // Botão "Adicionar ao Carrinho" do modal de detalhes do produto
  document.getElementById("add-to-cart-from-detail").addEventListener("click", () => {
    if (currentProductInDetailModal) {
      const selectedAddons = Array.from(
        document.querySelectorAll('#product-addons-list input[type="checkbox"]:checked'),
      ).map((checkbox) => {
        const addonId = Number.parseInt(checkbox.value)
        return allAddons.find((addon) => addon.id === addonId)
      })
      addToCart(currentProductInDetailModal, selectedAddons, currentQuantityInDetailModal)
      document.getElementById("product-detail-modal").style.display = "none"
    }
  })
}

// Inicializar aplicação
async function initializeApp() {
  showLoading(true) // Mostra a tela de carregamento com a logo

  // Espera 3 segundos para o efeito da splash screen
  await new Promise((resolve) => setTimeout(resolve, 3000))

  try {
    await loadSettings()
    applyThemeColors() // Aplica as cores do tema

    // Verificar se a loja está aberta
    if (!isStoreOpen()) {
      showClosedMessage()
      return
    }

    await loadCategories()
    await loadProducts()
    await loadAllAddons() // Carregar todos os acréscimos ativos

    displayStoreInfo()
    displayCategories()
    displayProducts()

    showMainContent()
  } catch (error) {
    console.error("Erro ao inicializar aplicação:", error)
    alert("Erro ao carregar o cardápio. Tente novamente.")
  } finally {
    showLoading(false) // Esconde a tela de carregamento
  }
}

// Carregar configurações
async function loadSettings() {
  try {
    const { data, error } = await supabase.from("settings").select("*")

    if (error) throw error

    settings = {}
    data.forEach((setting) => {
      settings[setting.key] = setting.value
    })
  } catch (error) {
    console.error("Erro ao carregar configurações:", error)
    throw error
  }
}

// Aplicar cores do tema
function applyThemeColors() {
  const header = document.querySelector(".header")
  const body = document.body

  if (header && settings.header_color_start && settings.header_color_end) {
    header.style.background = `linear-gradient(135deg, ${settings.header_color_start} 0%, ${settings.header_color_end} 100%)`
  }
  if (body && settings.background_color) {
    body.style.backgroundColor = settings.background_color
  }
}

// Carregar categorias
async function loadCategories() {
  try {
    const { data, error } = await supabase.from("categories").select("*").eq("active", true).order("name")

    if (error) throw error
    categories = data
  } catch (error) {
    console.error("Erro ao carregar categorias:", error)
    throw error
  }
}

// Carregar produtos
async function loadProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
                *,
                categories (name)
            `)
      .eq("active", true)
      .order("name")

    if (error) throw error
    products = data
  } catch (error) {
    console.error("Erro ao carregar produtos:", error)
    throw error
  }
}

// Carregar todos os acréscimos ativos
async function loadAllAddons() {
  try {
    const { data, error } = await supabase.from("addons").select("*").eq("active", true).order("name")

    if (error) throw error
    allAddons = data
  } catch (error) {
    console.error("Erro ao carregar acréscimos:", error)
    throw error
  }
}

// Verificar se a loja está aberta
function isStoreOpen() {
  if (settings.store_open !== "true") {
    return false
  }

  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const openingTime = timeToMinutes(settings.opening_time || "08:00")
  const closingTime = timeToMinutes(settings.closing_time || "22:00")

  return currentTime >= openingTime && currentTime <= closingTime
}

// Converter horário para minutos
function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number)
  return hours * 60 + minutes
}

// Exibir informações da loja
function displayStoreInfo() {
  document.getElementById("store-name").textContent = settings.store_name || "Cardápio Digital"

  const storeInfo = []
  if (settings.store_phone) storeInfo.push(`📞 ${settings.store_phone}`)
  if (settings.store_address) storeInfo.push(`📍 ${settings.store_address}`)

  document.getElementById("store-info").textContent = storeInfo.join(" • ")
}

// Exibir categorias
function displayCategories() {
  const container = document.getElementById("categories")

  const allBtn = `<button class="category-btn ${currentCategory === "all" ? "active" : ""}" onclick="filterByCategory('all')">Todos</button>`

  const categoryBtns = categories
    .map(
      (category) =>
        `<button class="category-btn ${currentCategory === category.id ? "active" : ""}" onclick="filterByCategory(${category.id})">${category.name}</button>`,
    )
    .join("")

  container.innerHTML = allBtn + categoryBtns
}

// Exibir produtos
function displayProducts() {
  const container = document.getElementById("products")

  let filteredProducts = products
  if (currentCategory !== "all") {
    filteredProducts = products.filter((product) => product.category_id === currentCategory)
  }

  if (filteredProducts.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #666; font-size: 1.2em; margin: 50px 0;">Nenhum produto encontrado nesta categoria.</p>'
    return
  }

  container.innerHTML = filteredProducts
    .map(
      (product) => `
      <div class="product-card">
          <div class="product-image">
              ${
                product.image_url
                  ? `<img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">`
                  : "🍽️"
              }
          </div>
          <div class="product-info">
              <h3>${product.name}</h3>
              <p>${product.description || ""}</p>
              <div class="product-price">R$ ${Number.parseFloat(product.price).toFixed(2).replace(".", ",")}</div>
              <button class="btn-add-cart" onclick="openProductDetailModal(${product.id})">
                  Adicionar ao Carrinho
              </button>
          </div>
      </div>
  `,
    )
    .join("")
}

// Filtrar por categoria
function filterByCategory(categoryId) {
  currentCategory = categoryId
  displayCategories()
  displayProducts()
}

// Abrir modal de detalhes do produto
function openProductDetailModal(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  currentProductInDetailModal = product
  currentQuantityInDetailModal = 1 // Resetar quantidade para 1

  document.getElementById("detail-product-name").textContent = product.name
  document.getElementById("detail-product-image").src = product.image_url || "/placeholder.svg?height=200&width=200"
  document.getElementById("detail-product-description").textContent = product.description || ""
  document.getElementById("detail-product-price").textContent = Number.parseFloat(product.price)
    .toFixed(2)
    .replace(".", ",")
  document.getElementById("detail-quantity").textContent = currentQuantityInDetailModal

  // Exibir acréscimos
  const addonsListContainer = document.getElementById("product-addons-list")
  if (allAddons.length > 0) {
    addonsListContainer.innerHTML = allAddons
      .map(
        (addon) => `
          <label class="addon-item">
              <input type="checkbox" value="${addon.id}">
              <span>${addon.name}</span>
              <span class="addon-price">R$ ${Number.parseFloat(addon.price).toFixed(2).replace(".", ",")}</span>
          </label>
      `,
      )
      .join("")
  } else {
    addonsListContainer.innerHTML = "<p>Nenhum acréscimo disponível.</p>"
  }

  document.getElementById("product-detail-modal").style.display = "block"
}

// Atualizar quantidade no modal de detalhes do produto
function updateDetailQuantity(change) {
  currentQuantityInDetailModal += change
  if (currentQuantityInDetailModal < 1) {
    currentQuantityInDetailModal = 1
  }
  document.getElementById("detail-quantity").textContent = currentQuantityInDetailModal
}

// Adicionar ao carrinho (agora recebe produto, acréscimos e quantidade)
function addToCart(product, selectedAddons, quantity) {
  // Criar um ID único para este item no carrinho, incluindo acréscimos
  // Isso é importante para que produtos com acréscimos diferentes sejam tratados como itens separados
  const itemHash = `${product.id}-${selectedAddons
    .map((a) => a.id)
    .sort()
    .join("-")}`

  const existingItemIndex = cart.findIndex((item) => item.hash === itemHash)

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += quantity
  } else {
    cart.push({
      id: product.id,
      hash: itemHash, // Adiciona o hash
      name: product.name,
      price: Number.parseFloat(product.price),
      quantity: quantity,
      selectedAddons: selectedAddons, // Armazena os acréscimos selecionados
    })
  }

  updateCartDisplay()

  // Feedback visual (opcional, pode ser removido se o modal já for suficiente)
  // const button = document.querySelector(`#products .product-card button[onclick="openProductDetailModal(${product.id})"]`);
  // if (button) {
  //   const originalText = button.textContent;
  //   button.textContent = "Adicionado!";
  //   button.style.background = "#28a745";
  //   setTimeout(() => {
  //     button.textContent = originalText;
  //     button.style.background = "";
  //   }, 1000);
  // }
}

// Atualizar exibição do carrinho
function updateCartDisplay() {
  const cartSummary = document.getElementById("cart-summary")
  const cartItems = document.getElementById("cart-items")
  const cartTotal = document.getElementById("cart-total")

  if (cart.length === 0) {
    cartSummary.style.display = "none"
    return
  }

  cartSummary.style.display = "block"

  cartItems.innerHTML = cart
    .map((item) => {
      let addonsHtml = ""
      let itemSubtotal = item.price * item.quantity
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        addonsHtml = item.selectedAddons
          .map((addon) => {
            itemSubtotal += addon.price * item.quantity
            return `<p class="cart-addon-item">+ ${addon.name} (R$ ${addon.price.toFixed(2).replace(".", ",")})</p>`
          })
          .join("")
      }

      return `
      <div class="cart-item">
          <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p>R$ ${item.price.toFixed(2).replace(".", ",")} cada</p>
              ${addonsHtml}
          </div>
          <div class="cart-item-controls">
              <button class="quantity-btn" onclick="updateQuantity('${item.hash}', -1)" ${item.quantity <= 1 ? "disabled" : ""}>-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn" onclick="updateQuantity('${item.hash}', 1)">+</button>
          </div>
      </div>
  `
    })
    .join("")

  const total = cart.reduce((sum, item) => {
    let itemTotal = item.price * item.quantity
    if (item.selectedAddons) {
      item.selectedAddons.forEach((addon) => {
        itemTotal += addon.price * item.quantity
      })
    }
    return sum + itemTotal
  }, 0)
  cartTotal.textContent = total.toFixed(2).replace(".", ",")
}

// Atualizar quantidade (agora usa o hash do item)
function updateQuantity(itemHash, change) {
  const item = cart.find((item) => item.hash === itemHash)
  if (!item) return

  item.quantity += change

  if (item.quantity <= 0) {
    cart = cart.filter((item) => item.hash !== itemHash)
  }

  updateCartDisplay()
}

// Limpar carrinho
function clearCart() {
  cart = []
  updateCartDisplay()
}

// Abrir modal de checkout
function openCheckoutModal() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!")
    return
  }

  const modal = document.getElementById("checkout-modal")

  // Limpar formulário
  document.getElementById("checkout-form").reset()
  document.getElementById("address-group").style.display = "none"
  document.getElementById("pix-info").style.display = "none"
  document.getElementById("change-info").style.display = "none" // Esconde o campo de troco
  document.getElementById("delivery-fee-line").style.display = "none"

  // Exibir itens do checkout
  displayCheckoutItems()

  modal.style.display = "block"
}

// Exibir itens no checkout
function displayCheckoutItems() {
  const container = document.getElementById("checkout-items")
  const subtotalElement = document.getElementById("checkout-subtotal")
  const deliveryFeeElement = document.getElementById("checkout-delivery-fee")
  const totalElement = document.getElementById("checkout-total")

  let currentSubtotal = 0

  container.innerHTML = cart
    .map((item) => {
      let addonsHtml = ""
      let itemPriceWithAddons = item.price
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        addonsHtml = item.selectedAddons
          .map((addon) => {
            itemPriceWithAddons += addon.price
            return `<p style="margin-left: 10px; font-size: 0.9em;">+ ${addon.name} (R$ ${addon.price.toFixed(2).replace(".", ",")})</p>`
          })
          .join("")
      }
      currentSubtotal += itemPriceWithAddons * item.quantity

      return `
      <div class="checkout-item">
          <span>${item.quantity}x ${item.name}</span>
          <span>R$ ${(itemPriceWithAddons * item.quantity).toFixed(2).replace(".", ",")}</span>
          ${addonsHtml}
      </div>
  `
    })
    .join("")

  subtotalElement.textContent = currentSubtotal.toFixed(2).replace(".", ",")

  updateCheckoutTotals()
}

// Atualizar totais do checkout
function updateCheckoutTotals() {
  const deliveryType = document.getElementById("delivery-type").value
  const subtotal = cart.reduce((sum, item) => {
    let itemTotal = item.price * item.quantity
    if (item.selectedAddons) {
      item.selectedAddons.forEach((addon) => {
        itemTotal += addon.price * item.quantity
      })
    }
    return sum + itemTotal
  }, 0)

  let deliveryFee = 0
  if (deliveryType === "delivery") {
    deliveryFee = Number.parseFloat(settings.delivery_fee || 0)
    document.getElementById("delivery-fee-line").style.display = "flex"
    document.getElementById("checkout-delivery-fee").textContent = deliveryFee.toFixed(2).replace(".", ",")
  } else {
    document.getElementById("delivery-fee-line").style.display = "none"
  }

  const total = subtotal + deliveryFee
  document.getElementById("checkout-total").textContent = total.toFixed(2).replace(".", ",")
}

// Toggle campo de endereço
function toggleAddressField() {
  const deliveryType = document.getElementById("delivery-type").value
  const addressGroup = document.getElementById("address-group")
  const addressField = document.getElementById("customer-address")

  if (deliveryType === "delivery") {
    addressGroup.style.display = "block"
    addressField.required = true
  } else {
    addressGroup.style.display = "none"
    addressField.required = false
  }

  updateCheckoutTotals()
}

// Toggle informações específicas do método de pagamento (PIX ou Troco)
function togglePaymentSpecificFields() {
  const paymentMethod = document.getElementById("payment-method").value
  const pixInfo = document.getElementById("pix-info")
  const pixKey = document.getElementById("pix-key")
  const changeInfo = document.getElementById("change-info")
  const changeForAmount = document.getElementById("change-for-amount")

  // Esconde ambos por padrão
  pixInfo.style.display = "none"
  changeInfo.style.display = "none"
  changeForAmount.required = false // Remove a obrigatoriedade

  if (paymentMethod === "pix") {
    pixInfo.style.display = "block"
    pixKey.textContent = settings.pix_key || "Não configurado"
  } else if (paymentMethod === "money") {
    changeInfo.style.display = "block"
    // changeForAmount.required = true; // Opcional: tornar obrigatório se quiser forçar o preenchimento
  }
}

// Submeter pedido
async function submitOrder(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const deliveryType = document.getElementById("delivery-type").value
  const paymentMethod = document.getElementById("payment-method").value

  const totalAmount = Number.parseFloat(document.getElementById("checkout-total").textContent.replace(",", ".")) // Pega o total já calculado

  const changeForAmount =
    paymentMethod === "money" ? Number.parseFloat(document.getElementById("change-for-amount").value) || 0 : 0

  const orderData = {
    customer_name: document.getElementById("customer-name").value,
    customer_phone: document.getElementById("customer-phone").value,
    customer_address: document.getElementById("customer-address").value || null,
    items: JSON.stringify(cart), // O carrinho já contém os acréscimos
    total_amount: totalAmount,
    delivery_fee: deliveryType === "delivery" ? Number.parseFloat(settings.delivery_fee || 0) : 0,
    payment_method: paymentMethod,
    delivery_type: deliveryType,
    status: "pending",
    change_for: changeForAmount > 0 ? changeForAmount : null,
  }

  // Validação do troco
  if (paymentMethod === "money" && changeForAmount > 0 && changeForAmount < totalAmount) {
    alert(
      `O valor para troco (R$ ${changeForAmount.toFixed(2).replace(".", ",")}) deve ser maior ou igual ao total do pedido (R$ ${totalAmount.toFixed(2).replace(".", ",")}).`,
    )
    document.getElementById("change-for-amount").focus()
    return
  }

  try {
    const { data, error } = await supabase.from("orders").insert([orderData]).select()

    if (error) throw error

    // Enviar para WhatsApp
    await sendToWhatsApp(orderData, data[0].id)

    // Fechar modal de checkout
    document.getElementById("checkout-modal").style.display = "none"

    // Mostrar modal de sucesso
    document.getElementById("order-number").textContent = data[0].id
    document.getElementById("success-modal").style.display = "block"

    // Limpar carrinho
    clearCart()
  } catch (error) {
    console.error("Erro ao submeter pedido:", error)
    alert("Erro ao enviar pedido. Tente novamente.")
  }
}

// Enviar pedido para WhatsApp
async function sendToWhatsApp(orderData, orderId) {
  try {
    // Montar mensagem do pedido
    let message = `🛒 *NOVO PEDIDO #${orderId}*\n\n`
    message += `👤 *Cliente:* ${orderData.customer_name}\n`
    message += `📱 *Telefone:* ${orderData.customer_phone}\n`
    message += `🚚 *Tipo:* ${orderData.delivery_type === "delivery" ? "Entrega" : "Retirada"}\n`

    if (orderData.customer_address) {
      message += `📍 *Endereço:* ${orderData.customer_address}\n`
    }

    message += `💳 *Pagamento:* ${getPaymentMethodText(orderData.payment_method)}\n`

    // Adiciona informação de troco se for dinheiro
    if (orderData.payment_method === "money" && orderData.change_for > 0) {
      const troco = orderData.change_for - orderData.total_amount
      message += `*Troco para:* R$ ${orderData.change_for.toFixed(2).replace(".", ",")}\n`
      message += `*Troco a ser dado:* R$ ${troco.toFixed(2).replace(".", ",")}\n`
    }
    message += `\n` // Linha em branco para separar

    message += `📋 *ITENS DO PEDIDO:*\n`
    JSON.parse(orderData.items).forEach((item) => {
      // Usa orderData.items diretamente
      let itemLine = `• ${item.quantity}x ${item.name}`
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        itemLine += ` (`
        itemLine += item.selectedAddons.map((addon) => `${addon.name}`).join(", ")
        itemLine += `)`
      }
      itemLine += ` - R$ ${(
        item.price * item.quantity +
        (item.selectedAddons ? item.selectedAddons.reduce((sum, addon) => sum + addon.price, 0) * item.quantity : 0)
      )
        .toFixed(2)
        .replace(".", ",")}\n`
      message += itemLine
    })

    message += `\n💰 *VALORES:*\n`
    message += `Subtotal: R$ ${(orderData.total_amount - orderData.delivery_fee).toFixed(2).replace(".", ",")}\n`

    if (orderData.delivery_fee > 0) {
      message += `Taxa de Entrega: R$ ${orderData.delivery_fee.toFixed(2).replace(".", ",")}\n`
    }

    message += `*TOTAL: R$ ${orderData.total_amount.toFixed(2).replace(".", ",")}*\n\n`

    if (orderData.payment_method === "pix") {
      message += `🔑 *Chave PIX:* ${settings.pix_key}\n`
      message += `📄 *Envie o comprovante após o pagamento*\n\n`
    }

    message += `⏰ *Pedido realizado em:* ${new Date().toLocaleString("pt-BR")}\n`
    message += `🏪 *${settings.store_name || "Restaurante"}*`

    // Número do WhatsApp da loja (extrair apenas números do telefone)
    const whatsappNumber = settings.whatsapp_number ? settings.whatsapp_number.replace(/\D/g, "") : ""

    if (whatsappNumber) {
      // Codificar mensagem para URL
      const encodedMessage = encodeURIComponent(message)

      // Abrir WhatsApp
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      window.open(whatsappUrl, "_blank")
    } else {
      console.warn("Número do WhatsApp não configurado nas configurações do admin.")
      alert("Número do WhatsApp da loja não configurado. O pedido foi salvo, mas não enviado via WhatsApp.")
    }
  } catch (error) {
    console.error("Erro ao enviar para WhatsApp:", error)
    alert("Erro ao enviar pedido para WhatsApp. O pedido foi salvo, mas não enviado via WhatsApp.")
  }
}

// Função auxiliar para texto do método de pagamento
function getPaymentMethodText(method) {
  const methodMap = {
    pix: "PIX",
    money: "Dinheiro",
    card: "Cartão",
  }
  return methodMap[method] || method
}

// Mostrar/ocultar loading
function showLoading(show) {
  const loadingElement = document.getElementById("loading")
  if (loadingElement) {
    if (show) {
      loadingElement.classList.remove("hidden")
      loadingElement.style.display = "flex"
    } else {
      loadingElement.classList.add("hidden")
      // Espera a transição terminar antes de ocultar completamente
      loadingElement.addEventListener("transitionend", function handler() {
        loadingElement.style.display = "none"
        loadingElement.removeEventListener("transitionend", handler)
      })
    }
  }
}

// Mostrar mensagem de fechado
function showClosedMessage() {
  const openingHours = `${settings.opening_time || "08:00"} às ${settings.closing_time || "22:00"}`
  document.getElementById("opening-hours").textContent = openingHours
  document.getElementById("closed-message").style.display = "flex"
}

// Mostrar conteúdo principal
function showMainContent() {
  document.getElementById("main-content").style.display = "block"
}

// Formatação de moeda
function formatCurrency(value) {
  return `R$ ${Number.parseFloat(value).toFixed(2).replace(".", ",")}`
}

// Formatação de telefone
function formatPhone(phone) {
  return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3")
}

// Validação de formulário
function validateForm(formId) {
  const form = document.getElementById(formId)
  const inputs = form.querySelectorAll("input[required], select[required], textarea[required]")

  for (const input of inputs) {
    if (!input.value.trim()) {
      input.focus()
      alert(`Por favor, preencha o campo: ${input.previousElementSibling.textContent}`)
      return false
    }
  }

  return true
}

// Máscara para telefone
document.addEventListener("DOMContentLoaded", () => {
  const phoneInputs = document.querySelectorAll('input[type="tel"]')

  phoneInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")

      if (value.length <= 11) {
        if (value.length <= 2) {
          value = value.replace(/(\d{0,2})/, "($1")
        } else if (value.length <= 7) {
          value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
        } else {
          value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
        }
      }

      e.target.value = value
    })
  })
})

// Função para debug (remover em produção)
function debugInfo() {
  console.log("Settings:", settings)
  console.log("Categories:", categories)
  console.log("Products:", products)
  console.log("Cart:", cart)
  console.log("Addons:", allAddons)
}

// Adicionar ao escopo global para debug
window.debugInfo = debugInfo
