-- Criar extensão para UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de empresas (tenants)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subdomain VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    logo_url TEXT,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    plan VARCHAR(20) DEFAULT 'basic', -- basic, premium, enterprise
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- Para planos com expiração
    
    -- Configurações específicas da empresa
    settings JSONB DEFAULT '{}',
    
    -- Validações
    CONSTRAINT valid_subdomain CHECK (subdomain ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$' AND length(subdomain) >= 3),
    CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'suspended')),
    CONSTRAINT valid_plan CHECK (plan IN ('basic', 'premium', 'enterprise'))
);

-- Tabela de usuários administradores das empresas
CREATE TABLE IF NOT EXISTS company_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin', -- admin, manager, employee
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(company_id, email),
    CONSTRAINT valid_role CHECK (role IN ('admin', 'manager', 'employee'))
);

-- Criar ou modificar tabela de categorias
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT categories_company_name_unique UNIQUE (company_id, name)
);

-- Criar ou modificar tabela de produtos
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    has_addons BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT products_company_name_unique UNIQUE (company_id, name)
);

-- Criar ou modificar tabela de acréscimos
DROP TABLE IF EXISTS addons CASCADE;
CREATE TABLE addons (
    id SERIAL PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT addons_company_name_unique UNIQUE (company_id, name)
);

-- Criar ou modificar tabela de configurações
DROP TABLE IF EXISTS settings CASCADE;
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT settings_company_key_unique UNIQUE (company_id, key)
);

-- Criar ou modificar tabela de pedidos
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT,
    delivery_type VARCHAR(20) NOT NULL, -- delivery, pickup, table
    payment_method VARCHAR(20) NOT NULL, -- pix, money, card
    table_number INTEGER,
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    change_for DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, preparing, ready, delivered, cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_delivery_type CHECK (delivery_type IN ('delivery', 'pickup', 'table')),
    CONSTRAINT valid_payment_method CHECK (payment_method IN ('pix', 'money', 'card')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'))
);

