// Configuração do Supabase
const SUPABASE_URL = "https://bzzkdbgcufmrlinbkepc.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6emtkYmdjdWZtcmxpbmJrZXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzM4MzIsImV4cCI6MjA2NTg0OTgzMn0.3Gx_KcM6ufevjUr215XJ2IGQNOllX-PH5MK0FU15nvg"

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Configurações padrão (fallback)
const DEFAULT_CONFIG = {
  empresa: {
    nome: "Paris Burger",
    logo: "/placeholder.svg?height=80&width=80",
    telefone: "(11) 99999-9999",
    endereco: "Rua das Flores, 123 - Centro",
    instagram: "@parisburguer",
    facebook: "parisburguer",
  },
  horarioFuncionamento: {
    ativo: true,
    horarios: {
      segunda: { aberto: true, abertura: "18:00", fechamento: "23:30" },
      terca: { aberto: true, abertura: "18:00", fechamento: "23:30" },
      quarta: { aberto: true, abertura: "18:00", fechamento: "23:30" },
      quinta: { aberto: true, abertura: "18:00", fechamento: "23:30" },
      sexta: { aberto: true, abertura: "18:00", fechamento: "23:30" },
      sabado: { aberto: true, abertura: "18:00", fechamento: "00:00" },
      domingo: { aberto: true, abertura: "18:00", fechamento: "23:30" },
    },
  },
  pagamento: {
    pix: {
      ativo: true,
      chave: "parisburguer@email.com",
      qrcode: "/placeholder.svg?height=200&width=200",
    },
    dinheiro: {
      ativo: true,
      troco: true,
    },
    cartao: {
      ativo: true,
      credito: true,
      debito: true,
    },
    delivery: {
      ativo: true,
      taxa: 5.0,
      tempoEntrega: "45-60 min",
    },
  },
  categorias: [
    {
      id: "lanches",
      nome: "Lanches",
      icone: "🍔",
      ativo: true,
    },
    {
      id: "artesanais",
      nome: "Artesanais",
      icone: "🍖",
      ativo: true,
    },
    {
      id: "frango",
      nome: "Frango",
      icone: "🍗",
      ativo: true,
    },
    {
      id: "carne",
      nome: "Carne",
      icone: "🥩",
      ativo: true,
    },
    {
      id: "hotdog",
      nome: "Hot Dog",
      icone: "🌭",
      ativo: true,
    },
    {
      id: "bebidas",
      nome: "Bebidas",
      icone: "🥤",
      ativo: true,
    },
  ],
  configuracoes: {
    tema: "dark",
    mostraPrecos: true,
    permiteCarrinho: true,
    whatsappPedidos: true,
    numeroWhatsapp: "5511999999999",
  },
}

const DEFAULT_MENU_ITEMS = {
  lanches: [
    {
      name: "X-Burguer",
      price: 12.0,
      description: "Hambúrguer, queijo, tomate e Maionese da Casa",
      disponivel: true,
    },
    {
      name: "X-Salada",
      price: 13.0,
      description: "Hambúrguer, queijo, alface, tomate e Maionese da Casa",
      disponivel: true,
    },
    {
      name: "X-Bacon",
      price: 18.0,
      description: "Hambúrguer, Bacon, queijo, alface, tomate e Maionese da Casa",
      disponivel: true,
    },
  ],
  artesanais: [
    {
      name: "Burger Artesanal",
      price: 25.0,
      description: "Hambúrguer artesanal 180g, queijo especial, rúcula e tomate seco",
      disponivel: true,
    },
    {
      name: "Smash Burger",
      price: 22.0,
      description: "Dois hambúrgueres smash, queijo cheddar, cebola caramelizada",
      disponivel: true,
    },
  ],
  frango: [
    {
      name: "X-Frango",
      price: 16.0,
      description: "Peito de frango grelhado, queijo, alface, tomate e maionese",
      disponivel: true,
    },
    {
      name: "Chicken Crispy",
      price: 18.0,
      description: "Frango empanado crocante, queijo, alface e molho especial",
      disponivel: true,
    },
  ],
  carne: [
    {
      name: "X-Tudo",
      price: 20.0,
      description: "Hambúrguer, Queijo, bacon, calabresa, catupiry, ovo, frango, alface, tomate e Maionese da Casa",
      disponivel: true,
    },
    {
      name: "X-Pit Bull",
      price: 34.0,
      description:
        "Hambúrguer 150g, 1 Hamburguer tradicional, 2 Salsichas, Queijo, bacon, calabresa, catupiry, 2 ovos, frango, alface, tomate e Maionese da Casa",
      disponivel: true,
    },
  ],
  hotdog: [
    {
      name: "Hot Dog Tradicional",
      price: 8.0,
      description: "Salsicha, batata palha, milho, ervilha, queijo ralado e molhos",
      disponivel: true,
    },
    {
      name: "Hot Dog Especial",
      price: 12.0,
      description: "Salsicha, bacon, queijo derretido, batata palha e molhos especiais",
      disponivel: true,
    },
  ],
  bebidas: [
    { name: "Refrigerante Lata", price: 5.9, description: "Coca-Cola, Guaraná, Fanta - 350ml", disponivel: true },
    { name: "Suco Natural", price: 8.9, description: "Laranja, Limão, Maracujá - 400ml", disponivel: true },
    { name: "Água Mineral", price: 3.5, description: "Água mineral 500ml", disponivel: true },
  ],
}

