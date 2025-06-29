-- Atualizar menu items com os novos produtos
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
      "name": "Roller",
      "price": 6.00,
      "description": "600ML",
      "disponivel": true
    },
    {
      "name": "Poty",
      "price": 6.00,
      "description": "600ml",
      "disponivel": true
    },
    {
      "name": "Roller",
      "price": 6.00,
      "description": "Lata",
      "disponivel": true
    },
    {
      "name": "Poty",
      "price": 6.00,
      "description": "Lata",
      "disponivel": true
    },
    {
      "name": "Coca Cola",
      "price": 6.00,
      "description": "Lata",
      "disponivel": true
    },
    {
      "name": "Fanta Laranja",
      "price": 6.00,
      "description": "Lata",
      "disponivel": true
    },
    {
      "name": "Sprite",
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

-- Verificar se a atualização foi bem-sucedida
SELECT 
  jsonb_array_length(items->'artesanais') as total_artesanais,
  jsonb_array_length(items->'frango') as total_frango,
  jsonb_array_length(items->'carne') as total_carne,
  jsonb_array_length(items->'hotdog') as total_hotdog,
  jsonb_array_length(items->'bebidas') as total_bebidas
FROM menu_items 
WHERE id = 1;

-- Listar produtos por categoria para verificação
SELECT 'ARTESANAIS' as categoria, jsonb_array_elements(items->'artesanais')->>'name' as produto, (jsonb_array_elements(items->'artesanais')->>'price')::decimal as preco FROM menu_items WHERE id = 1
UNION ALL
SELECT 'FRANGO' as categoria, jsonb_array_elements(items->'frango')->>'name' as produto, (jsonb_array_elements(items->'frango')->>'price')::decimal as preco FROM menu_items WHERE id = 1
UNION ALL
SELECT 'CARNE' as categoria, jsonb_array_elements(items->'carne')->>'name' as produto, (jsonb_array_elements(items->'carne')->>'price')::decimal as preco FROM menu_items WHERE id = 1
UNION ALL
SELECT 'HOTDOG' as categoria, jsonb_array_elements(items->'hotdog')->>'name' as produto, (jsonb_array_elements(items->'hotdog')->>'price')::decimal as preco FROM menu_items WHERE id = 1
UNION ALL
SELECT 'BEBIDAS' as categoria, jsonb_array_elements(items->'bebidas')->>'name' as produto, (jsonb_array_elements(items->'bebidas')->>'price')::decimal as preco FROM menu_items WHERE id = 1
ORDER BY categoria, produto;
