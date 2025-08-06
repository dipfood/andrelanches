// Sistema de resolução de tenant por subdomínio
class TenantResolver {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.currentTenant = null;
        this.baseDomain = this.getBaseDomain();
    }

    // Obter domínio base
    getBaseDomain() {
        const hostname = window.location.hostname;
        const port = window.location.port;
        
        // Para desenvolvimento local
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return port ? `${hostname}:${port}` : hostname;
        }
        
        // Para produção, extrair domínio base
        const parts = hostname.split('.');
        if (parts.length > 2) {
            return parts.slice(-2).join('.');
        }
        
        return hostname;
    }

    // Extrair subdomínio da URL atual
    getSubdomain() {
        const hostname = window.location.hostname;
        
        // Para desenvolvimento local, verificar se há subdomínio
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Verificar se há parâmetro de subdomínio na URL para desenvolvimento
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('tenant') || null;
        }
        
        // Para produção, extrair subdomínio
        const parts = hostname.split('.');
        if (parts.length > 2) {
            return parts[0];
        }
        
        return null;
    }

    // Resolver tenant atual
    async resolveTenant() {
        const subdomain = this.getSubdomain();
        
        if (!subdomain) {
            throw new Error('Subdomínio não encontrado');
        }

        try {
            const { data, error } = await this.supabase
                .rpc('get_company_by_subdomain', { subdomain_param: subdomain });

            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error('Empresa não encontrada ou inativa');
            }

            this.currentTenant = data[0];
            return this.currentTenant;
        } catch (error) {
            console.error('Erro ao resolver tenant:', error);
            throw error;
        }
    }

    // Obter tenant atual
    getCurrentTenant() {
        return this.currentTenant;
    }

    // Verificar se tenant está ativo
    isTenantActive() {
        return this.currentTenant && this.currentTenant.status === 'active';
    }

    // Obter configurações do tenant
    getTenantSettings() {
        return this.currentTenant?.settings || {};
    }

    // Aplicar configurações visuais do tenant
    applyTenantBranding() {
        if (!this.currentTenant) return;

        const settings = this.getTenantSettings();
        
        // Aplicar cores personalizadas
        if (settings.headerColorStart && settings.headerColorEnd) {
            const header = document.querySelector('.header');
            if (header) {
                header.style.background = `linear-gradient(135deg, ${settings.headerColorStart} 0%, ${settings.headerColorEnd} 100%)`;
            }
        }

        if (settings.backgroundColor) {
            document.body.style.backgroundColor = settings.backgroundColor;
        }

        // Aplicar logo
        if (this.currentTenant.logo_url) {
            const logoElements = document.querySelectorAll('.splash-logo, .company-logo');
            logoElements.forEach(logo => {
                if (logo.tagName === 'IMG') {
                    logo.src = this.currentTenant.logo_url;
                } else {
                    logo.style.backgroundImage = `url(${this.currentTenant.logo_url})`;
                    logo.style.backgroundSize = 'cover';
                    logo.style.backgroundPosition = 'center';
                }
            });
        }

        // Atualizar título da página
        document.title = this.currentTenant.name + ' - Cardápio Digital';
    }

    // Redirecionar para página de erro se tenant inválido
    redirectToError(message = 'Empresa não encontrada') {
        // Criar página de erro simples
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                padding: 2rem;
            ">
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 3rem;
                    max-width: 500px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                ">
                    <h1 style="font-size: 4rem; margin-bottom: 1rem;">🏢</h1>
                    <h2 style="font-size: 2rem; margin-bottom: 1rem;">Ops!</h2>
                    <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;">
                        ${message}
                    </p>
                    <p style="font-size: 1rem; opacity: 0.7;">
                        Verifique se o endereço está correto ou entre em contato com o suporte.
                    </p>
                </div>
            </div>
        `;
    }
}

// Função para inicializar o sistema multi-tenant
async function initializeTenantSystem(supabaseClient) {
    const resolver = new TenantResolver(supabaseClient);
    
    try {
        // Resolver tenant atual
        await resolver.resolveTenant();
        
        // Verificar se tenant está ativo
        if (!resolver.isTenantActive()) {
            resolver.redirectToError('Esta empresa está temporariamente indisponível');
            return null;
        }
        
        // Aplicar branding do tenant
        resolver.applyTenantBranding();
        
        console.log('✅ Tenant resolvido:', resolver.getCurrentTenant());
        return resolver;
        
    } catch (error) {
        console.error('❌ Erro ao inicializar sistema multi-tenant:', error);
        resolver.redirectToError();
        return null;
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.TenantResolver = TenantResolver;
    window.initializeTenantSystem = initializeTenantSystem;
}
