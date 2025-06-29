-- Atualizar configurações com os novos acréscimos
UPDATE configuracoes SET config = jsonb_set(
  jsonb_set(
    config,
    '{acrescimos}',
    '[
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
    ]'::jsonb
  ),
  '{categoriasAcrescimos}',
  '[
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
  ]'::jsonb
),
updated_at = NOW()
WHERE id = 1;

-- Verificar se a atualização foi bem-sucedida
SELECT 
  jsonb_array_length(config->'acrescimos') as total_acrescimos,
  jsonb_array_length(config->'categoriasAcrescimos') as total_categorias_acrescimos
FROM configuracoes 
WHERE id = 1;

-- Listar todos os acréscimos para verificação
SELECT 
  jsonb_array_elements(config->'acrescimos')->>'nome' as nome_acrescimo,
  (jsonb_array_elements(config->'acrescimos')->>'preco')::decimal as preco,
  jsonb_array_elements(config->'acrescimos')->>'categoria' as categoria
FROM configuracoes 
WHERE id = 1
ORDER BY (jsonb_array_elements(config->'acrescimos')->>'id')::int;
