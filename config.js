const supabaseConfig = {
  url: "https://ixqjqjqjqjqjqjqjqjqj.supabase.co", // Placeholder - será substituído pelas variáveis reais
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Placeholder - será substituído pelas variáveis reais
}

// Para uso em produção, use as variáveis de ambiente reais:
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)

// Exportar para uso global
window.supabaseClient = supabase

console.log("Supabase configurado e pronto para uso")
