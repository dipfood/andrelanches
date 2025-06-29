-- Script completo para atualizar todo o cardápio do Paris Burger
-- Execute este script no SQL Editor do Supabase

-- 1. Atualizar configurações com as categorias corretas
UPDATE configuracoes SET config = '{
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
  "acrescimos": [
    {
      "id": 1,
      "nome": "Hamburguer 150g",
      "preco": 8.00,
      "categoria": "carnes",
      "ativo": true
    },
    {
      "id": 2,
      "nome": "Hamburguer comum 90g",
      "preco": 4.00,
      "categoria": "carnes",
      "ativo": true
    },
    {
      "id": 3,
      "nome": "Bacon",
      "preco": 5.00,
      "categoria": "carnes",
      "ativo": true
    },
    {
      "id": 4,
      "nome": "Calabresa",
      "preco": 4.00,
      "categoria": "carnes",
      "ativo": true
    },
    {
      "id": 5,
      "nome": "Milho",
      "preco": 4.00,
      "categoria": "vegetais",
      "ativo": true
    },
    {
      "id": 6,
      "nome": "Presunto",
      "preco": 4.00,
      "categoria": "carnes",
      "ativo": true
    },
    {
      "id": 7,
      "nome": "Mussarela",
      "preco": 5.00,
      "categoria": "queijos",
      "ativo": true
    },
    {
      "id": 8,
      "nome": "Cheddar",
      "preco": 5.00,
      "categoria": "queijos",
      "ativo": true
    },
    {
      "id": 9,
      "nome": "Catupiry",
      "preco": 5.00,
      "categoria": "queijos",
      "ativo": true
    },
    {
      "id": 10,
      "nome": "Frango",
      "preco": 4.00,
      "categoria": "carnes",
      "ativo": true
    },
    {
      "id": 11,
      "nome": "Contra Filé",
      "preco": 8.00,
      "categoria": "carnes",
      "ativo": true
    },
    {
      "id": 12,
      "nome": "Salsicha",
      "preco": 2.00,
      "categoria": "carnes",
      "ativo": true
    },
    {
      "id": 13,
      "nome": "Alface",
      "preco": 2.00,
      "categoria": "vegetais",
      "ativo": true
    },
    {
      "id": 14,
      "nome": "Tomate",
      "preco": 2.00,
      "categoria": "vegetais",
      "ativo": true
    },
    {
      "id": 15,
      "nome": "Cebola",
      "preco": 2.00,
      "categoria": "vegetais",
      "ativo": true
    },
    {
      "id": 16,
      "nome": "Cebola Caramelizada",
      "preco": 3.00,
      "categoria": "vegetais",
      "ativo": true
    },
    {
      "id": 17,
      "nome": "3 Cebolas Empanadas",
      "preco": 7.00,
      "categoria": "vegetais",
      "ativo": true
    },
    {
      "id": 18,
      "nome": "Bacon Fatiado",
      "preco": 7.00,
      "categoria": "carnes",
      "ativo": true
    },
    {
      "id": 19,
      "nome": "Ovo",
      "preco": 3.00,
      "categoria": "extras",
      "ativo": true
    }
  ],
  "categoriasAcrescimos": [
    {
      "id": "carnes",
      "nome": "Carnes",
      "icone": "🥓",
      "ativo": true
    },
    {
      "id": "queijos",
      "nome": "Queijos",
      "icone": "🧀",
      "ativo": true
    },
    {
      "id": "vegetais",
      "nome": "Vegetais",
      "icone": "🥬",
      "ativo": true
    },
    {
      "id": "extras",
      "nome": "Extras",
      "icone": "🍳",
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
}'::jsonb,
updated_at = NOW()
WHERE id = 1;

-- 2. Atualizar menu items com todos os produtos
UPDATE menu_items SET items = '{
  "lanches": [
    {
      "name": "X-Burguer",
      "price": 12.00,
      "description": "Hambúrguer, queijo, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "X-Salada",
      "price": 13.00,
      "description": "Hambúrguer, queijo, alface, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "X-Bacon",
      "price": 18.00,
      "description": "Hambúrguer, Bacon, queijo, alface, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "X-Egg",
      "price": 14.00,
      "description": "Hambúrguer, Ovo, queijo, alface, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "X-Catupiry",
      "price": 18.00,
      "description": "Hambúrguer, Catupiry, queijo, alface, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "X-Calabresa",
      "price": 17.00,
      "description": "Hambúrguer, Calabresa, queijo, alface, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "X-Milho",
      "price": 14.00,
      "description": "Hambúrguer, milho, salada e mussarela",
      "disponivel": true
    },
    {
      "name": "X-Tudo",
      "price": 20.00,
      "description": "Hambúrguer, Queijo, bacon, calabresa, catupiry, ovo, frango, alface, tomate e Maionese da Casa",
      "disponivel": true
    },
    {
      "name": "Misto Quente",
      "price": 14.00,
      "description": "Hambúrguer, queijo, Presunto, tomate e Maionese da Casa",
      "disponivel": true
    }
  ],
  "artesanais": [
    {
      "name": "Ipanema",
      "price": 20.00,
      "description": "Pão, hambúrguer 150g, queijo, alface, tomate, cebola roxa, maionese da casa",
      "disponivel": true
    },
    {
      "name": "Itália",
      "price": 26.00,
      "description": "Pão, hambúrguer 150g, queijo, bacon, cebola caramelizada, alho crocante, alface, tomate, maionese da casa",
      "disponivel": true
    },
    {
      "name": "Bom Bacon",
      "price": 24.00,
      "description": "Pão, hambúrguer 150g, queijo, bacon, alface, tomate, maionese da casa",
      "disponivel": true
    },
    {
      "name": "3 Queijos",
      "price": 27.00,
      "description": "Pão, hambúrguer 150g, 3 queijos, queijo, cheddar, catupiry Scala",
      "disponivel": true
    },
    {
      "name": "Paris Burguer",
      "price": 25.00,
      "description": "Pão, hambúrguer 150g, queijo, 3 cebolas empanadas, tomate, maionese da casa",
      "disponivel": true
    },
    {
      "name": "Dubai",
      "price": 25.00,
      "description": "Pão, hambúrguer 150g, queijo, ovo, cheddar Scala, alface, tomate, cebola roxa, maionese da casa",
      "disponivel": true
    },
    {
      "name": "Manaus",
      "price": 27.00,
      "description": "Pão, hambúrguer 150g, queijo, bacon, catupiry, alface, cebola roxa, farofa com alho crocante, maionese da casa",
      "disponivel": true
    },
    {
      "name": "Minas",
      "price": 23.00,
      "description": "Pão, 2 hambúrgueres 150g, queijo, cheddar, alface, tomate, maionese da casa",
      "disponivel": true
    },
    {
      "name": "Mega Burguer",
      "price": 28.00,
      "description": "Pão, 2 hambúrgueres 150g, queijo, cebola caramelizada, maionese da casa",
      "disponivel": true
    },
    {
      "name": "Top Bacon",
      "price": 20.00,
      "description": "Pão, 2 hambúrgueres 150g, queijo, cheddar, bacon, maionese da casa",
      "disponivel": true
    },
    {
      "name": "Tubarão",
      "price": 33.00,
      "description": "Pão, 2 hambúrgueres 150g, 2 camadas de cheddar, 2 camadas de bacon, cebola roxa",
      "disponivel": true
    }
  ],
  "frango": [
    {
      "name": "X-Frango",
      "price": 16.00,
      "description": "Pão, frango, queijo, tomate, maionese da casa",
      "disponivel": true
    },
    {
      "name": "X-Frango Bacon",
      "price": 20.00,
      "description": "Pão, frango, bacon, queijo, tomate, maionese da casa",
      "disponivel": true
    },
    {
      "name": "X-Frango Catupiry",
      "price": 20.00,
      "description": "Pão, frango, catupiry, queijo, tomate, maionese da casa",
      "disponivel": true
    },
    {
      "name": "X-Frango Casamba",
      "price": 25.00,
      "description": "Pão, frango, bacon, calabresa, queijo, batata palha, alface, tomate, maionese da casa",
      "disponivel": true
    }
  ],
  "carne": [
    {
      "name": "X-Bauru",
      "price": 22.00,
      "description": "Pão, carne, queijo, tomate, maionese da casa",
      "disponivel": true
    },
    {
      "name": "X-Bauru Bacon",
      "price": 25.00,
      "description": "Pão, carne, bacon, queijo, tomate, maionese da casa",
      "disponivel": true
    },
    {
      "name": "X-Bauru Catupiry",
      "price": 25.00,
      "description": "Pão, carne, catupiry, queijo, tomate, maionese da casa",
      "disponivel": true
    },
    {
      "name": "X-Pit Bull",
      "price": 34.00,
      "description": "Hambúrguer 150g, 1 Hamburguer tradicional, 2 Salsichas, Queijo, bacon, calabresa, catupiry, 2 ovos, frango, alface, tomate e Maionese da Casa",
      "disponivel": true
    }
  ],
  "hotdog": [
    {
      "name": "Hot Dog Quente",
      "price": 10.00,
      "description": "Pão, 2 salsichas, maionese, catchup, mostarda, batata palha",
      "disponivel": true
    },
    {
      "name": "Hot Dog Bacon",
      "price": 17.00,
      "description": "Pão, 2 salsichas, maionese, catchup, mostarda, bacon, batata palha",
      "disponivel": true
    },
    {
      "name": "Hot Dog Completo",
      "price": 19.00,
      "description": "Pão, 2 salsichas, maionese, catchup, mostarda, tomate, bacon, catupiry, batata palha",
      "disponivel": true
    }
  ],
  "bebidas": [
    {
      "name": "Roller",
      "price": 10.00,
      "description": "2L",
      "disponivel": true
    },
    {
      "name": "Poty",
      "price": 10.00,
      "description": "2L",
      "disponivel": true
    },
    {
      "name": "Coca Cola",
      "price": 15.00,
      "description": "2L",
      "disponivel": true
    },
    {
      "name": "Fanta Laranja",
      "price": 12.00,
      "description": "2L",
      "disponivel": true
    },
    {
      "name": "Fanta Uva",
      "price": 12.00,
      "description": "2L",
      "disponivel": true
    },
    {
      "name": "Sprite",
      "price": 12.00,
      "description": "2L",
      "disponivel": true
    },
    {
      "name": "Roller 600ml",
      "price": 6.00,
      "description": "600ML",
      "disponivel": true
    },
    {
      "name": "Poty 600ml",
      "price": 6.00,
      "description": "600ml",
      "disponivel": true
    },
    {
      "name": "Roller Lata",
      "price": 6.00,
      "description": "Lata",
      "disponivel": true
    },
    {
      "name": "Poty Lata",
      "price": 6.00,
      "description": "Lata",
      "disponivel": true
    },
    {
      "name": "Coca Cola Lata",
      "price": 6.00,
      "description": "Lata",
      "disponivel": true
    },
    {
      "name": "Fanta Laranja Lata",
      "price": 6.00,
      "description": "Lata",
      "disponivel": true
    },
    {
      "name": "Sprite Lata",
      "price": 6.00,
      "description": "Lata",
      "disponivel": true
    },
    {
      "name": "Crystal",
      "price": 4.00,
      "description": "Lata",
      "disponivel": true
    },
    {
      "name": "Antarctica Boa",
      "price": 5.00,
      "description": "Lata",
      "disponivel": true
    }
  ]
}'::jsonb,
updated_at = NOW()
WHERE id = 1;