// Funções do Supabase
async function salvarConfigSupabase(config) {
  try {
    const { data, error } = await supabase.from("configuracoes").upsert({
      id: 1,
      config: config,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    console.log("✅ Configurações salvas no Supabase:", data)
    return true
  } catch (error) {
    console.error("❌ Erro ao salvar configurações:", error)
    return false
  }
}

async function salvarMenuItemsSupabase(menuItems) {
  try {
    const { data, error } = await supabase.from("menu_items").upsert({
      id: 1,
      items: menuItems,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    console.log("✅ Menu items salvos no Supabase:", data)
    return true
  } catch (error) {
    console.error("❌ Erro ao salvar menu items:", error)
    return false
  }
}

async function carregarConfigSupabase() {
  try {
    const { data, error } = await supabase.from("configuracoes").select("*").eq("id", 1).single()

    if (error && error.code !== "PGRST116") throw error

    return data ? data.config : DEFAULT_CONFIG
  } catch (error) {
    console.error("❌ Erro ao carregar configurações:", error)
    return DEFAULT_CONFIG
  }
}

async function carregarMenuItemsSupabase() {
  try {
    const { data, error } = await supabase.from("menu_items").select("*").eq("id", 1).single()

    if (error && error.code !== "PGRST116") throw error

    return data ? data.items : DEFAULT_MENU_ITEMS
  } catch (error) {
    console.error("❌ Erro ao carregar menu items:", error)
    return DEFAULT_MENU_ITEMS
  }
}

// Função para inicializar dados padrão
async function inicializarDadosPadrao() {
  try {
    // Verificar se já existem dados
    const { data: configData } = await supabase.from("configuracoes").select("id").eq("id", 1).single()

    if (!configData) {
      console.log("🔄 Inicializando dados padrão...")
      await salvarConfigSupabase(DEFAULT_CONFIG)
      await salvarMenuItemsSupabase(DEFAULT_MENU_ITEMS)
      console.log("✅ Dados padrão inicializados!")
    }
  } catch (error) {
    console.error("❌ Erro ao inicializar dados padrão:", error)
  }
}

// Configurar listeners em tempo real
function configurarRealtimeListeners() {
  // Listener para configurações
  supabase
    .channel("configuracoes-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "configuracoes",
      },
      (payload) => {
        console.log("🔄 Configurações atualizadas:", payload)
        if (payload.new && payload.new.config) {
          window.CONFIG = payload.new.config
          window.CONFIG.produtos = window.convertMenuItemsToProducts()

          // Disparar evento customizado
          window.dispatchEvent(
            new CustomEvent("configUpdated", {
              detail: { config: window.CONFIG, source: "supabase" },
            }),
          )
        }
      },
    )
    .subscribe()

  // Listener para menu items
  supabase
    .channel("menu-items-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "menu_items",
      },
      (payload) => {
        console.log("🔄 Menu items atualizados:", payload)
        if (payload.new && payload.new.items) {
          window.menuItems = payload.new.items
          window.CONFIG.produtos = window.convertMenuItemsToProducts()

          // Disparar evento customizado
          window.dispatchEvent(
            new CustomEvent("menuItemsUpdated", {
              detail: { menuItems: window.menuItems, source: "supabase" },
            }),
          )
        }
      },
    )
    .subscribe()
}

// Exportar funções
if (typeof window !== "undefined") {
  window.supabaseConfig = {
    salvarConfigSupabase,
    salvarMenuItemsSupabase,
    carregarConfigSupabase,
    carregarMenuItemsSupabase,
    inicializarDadosPadrao,
    configurarRealtimeListeners,
    DEFAULT_CONFIG,
    DEFAULT_MENU_ITEMS,
  }

  // Declare CONFIG and menuItems variables
  window.CONFIG = DEFAULT_CONFIG
  window.menuItems = DEFAULT_MENU_ITEMS

  // Declare convertMenuItemsToProducts function
  window.convertMenuItemsToProducts = () => {
    // Implement the conversion logic here
    return {}
  }
}
