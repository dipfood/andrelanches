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
  acrescimos: [
    {
      id: 1,
      nome: "Hamburguer 150g",
      preco: 8.0,
      categoria: "carnes",
      ativo: true,
    },
    {
      id: 2,
      nome: "Hamburguer comum 90g",
      preco: 4.0,
      categoria: "carnes",
      ativo: true,
    },
    {
      id: 3,
      nome: "Bacon",
      preco: 5.0,
      categoria: "carnes",
      ativo: true,
    },
    {
      id: 4,
      nome: "Calabresa",
      preco: 4.0,
      categoria: "carnes",
      ativo: true,
    },
    {
      id: 5,
      nome: "Milho",
      preco: 4.0,
      categoria: "vegetais",
      ativo: true,
    },
    {
      id: 6,
      nome: "Presunto",
      preco: 4.0,
      categoria: "carnes",
      ativo: true,
    },
    {
      id: 7,
      nome: "Mussarela",
      preco: 5.0,
      categoria: "queijos",
      ativo: true,
    },
    {
      id: 8,
      nome: "Cheddar",
      preco: 5.0,
      categoria: "queijos",
      ativo: true,
    },
    {
      id: 9,
      nome: "Catupiry",
      preco: 5.0,
      categoria: "queijos",
      ativo: true,
    },
    {
      id: 10,
      nome: "Frango",
      preco: 4.0,
      categoria: "carnes",
      ativo: true,
    },
    {
      id: 11,
      nome: "Contra Filé",
      preco: 8.0,
      categoria: "carnes",
      ativo: true,
    },
    {
      id: 12,
      nome: "Salsicha",
      preco: 2.0,
      categoria: "carnes",
      ativo: true,
    },
    {
      id: 13,
      nome: "Alface",
      preco: 2.0,
      categoria: "vegetais",
      ativo: true,
    },
    {
      id: 14,
      nome: "Tomate",
      preco: 2.0,
      categoria: "vegetais",
      ativo: true,
    },
    {
      id: 15,
      nome: "Cebola",
      preco: 2.0,
      categoria: "vegetais",
      ativo: true,
    },
    {
      id: 16,
      nome: "Cebola Caramelizada",
      preco: 3.0,
      categoria: "vegetais",
      ativo: true,
    },
    {
      id: 17,
      nome: "3 Cebolas Empanadas",
      preco: 7.0,
      categoria: "vegetais",
      ativo: true,
    },
    {
      id: 18,
      nome: "Bacon Fatiado",
      preco: 7.0,
      categoria: "carnes",
      ativo: true,
    },
    {
      id: 19,
      nome: "Ovo",
      preco: 3.0,
      categoria: "extras",
      ativo: true,
    },
  ],
  categoriasAcrescimos: [
    {
      id: "carnes",
      nome: "Carnes",
      icone: "🥓",
      ativo: true,
    },
    {
      id: "queijos",
      nome: "Queijos",
      icone: "🧀",
      ativo: true,
    },
    {
      id: "vegetais",
      nome: "Vegetais",
      icone: "🥬",
      ativo: true,
    },
    {
      id: "extras",
      nome: "Extras",
      icone: "🍳",
      ativo: true,
    },
  ],
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
      name: "Ipanema",
      price: 20.0,
      description: "Pão, hambúrguer 150g, queijo, alface, tomate, cebola roxa, maionese da casa",
      disponivel: true,
    },
    {
      name: "Itália",
      price: 26.0,
      description:
        "Pão, hambúrguer 150g, queijo, bacon, cebola caramelizada, alho crocante, alface, tomate, maionese da casa",
      disponivel: true,
    },
    {
      name: "Bom Bacon",
      price: 24.0,
      description: "Pão, hambúrguer 150g, queijo, bacon, alface, tomate, maionese da casa",
      disponivel: true,
    },
    {
      name: "3 Queijos",
      price: 27.0,
      description: "Pão, hambúrguer 150g, 3 queijos, queijo, cheddar, catupiry Scala",
      disponivel: true,
    },
    {
      name: "Paris Burguer",
      price: 25.0,
      description: "Pão, hambúrguer 150g, queijo, 3 cebolas empanadas, tomate, maionese da casa",
      disponivel: true,
    },
    {
      name: "Dubai",
      price: 25.0,
      description: "Pão, hambúrguer 150g, queijo, ovo, cheddar Scala, alface, tomate, cebola roxa, maionese da casa",
      disponivel: true,
    },
    {
      name: "Manaus",
      price: 27.0,
      description:
        "Pão, hambúrguer 150g, queijo, bacon, catupiry, alface, cebola roxa, farofa com alho crocante, maionese da casa",
      disponivel: true,
    },
    {
      name: "Minas",
      price: 23.0,
      description: "Pão, 2 hambúrgueres 150g, queijo, cheddar, alface, tomate, maionese da casa",
      disponivel: true,
    },
    {
      name: "Mega Burguer",
      price: 28.0,
      description: "Pão, 2 hambúrgueres 150g, queijo, cebola caramelizada, maionese da casa",
      disponivel: true,
    },
    {
      name: "Top Bacon",
      price: 20.0,
      description: "Pão, 2 hambúrgueres 150g, queijo, cheddar, bacon, maionese da casa",
      disponivel: true,
    },
    {
      name: "Tubarão",
      price: 33.0,
      description: "Pão, 2 hambúrgueres 150g, 2 camadas de cheddar, 2 camadas de bacon, cebola roxa",
      disponivel: true,
    },
  ],
  frango: [
    {
      name: "X-Frango",
      price: 16.0,
      description: "Pão, frango, queijo, tomate, maionese da casa",
      disponivel: true,
    },
    {
      name: "X-Frango Bacon",
      price: 20.0,
      description: "Pão, frango, bacon, queijo, tomate, maionese da casa",
      disponivel: true,
    },
    {
      name: "X-Frango Catupiry",
      price: 20.0,
      description: "Pão, frango, catupiry, queijo, tomate, maionese da casa",
      disponivel: true,
    },
    {
      name: "X-Frango Casamba",
      price: 25.0,
      description: "Pão, frango, bacon, calabresa, queijo, batata palha, alface, tomate, maionese da casa",
      disponivel: true,
    },
  ],
  carne: [
    {
      name: "X-Bauru",
      price: 22.0,
      description: "Pão, carne, queijo, tomate, maionese da casa",
      disponivel: true,
    },
    {
      name: "X-Bauru Bacon",
      price: 25.0,
      description: "Pão, carne, bacon, queijo, tomate, maionese da casa",
      disponivel: true,
    },
    {
      name: "X-Bauru Catupiry",
      price: 25.0,
      description: "Pão, carne, catupiry, queijo, tomate, maionese da casa",
      disponivel: true,
    },
  ],
  hotdog: [
    {
      name: "Hot Dog Quente",
      price: 10.0,
      description: "Pão, 2 salsichas, maionese, catchup, mostarda, batata palha",
      disponivel: true,
    },
    {
      name: "Hot Dog Bacon",
      price: 17.0,
      description: "Pão, 2 salsichas, maionese, catchup, mostarda, bacon, batata palha",
      disponivel: true,
    },
    {
      name: "Hot Dog Completo",
      price: 19.0,
      description: "Pão, 2 salsichas, maionese, catchup, mostarda, tomate, bacon, catupiry, batata palha",
      disponivel: true,
    },
  ],
  bebidas: [
    {
      name: "Roller",
      price: 10.0,
      description: "2L",
      disponivel: true,
    },
    {
      name: "Poty",
      price: 10.0,
      description: "2L",
      disponivel: true,
    },
    {
      name: "Coca Cola",
      price: 15.0,
      description: "2L",
      disponivel: true,
    },
    {
      name: "Fanta Laranja",
      price: 12.0,
      description: "2L",
      disponivel: true,
    },
    {
      name: "Fanta Uva",
      price: 12.0,
      description: "2L",
      disponivel: true,
    },
    {
      name: "Sprite",
      price: 12.0,
      description: "2L",
      disponivel: true,
    },
    {
      name: "Roller",
      price: 6.0,
      description: "600ML",
      disponivel: true,
    },
    {
      name: "Poty",
      price: 6.0,
      description: "600ml",
      disponivel: true,
    },
    {
      name: "Roller",
      price: 6.0,
      description: "Lata",
      disponivel: true,
    },
    {
      name: "Poty",
      price: 6.0,
      description: "Lata",
      disponivel: true,
    },
    {
      name: "Coca Cola",
      price: 6.0,
      description: "Lata",
      disponivel: true,
    },
    {
      name: "Fanta Laranja",
      price: 6.0,
      description: "Lata",
      disponivel: true,
    },
    {
      name: "Sprite",
      price: 6.0,
      description: "Lata",
      disponivel: true,
    },
    {
      name: "Crystal",
      price: 4.0,
      description: "Lata",
      disponivel: true,
    },
    {
      name: "Antarctica Boa",
      price: 5.0,
      description: "Lata",
      disponivel: true,
    },
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