-- 3. Verificar se as atualizações foram bem-sucedidas
SELECT 
  'CONFIGURAÇÕES ATUALIZADAS' as status,
  jsonb_array_length(config->'categorias') as total_categorias,
  jsonb_array_length(config->'acrescimos') as total_acrescimos,
  jsonb_array_length(config->'categoriasAcrescimos') as total_categorias_acrescimos
FROM configuracoes 
WHERE id = 1;

-- 4. Verificar menu items
SELECT 
  'MENU ITEMS ATUALIZADOS' as status,
  jsonb_array_length(items->'lanches') as lanches,
  jsonb_array_length(items->'artesanais') as artesanais,
  jsonb_array_length(items->'frango') as frango,
  jsonb_array_length(items->'carne') as carne,
  jsonb_array_length(items->'hotdog') as hotdog,
  jsonb_array_length(items->'bebidas') as bebidas
FROM menu_items 
WHERE id = 1;

-- 5. Listar alguns produtos de cada categoria para verificação
SELECT 'LANCHES' as categoria, jsonb_array_elements(items->'lanches')->>'name' as produto, 'R$ ' || (jsonb_array_elements(items->'lanches')->>'price')::decimal as preco FROM menu_items WHERE id = 1 LIMIT 3;

SELECT 'ARTESANAIS' as categoria, jsonb_array_elements(items->'artesanais')->>'name' as produto, 'R$ ' || (jsonb_array_elements(items->'artesanais')->>'price')::decimal as preco FROM menu_items WHERE id = 1 LIMIT 3;