-- Criar ou modificar tabela de dias de funcionamento
DROP TABLE IF EXISTS working_days CASCADE;
CREATE TABLE working_days (
    id SERIAL PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL,
    is_working BOOLEAN DEFAULT true,
    opening_time TIME,
    closing_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT working_days_company_day_unique UNIQUE (company_id, day_of_week),
    CONSTRAINT valid_day_of_week CHECK (day_of_week IN ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'))
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_companies_subdomain ON companies(subdomain);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_company_admins_company_id ON company_admins(company_id);
CREATE INDEX IF NOT EXISTS idx_company_admins_email ON company_admins(email);

CREATE INDEX IF NOT EXISTS idx_categories_company_id ON categories(company_id);
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_addons_company_id ON addons(company_id);
CREATE INDEX IF NOT EXISTS idx_settings_company_id ON settings(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_company_id ON orders(company_id);
CREATE INDEX IF NOT EXISTS idx_working_days_company_id ON working_days(company_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS set_timestamp_companies ON companies;
CREATE TRIGGER set_timestamp_companies
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS set_timestamp_company_admins ON company_admins;
CREATE TRIGGER set_timestamp_company_admins
    BEFORE UPDATE ON company_admins
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS set_timestamp_categories ON categories;
CREATE TRIGGER set_timestamp_categories
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS set_timestamp_products ON products;
CREATE TRIGGER set_timestamp_products
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS set_timestamp_addons ON addons;
CREATE TRIGGER set_timestamp_addons
    BEFORE UPDATE ON addons
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS set_timestamp_settings ON settings;
CREATE TRIGGER set_timestamp_settings
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS set_timestamp_orders ON orders;
CREATE TRIGGER set_timestamp_orders
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS set_timestamp_working_days ON working_days;
CREATE TRIGGER set_timestamp_working_days
    BEFORE UPDATE ON working_days
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Função para criar dados padrão de uma nova empresa
CREATE OR REPLACE FUNCTION create_default_company_data(company_uuid UUID)
RETURNS VOID AS $$
DECLARE
    category_lanches_id INTEGER;
    category_bebidas_id INTEGER;
    category_sobremesas_id INTEGER;
    category_pratos_id INTEGER;
BEGIN
    -- Inserir configurações padrão
    INSERT INTO settings (company_id, key, value) VALUES
    (company_uuid, 'store_open', 'true'),
    (company_uuid, 'opening_time', '08:00'),
    (company_uuid, 'closing_time', '22:00'),
    (company_uuid, 'delivery_fee', '5.00'),
    (company_uuid, 'pix_key', ''),
    (company_uuid, 'store_name', 'Meu Restaurante'),
    (company_uuid, 'store_phone', '(11) 99999-9999'),
    (company_uuid, 'store_address', 'Rua Exemplo, 123'),
    (company_uuid, 'whatsapp_number', '5511999999999'),
    (company_uuid, 'estimated_pickup_time', '15-20 minutos'),
    (company_uuid, 'estimated_delivery_time', '30-45 minutos'),
    (company_uuid, 'header_color_start', '#667eea'),
    (company_uuid, 'header_color_end', '#764ba2'),
    (company_uuid, 'background_color', '#f8f9fa'),
    (company_uuid, 'enable_delivery', 'true'),
    (company_uuid, 'enable_pickup', 'true'),
    (company_uuid, 'enable_table_order', 'false'),
    (company_uuid, 'auto_print_orders', 'false');

    -- Inserir dias de funcionamento padrão
    INSERT INTO working_days (company_id, day_of_week, is_working) VALUES
    (company_uuid, 'sunday', true),
    (company_uuid, 'monday', true),
    (company_uuid, 'tuesday', true),
    (company_uuid, 'wednesday', true),
    (company_uuid, 'thursday', true),
    (company_uuid, 'friday', true),
    (company_uuid, 'saturday', true);

    -- Inserir categorias padrão e capturar IDs
    INSERT INTO categories (company_id, name, description) VALUES
    (company_uuid, 'Lanches', 'Hambúrgueres e sanduíches')
    RETURNING id INTO category_lanches_id;
    
    INSERT INTO categories (company_id, name, description) VALUES
    (company_uuid, 'Bebidas', 'Refrigerantes, sucos e águas')
    RETURNING id INTO category_bebidas_id;
    
    INSERT INTO categories (company_id, name, description) VALUES
    (company_uuid, 'Sobremesas', 'Doces e sobremesas')
    RETURNING id INTO category_sobremesas_id;
    
    INSERT INTO categories (company_id, name, description) VALUES
    (company_uuid, 'Pratos Principais', 'Pratos completos')
    RETURNING id INTO category_pratos_id;

    -- Inserir acréscimos padrão
    INSERT INTO addons (company_id, name, price, active) VALUES
    (company_uuid, 'Bacon Extra', 3.00, true),
    (company_uuid, 'Queijo Extra', 2.50, true),
    (company_uuid, 'Molho Especial', 1.50, true),
    (company_uuid, 'Batata Frita Pequena', 7.00, true),
    (company_uuid, 'Refrigerante Lata', 5.00, true);

    -- Inserir produtos padrão
    INSERT INTO products (company_id, name, description, price, category_id, has_addons) VALUES
    (company_uuid, 'Hambúrguer Clássico', 'Pão, carne, queijo, alface e tomate', 15.90, category_lanches_id, true),
    (company_uuid, 'Coca-Cola 350ml', 'Refrigerante gelado', 4.50, category_bebidas_id, false);

END;
$$ LANGUAGE plpgsql;

-- Função para verificar se um subdomínio está disponível
CREATE OR REPLACE FUNCTION is_subdomain_available(subdomain_check VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM companies WHERE subdomain = subdomain_check
    );
END;
$$ LANGUAGE plpgsql;

-- Função para obter empresa por subdomínio
CREATE OR REPLACE FUNCTION get_company_by_subdomain(subdomain_param VARCHAR(50))
RETURNS TABLE (
    id UUID,
    subdomain VARCHAR(50),
    name VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(20),
    address TEXT,
    logo_url TEXT,
    status VARCHAR(20),
    plan VARCHAR(20),
    settings JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    expires_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.subdomain, c.name, c.email, c.phone, c.address, 
           c.logo_url, c.status, c.plan, c.settings, c.created_at, 
           c.updated_at, c.expires_at
    FROM companies c
    WHERE c.subdomain = subdomain_param AND c.status = 'active';
END;
$$ LANGUAGE plpgsql;

-- RLS (Row Level Security) para isolamento de dados por empresa
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_days ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (podem ser refinadas conforme necessário)
CREATE POLICY "Companies can view own data" ON companies
    FOR ALL USING (true); -- Ajustar conforme autenticação

CREATE POLICY "Company admins can view own company" ON company_admins
    FOR ALL USING (true); -- Ajustar conforme autenticação

CREATE POLICY "Categories belong to company" ON categories
    FOR ALL USING (true); -- Ajustar conforme autenticação

CREATE POLICY "Products belong to company" ON products
    FOR ALL USING (true); -- Ajustar conforme autenticação

CREATE POLICY "Addons belong to company" ON addons
    FOR ALL USING (true); -- Ajustar conforme autenticação

CREATE POLICY "Settings belong to company" ON settings
    FOR ALL USING (true); -- Ajustar conforme autenticação

CREATE POLICY "Orders belong to company" ON orders
    FOR ALL USING (true); -- Ajustar conforme autenticação

CREATE POLICY "Working days belong to company" ON working_days
    FOR ALL USING (true); -- Ajustar conforme autenticação

-- Inserir empresa de exemplo para desenvolvimento
INSERT INTO companies (subdomain, name, email, phone, address, status, plan) VALUES
('demo', 'Restaurante Demo', 'admin@demo.com', '(11) 99999-9999', 'Rua Demo, 123', 'active', 'premium')
ON CONFLICT (subdomain) DO NOTHING;

-- Criar admin padrão para empresa demo
INSERT INTO company_admins (company_id, name, email, password_hash, role) 
SELECT 
    c.id,
    'Admin Demo',
    'admin@demo.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: "password"
    'admin'
FROM companies c 
WHERE c.subdomain = 'demo'
ON CONFLICT (company_id, email) DO NOTHING;

-- Criar dados padrão para empresa demo
DO $$
DECLARE
    demo_company_id UUID;
BEGIN
    SELECT id INTO demo_company_id FROM companies WHERE subdomain = 'demo';
    IF demo_company_id IS NOT NULL THEN
        PERFORM create_default_company_data(demo_company_id);
    END IF;
END $$;

-- Views úteis para relatórios
CREATE OR REPLACE VIEW company_stats AS
SELECT 
    c.id,
    c.subdomain,
    c.name,
    c.status,
    c.plan,
    c.created_at,
    COUNT(DISTINCT ca.id) as admin_count,
    COUNT(DISTINCT cat.id) as category_count,
    COUNT(DISTINCT p.id) as product_count,
    COUNT(DISTINCT a.id) as addon_count,
    COUNT(DISTINCT o.id) as order_count,
    COALESCE(SUM(o.total_amount), 0) as total_revenue
FROM companies c
LEFT JOIN company_admins ca ON c.id = ca.company_id AND ca.is_active = true
LEFT JOIN categories cat ON c.id = cat.company_id AND cat.active = true
LEFT JOIN products p ON c.id = p.company_id AND p.active = true
LEFT JOIN addons a ON c.id = a.company_id AND a.active = true
LEFT JOIN orders o ON c.id = o.company_id
GROUP BY c.id, c.subdomain, c.name, c.status, c.plan, c.created_at;

-- Comentários para documentação
COMMENT ON TABLE companies IS 'Tabela principal de empresas/tenants do sistema';
COMMENT ON TABLE company_admins IS 'Administradores de cada empresa';
COMMENT ON COLUMN companies.subdomain IS 'Subdomínio único da empresa (ex: empresa.seudominio.com)';
COMMENT ON COLUMN companies.status IS 'Status da empresa: active, inactive, suspended';
COMMENT ON COLUMN companies.plan IS 'Plano da empresa: basic, premium, enterprise';
COMMENT ON FUNCTION create_default_company_data(UUID) IS 'Cria dados padrão para uma nova empresa';
COMMENT ON FUNCTION is_subdomain_available(VARCHAR) IS 'Verifica se um subdomínio está disponível';
COMMENT ON FUNCTION get_company_by_subdomain(VARCHAR) IS 'Obtém dados da empresa pelo subdomínio';
