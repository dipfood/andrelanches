-- Criar tabelas para o cardápio digital

-- Tabela de categorias
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de acréscimos (addons)
CREATE TABLE addons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de configurações do sistema
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(200) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT,
  items JSONB NOT NULL, -- Esta coluna agora armazenará produtos e seus acréscimos selecionados
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  payment_method VARCHAR(50) NOT NULL,
  delivery_type VARCHAR(20) NOT NULL, -- 'delivery' ou 'pickup'
  status VARCHAR(20) DEFAULT 'pending',
  change_for DECIMAL(10,2), -- Campo para o valor do troco
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configurações padrão
INSERT INTO settings (key, value) VALUES 
('store_open', 'true'),
('opening_time', '08:00'),
('closing_time', '22:00'),
('delivery_fee', '5.00'),
('pix_key', 'seuemail@exemplo.com'),
('store_name', 'Meu Restaurante'),
('store_phone', '(11) 99999-9999'),
('store_address', 'Rua Exemplo, 123');

-- Adicionar configuração do WhatsApp
INSERT INTO settings (key, value) VALUES ('whatsapp_number', '5511999999999');

-- Atualizar o telefone da loja para incluir código do país
UPDATE settings SET value = '5511999999999' WHERE key = 'store_phone';

-- Inserir categorias de exemplo
INSERT INTO categories (name, description) VALUES 
('Lanches', 'Hambúrgueres e sanduíches'),
('Bebidas', 'Refrigerantes, sucos e águas'),
('Sobremesas', 'Doces e sobremesas'),
('Pratos Principais', 'Pratos completos');

-- Inserir produtos de exemplo
INSERT INTO products (name, description, price, category_id) VALUES 
('Hambúrguer Clássico', 'Pão, carne, queijo, alface e tomate', 15.90, 1),
('X-Bacon', 'Hambúrguer com bacon crocante', 18.90, 1),
('Coca-Cola 350ml', 'Refrigerante gelado', 4.50, 2),
('Suco de Laranja', 'Suco natural de laranja', 6.00, 2),
('Pudim', 'Pudim de leite caseiro', 8.00, 3),
('Prato Feito', 'Arroz, feijão, carne e salada', 22.90, 4);

-- Inserir acréscimos de exemplo
INSERT INTO addons (name, price, active) VALUES
('Bacon Extra', 3.00, true),
('Queijo Extra', 2.50, true),
('Molho Especial', 1.50, true),
('Batata Frita Pequena', 7.00, true),
('Refrigerante Lata', 5.00, true);

-- Adicionar configurações de cor padrão
INSERT INTO settings (key, value) VALUES 
('header_color_start', '#667eea'),
('header_color_end', '#764ba2'),
('background_color', '#f8f9fa')
ON CONFLICT (key) DO NOTHING;

-- Garantir que todas as configurações existam
INSERT INTO settings (key, value) VALUES 
('whatsapp_number', '5511999999999')
ON CONFLICT (key) DO NOTHING;

-- Atualizar configurações se necessário
UPDATE settings SET value = 'true' WHERE key = 'store_open';
UPDATE settings SET value = '08:00' WHERE key = 'opening_time';
UPDATE settings SET value = '22:00' WHERE key = 'closing_time';
UPDATE settings SET value = '5.00' WHERE key = 'delivery_fee';
