-- Criar tabelas para o cardápio digital
-- Execute este script no SQL Editor do Supabase

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS configuracoes (
    id INTEGER PRIMARY KEY DEFAULT 1,
    config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens do menu
CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY DEFAULT 1,
    items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos (opcional para futuras funcionalidades)
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente_nome VARCHAR(255) NOT NULL,
    tipo_pedido VARCHAR(50) NOT NULL, -- mesa, retirada, entrega
    numero_mesa INTEGER,
    endereco_entrega TEXT,
    forma_pagamento VARCHAR(50) NOT NULL,
    itens JSONB NOT NULL,
    observacoes TEXT,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para leitura pública
CREATE POLICY "Permitir leitura pública de configurações" ON configuracoes
    FOR SELECT USING (true);

CREATE POLICY "Permitir leitura pública de menu items" ON menu_items
    FOR SELECT USING (true);

-- Políticas para escrita (apenas usuários autenticados podem modificar)
CREATE POLICY "Permitir escrita autenticada de configurações" ON configuracoes
    FOR ALL USING (true);

CREATE POLICY "Permitir escrita autenticada de menu items" ON menu_items
    FOR ALL USING (true);

-- Política para pedidos (inserção pública, leitura restrita)
CREATE POLICY "Permitir inserção pública de pedidos" ON pedidos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura autenticada de pedidos" ON pedidos
    FOR SELECT USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_configuracoes_updated_at 
    BEFORE UPDATE ON configuracoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at 
    BEFORE UPDATE ON menu_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at 
    BEFORE UPDATE ON pedidos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados padrão
INSERT INTO configuracoes (id, config) VALUES (1, '{
  "empresa": {
    "nome": "Paris Burger",
    "logo": "/placeholder.svg?height=80&width=80",
    "telefone": "(11) 99999-9999",
    "endereco": "Rua das Flores, 123 - Centro",
    "instagram": "@parisburguer",
    "facebook": "parisburguer"
  },
  "horarioFuncionamento": {
    "ativo": true,
    "horarios": {
      "segunda": { "aberto": true, "abertura": "18:00", "fechamento": "23:30" },
      "terca": { "aberto": true, "abertura": "18:00", "fechamento": "23:30" },
      "quarta": { "aberto": true, "abertura": "18:00", "fechamento": "23:30" },
      "quinta": { "aberto": true, "abertura": "18:00", "fechamento": "23:30" },
      "sexta": { "aberto": true, "abertura": "18:00", "fechamento": "23:30" },
      "sabado": { "aberto": true, "abertura": "18:00", "fechamento": "00:00" },
      "domingo": { "aberto": true, "abertura": "18:00", "fechamento": "23:30" }
    }
  },
  "pagamento": {
    "pix": {
      "ativo": true,
      "chave": "parisburguer@email.com",
      "qrcode": "/placeholder.svg?height=200&width=200"
    },
    "dinheiro": {
      "ativo": true,
      "troco": true
    },
    "cartao": {
      "ativo": true,
      "credito": true,
      "debito": true
    },
    "delivery": {
      "ativo": true,
      "taxa": 5.0,
      "tempoEntrega": "45-60 min"
    }
  },
  "categorias": [
    {
      "id": "lanches",
      "nome": "Lanches",
      "icone": "🍔",
      "ativo": true
    },
    {
      "id": "artesanais",
      "nome": "Artesanais",
      "icone": "🍖",
      "ativo": true
    },
    {
      "id": "frango",
      "nome": "Frango",
      "icone": "🍗",
      "ativo": true
    },
    {
      "id": "carne",
      "nome": "Carne",
      "icone": "🥩",
      "ativo": true
    },
    {
      "id": "hotdog",
      "nome": "Hot Dog",
      "icone": "🌭",
      "ativo": true
    },
    {
      "id": "bebidas",
      "nome": "Bebidas",
      "icone": "🥤",
      "ativo": true
    }
  ],
  "configuracoes": {
    "tema": "dark",
    "mostraPrecos": true,
    "permiteCarrinho": true,
    "whatsappPedidos": true,
    "numeroWhatsapp": "5511999999999"
  }
}') ON CONFLICT (id) DO UPDATE SET 
  config = EXCLUDED.config,
  updated_at = NOW();

INSERT INTO menu_items (id, items) VALUES (1, '{
  "lanches": [
    {
      "name": "X-Burguer",
      "price": 12.0,
      "description": "Hambúrguer, queijo, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "X-Salada",
      "price": 13.0,
      "description": "Hambúrguer, queijo, alface, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "X-Bacon",
      "price": 18.0,
      "description": "Hambúrguer, Bacon, queijo, alface, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "X-Egg",
      "price": 14.0,
      "description": "Hambúrguer, Ovo, queijo, alface, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "X-Catupiry",
      "price": 18.0,
      "description": "Hambúrguer, Catupiry, queijo, alface, tomate e Maionese da Casa",
      "disponivel": true
    }
  ],
  "artesanais": [
    {
      "name": "Burger Artesanal",
      "price": 25.0,
      "description": "Hambúrguer artesanal 180g, queijo especial, rúcula e tomate seco",
      "disponivel": true
    },
    {
      "name": "Smash Burger",
      "price": 22.0,
      "description": "Dois hambúrgueres smash, queijo cheddar, cebola caramelizada",
      "disponivel": true
    },
    {
      "name": "Burger Gourmet",
      "price": 28.0,
      "description": "Hambúrguer 200g, queijo brie, cogumelos e molho especial",
      "disponivel": true
    },
    {
      "name": "Burger Vegano",
      "price": 24.0,
      "description": "Hambúrguer de grão-de-bico, queijo vegano e vegetais frescos",
      "disponivel": true
    }
  ],
  "frango": [
    {
      "name": "X-Frango",
      "price": 16.0,
      "description": "Peito de frango grelhado, queijo, alface, tomate e maionese",
      "disponivel": true
    },
    {
      "name": "Chicken Crispy",
      "price": 18.0,
      "description": "Frango empanado crocante, queijo, alface e molho especial",
      "disponivel": true
    },
    {
      "name": "Frango BBQ",
      "price": 19.0,
      "description": "Frango desfiado no molho barbecue, queijo e cebola roxa",
      "disponivel": true
    },
    {
      "name": "Buffalo Chicken",
      "price": 20.0,
      "description": "Frango empanado com molho buffalo, queijo e aipo",
      "disponivel": true
    }
  ],
  "carne": [
    {
      "name": "X-Tudo",
      "price": 20.0,
      "description": "Hambúrguer, Queijo, bacon, calabresa, catupiry, ovo, frango, alface, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "X-Pit Bull",
      "price": 34.0,
      "description": "Hambúrguer 150g, 1 Hamburguer tradicional, 2 Salsichas, Queijo, bacon, calabresa, catupiry, 2 ovos, frango, alface, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "X-Calabresa",
      "price": 17.0,
      "description": "Hambúrguer, Calabresa, queijo, alface, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "Duplo Bacon",
      "price": 26.0,
      "description": "Dois hambúrgueres, bacon duplo, queijo cheddar e molho especial",
      "disponivel": true
    }
  ],
  "hotdog": [
    {
      "name": "Hot Dog Tradicional",
      "price": 8.0,
      "description": "Salsicha, batata palha, milho, ervilha, queijo ralado e molhos",
      "disponivel": true
    },
    {
      "name": "Hot Dog Especial",
      "price": 12.0,
      "description": "Salsicha, bacon, queijo derretido, batata palha e molhos especiais",
      "disponivel": true
    },
    {
      "name": "Hot Dog Completo",
      "price": 15.0,
      "description": "Salsicha, bacon, calabresa, queijo, ovo, batata palha e todos os molhos",
      "disponivel": true
    },
    {
      "name": "Hot Dog Gourmet",
      "price": 18.0,
      "description": "Linguiça artesanal, queijo especial, cebola caramelizada e molho gourmet",
      "disponivel": true
    }
  ],
  "bebidas": [
    {
      "name": "Refrigerante Lata",
      "price": 5.9,
      "description": "Coca-Cola, Guaraná, Fanta - 350ml",
      "disponivel": true
    },
    {
      "name": "Refrigerante 2L",
      "price": 12.0,
      "description": "Coca-Cola, Guaraná, Fanta - 2 litros",
      "disponivel": true
    },
    {
      "name": "Suco Natural",
      "price": 8.9,
      "description": "Laranja, Limão, Maracujá - 400ml",
      "disponivel": true
    },
    {
      "name": "Água Mineral",
      "price": 3.5,
      "description": "Água mineral 500ml",
      "disponivel": true
    },
    {
      "name": "Cerveja Long Neck",
      "price": 6.5,
      "description": "Cerveja gelada 355ml",
      "disponivel": true
    },
    {
      "name": "Milkshake",
      "price": 12.0,
      "description": "Chocolate, Morango ou Baunilha - 400ml",
      "disponivel": true
    }
  ]
}') ON CONFLICT (id) DO UPDATE SET 
  items = EXCLUDED.items,
  updated_at = NOW();

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_configuracoes_updated_at ON configuracoes(updated_at);
CREATE INDEX IF NOT EXISTS idx_menu_items_updated_at ON menu_items(updated_at);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);

-- Comentários nas tabelas
COMMENT ON TABLE configuracoes IS 'Armazena as configurações gerais do cardápio digital';
COMMENT ON TABLE menu_items IS 'Armazena os itens do menu organizados por categoria';
COMMENT ON TABLE pedidos IS 'Armazena os pedidos realizados pelos clientes';

-- Comentários nas colunas
COMMENT ON COLUMN configuracoes.config IS 'Configurações em formato JSON incluindo empresa, horários, pagamento e categorias';
COMMENT ON COLUMN menu_items.items IS 'Itens do menu organizados por categoria em formato JSON';
COMMENT ON COLUMN pedidos.tipo_pedido IS 'Tipo do pedido: mesa, retirada ou entrega';
COMMENT ON COLUMN pedidos.itens IS 'Itens do pedido em formato JSON com detalhes e quantidades';
COMMENT ON COLUMN pedidos.status IS 'Status do pedido: pendente, preparando, pronto, entregue, cancelado';
