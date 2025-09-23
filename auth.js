// Sistema de autenticação
class AuthSystem {
  constructor() {
    this.currentUser = null
    this.init()
  }

  init() {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser)
      this.redirectToApp()
    }

    // Configurar form de login
    const loginForm = document.getElementById("loginForm")
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e))
    }
  }

  async handleLogin(e) {
    e.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const errorDiv = document.getElementById("loginError")

    try {
      // Buscar usuário no banco usando o cliente global
      const { data: users, error } = await window.supabaseClient
        .from("users")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single()

      if (error || !users) {
        this.showError("Usuário ou senha incorretos")
        return
      }

      // Salvar usuário logado
      this.currentUser = users
      localStorage.setItem("currentUser", JSON.stringify(users))

      // Redirecionar baseado no role
      this.redirectToApp()
    } catch (error) {
      console.error("Erro no login:", error)
      this.showError("Erro ao fazer login. Tente novamente.")
    }
  }

  redirectToApp() {
    if (this.currentUser.role === "admin") {
      window.location.href = "admin.html"
    } else {
      window.location.href = "checklist.html"
    }
  }

  showError(message) {
    const errorDiv = document.getElementById("loginError")
    errorDiv.textContent = message
    errorDiv.style.display = "block"
  }

  logout() {
    this.currentUser = null
    localStorage.removeItem("currentUser")
    window.location.href = "index.html"
  }

  getCurrentUser() {
    if (!this.currentUser) {
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser)
      }
    }
    return this.currentUser
  }

  requireAuth() {
    if (!this.getCurrentUser()) {
      window.location.href = "index.html"
      return false
    }
    return true
  }

  requireAdmin() {
    const user = this.getCurrentUser()
    if (!user || user.role !== "admin") {
      window.location.href = "index.html"
      return false
    }
    return true
  }
}

// Inicializar sistema de autenticação
const auth = new AuthSystem()

export { auth }
