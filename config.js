// Configuração do Cardápio Digital
const CONFIG = {
  // Informações da Empresa
  empresa: {
    nome: "Paris Burger",
    logo: "/placeholder.svg?height=80&width=80",
    telefone: "(11) 99999-9999",
    endereco: "Rua das Flores, 123 - Centro",
    instagram: "@parisburguer",
    facebook: "parisburguer",
  },

  // Configuração de Horário de Funcionamento
  horarioFuncionamento: {
    ativo: true, // true/false para ativar/desativar verificação de horário
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

  // Formas de Pagamento
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

  // Categorias do Cardápio
  categorias: [
    {
      id: "burgers",
      nome: "Sanduíches",
      icone: "🍔",
      ativo: true,
    },
    {
      id: "bebidas",
      nome: "Bebidas",
      icone: "🥤",
      ativo: true,
    },
    {
      id: "porcoes",
      nome: "Porções",
      icone: "🍟",
      ativo: true,
    },
    {
      id: "sobremesas",
      nome: "Sobremesas",
      icone: "🍰",
      ativo: true,
    },
  ],

  // Produtos do Cardápio

  // Configurações Gerais
  configuracoes: {
    tema: "dark", // dark ou light
    mostraPrecos: true,
    permiteCarrinho: true,
    whatsappPedidos: true,
    numeroWhatsapp: "5511999999999",
  },
}

// Remova o array CONFIG.produtos e substitua por:
const menuItems = {
  sandwiches: [
    {
      name: "Misto Quente",
      price: 14.0,
      description: "Hambúrguer, queijo, Presunto, tomate e Maionese da Casa",
      noAddons: false,
    },
    { name: "X-Burguer", price: 12.0, description: "Hambúrguer, queijo, tomate e Maionese da Casa" },
    { name: "X-Salada", price: 13.0, description: "Hambúrguer, queijo, alface, tomate e Maionese da Casa" },
    { name: "X-Catupiry", price: 18.0, description: "Hambúrguer, Catupiry, queijo, alface, tomate e Maionese da Casa" },
    {
      name: "X-Calabresa",
      price: 17.0,
      description: "Hambúrguer, Calabresa, queijo, alface, tomate e Maionese da Casa",
    },
    { name: "X-Bacon", price: 18.0, description: "Hambúrguer, Bacon, queijo, alface, tomate e Maionese da Casa" },
    { name: "X-Milho", price: 14.0, description: "Hambúrguer, milho, salada e mussarela" },
    { name: "X-Egg", price: 14.0, description: "Hambúrguer, Ovo, queijo, alface, tomate e Maionese da Casa" },
    {
      name: "X-Tudo",
      price: 20.0,
      description: "Hambúrguer, Queijo, bacon, calabresa, catupiry, ovo, frango, alface, tomate e Maionese da Casa",
    },
    {
      name: "X-Pit Bull",
      price: 34.0,
      description:
        "Hambúrguer 150g, 1 Hamburguer tradicional, 2 Salsichas, Queijo, bacon, calabresa, catupiry, 2 ovos, frango, alface, tomate e Maionese da Casa",
    },
  ],

  bebidas: [
    { name: "Refrigerante Lata", price: 5.9, description: "Coca-Cola, Guaraná, Fanta - 350ml" },
    { name: "Suco Natural", price: 8.9, description: "Laranja, Limão, Maracujá - 400ml" },
    { name: "Água Mineral", price: 3.5, description: "Água mineral 500ml" },
  ],

  porcoes: [
    { name: "Batata Frita", price: 18.9, description: "Batata rústica com casca, tempero especial - serve 2 pessoas" },
    { name: "Onion Rings", price: 16.9, description: "Anéis de cebola empanados e fritos - 12 unidades" },
    { name: "Nuggets", price: 15.9, description: "Nuggets de frango crocantes - 10 unidades" },
  ],

  sobremesas: [
    { name: "Brownie com Sorvete", price: 14.9, description: "Brownie de chocolate com sorvete de baunilha e calda" },
    { name: "Petit Gateau", price: 16.9, description: "Bolinho de chocolate quente com sorvete" },
  ],
}

// Adicione esta função para converter menuItems para o formato usado pelo sistema:
function convertMenuItemsToProducts() {
  const produtos = []
  let id = 1

  Object.keys(menuItems).forEach((categoria) => {
    menuItems[categoria].forEach((item) => {
      produtos.push({
        id: id++,
        categoria: categoria === "sandwiches" ? "burgers" : categoria,
        nome: item.name,
        descricao: item.description,
        preco: item.price,
        imagem: "/placeholder.svg?height=200&width=300",
        disponivel: true,
        destaque: item.name === "X-Pit Bull" || item.name === "X-Tudo",
        noAddons: item.noAddons || false,
      })
    })
  })

  return produtos
}

// Substitua CONFIG.produtos por:
CONFIG.produtos = convertMenuItemsToProducts()

// Adicionar no final do arquivo, antes da exportação:

// Sistema de Administração
const ADMIN_CONFIG = {
  // Credenciais de acesso (em produção, use um sistema mais seguro)
  login: {
    usuario: "admin",
    senha: "123456", // ALTERE ESTA SENHA!
  },

  // Configurações que podem ser alteradas pelo admin
  configuracoes_editaveis: ["horarioFuncionamento", "produtos", "pagamento", "empresa"],
}

// Função para salvar configurações no localStorage
function salvarConfiguracoes() {
  localStorage.setItem("menuConfig", JSON.stringify(CONFIG))
  localStorage.setItem("menuItems", JSON.stringify(menuItems))
}

// Função para carregar configurações do localStorage
function carregarConfiguracoes() {
  const configSalva = localStorage.getItem("menuConfig")
  const menuItemsSalvo = localStorage.getItem("menuItems")

  if (configSalva) {
    const configCarregada = JSON.parse(configSalva)
    // Mesclar configurações salvas com as padrão
    Object.assign(CONFIG, configCarregada)
  }

  if (menuItemsSalvo) {
    const menuCarregado = JSON.parse(menuItemsSalvo)
    Object.assign(menuItems, menuCarregado)
    // Reconverter produtos
    CONFIG.produtos = convertMenuItemsToProducts()
  }
}

// Carregar configurações ao inicializar
carregarConfiguracoes()

// Exportar configuração
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CONFIG, menuItems, ADMIN_CONFIG, salvarConfiguracoes, carregarConfiguracoes }
}