SELECT 'FRANGO' as categoria, jsonb_array_elements(items->'frango')->>'name' as produto, 'R$ ' || (jsonb_array_elements(items->'frango')->>'price')::decimal as preco FROM menu_items WHERE id = 1 LIMIT 3;

SELECT 'CARNE' as categoria, jsonb_array_elements(items->'carne')->>'name' as produto, 'R$ ' || (jsonb_array_elements(items->'carne')->>'price')::decimal as preco FROM menu_items WHERE id = 1 LIMIT 3;

SELECT 'HOTDOG' as categoria, jsonb_array_elements(items->'hotdog')->>'name' as produto, 'R$ ' || (jsonb_array_elements(items->'hotdog')->>'price')::decimal as preco FROM menu_items WHERE id = 1 LIMIT 3;

SELECT 'BEBIDAS' as categoria, jsonb_array_elements(items->'bebidas')->>'name' as produto, 'R$ ' || (jsonb_array_elements(items->'bebidas')->>'price')::decimal as preco FROM menu_items WHERE id = 1 LIMIT 5;

-- 6. Mensagem de sucesso
SELECT 
  '✅ CARDÁPIO COMPLETO ATUALIZADO COM SUCESSO!' as status,
  'Total de 46 produtos organizados em 6 categorias' as detalhes,
  '19 acréscimos em 4 categorias também atualizados' as acrescimos,
  'Configurações da empresa e pagamento atualizadas' as configuracoes;
