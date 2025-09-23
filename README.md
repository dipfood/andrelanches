# Sistema de Checklist - HTML Puro

Sistema de checklist desenvolvido em HTML, CSS e JavaScript puro com integração ao Supabase.

## Funcionalidades

- **Autenticação**: 4 usuários pré-definidos com sistema de login seguro
- **Página Administrativa**: Apenas para gerente editar itens do checklist
- **Checklist Principal**: Marcar tarefas, adicionar comentários e visualizar estatísticas
- **Persistência**: Dados salvos no Supabase em tempo real
- **Interface Responsiva**: Funciona em desktop e mobile
- **Estatísticas em Tempo Real**: Progresso, itens completos e pendentes

## Usuários do Sistema

| Usuário | Senha | Tipo | Acesso |
|---------|-------|------|--------|
| gerente | gerente1 | Administrador | Admin + Checklist |
| carol | carol10 | Usuário | Checklist |
| victor | victor22 | Usuário | Checklist |
| eloane | eloane12 | Usuário | Checklist |

## Estrutura de Arquivos

### Páginas HTML
- `index.html` - Página de login com informações dos usuários
- `admin.html` - Página administrativa (apenas gerente)
- `checklist.html` - Página principal do checklist com estatísticas

### Arquivos JavaScript
- `config.js` - Configuração do Supabase
- `auth.js` - Sistema de autenticação completo
- `admin.js` - Lógica da página administrativa
- `checklist.js` - Lógica da página do checklist

### Estilos e Scripts
- `styles.css` - Estilos CSS responsivos
- `scripts/` - Scripts SQL para configuração do banco

## Configuração do Banco de Dados

Execute os scripts SQL na ordem:

1. **`001_create_tables.sql`** - Cria as tabelas necessárias:
   - `users` - Usuários do sistema
   - `checklist_items` - Itens do checklist
   - `user_checklist_status` - Status dos usuários para cada item

2. **`002_insert_users.sql`** - Insere os 4 usuários padrão

## Como Usar

### 1. Configuração Inicial
- Execute os scripts SQL no Supabase
- Abra `index.html` no navegador
- As credenciais do Supabase são configuradas automaticamente

### 2. Login
- Use um dos usuários da tabela acima
- O sistema mostra os usuários disponíveis na tela de login

### 3. Funcionalidades por Tipo de Usuário

#### Gerente (Admin)
- **Checklist**: Visualizar, marcar tarefas, adicionar observações
- **Estatísticas**: Ver progresso em tempo real
- **Administração**: Adicionar, editar e remover itens do checklist
- **Botão Admin**: Acesso direto à página administrativa

#### Usuários Regulares
- **Checklist**: Visualizar e marcar tarefas como feito/não feito
- **Observações**: Adicionar comentários pessoais em cada item
- **Estatísticas**: Ver progresso pessoal
- **Filtros**: Ver todos, completos ou pendentes

## Funcionalidades Detalhadas

### Sistema de Autenticação
- Login seguro com validação no banco
- Sessão persistente (localStorage)
- Redirecionamento automático baseado no role
- Logout com limpeza de sessão

### Página do Checklist
- **Estatísticas em Tempo Real**: Total, completos, pendentes, progresso %
- **Filtros por Abas**: Todos, Completos, Pendentes
- **Ações por Item**: Marcar como feito/não feito
- **Observações Pessoais**: Campo de texto para cada item
- **Interface Responsiva**: Adaptada para mobile

### Página Administrativa (Gerente)
- **CRUD Completo**: Criar, editar e excluir itens
- **Ordenação**: Definir ordem de exibição dos itens
- **Observações Administrativas**: Instruções para os usuários
- **Interface Intuitiva**: Formulário simples e lista organizada

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 (Flexbox, Grid), JavaScript ES6+
- **Backend**: Supabase (PostgreSQL)
- **Autenticação**: Sistema customizado com Supabase
- **Responsividade**: CSS Grid e Flexbox
- **Persistência**: Supabase Real-time Database

## Estrutura do Banco de Dados

### Tabela `users`
- `id` - Identificador único
- `username` - Nome de usuário
- `password` - Senha (em produção usar hash)
- `role` - Tipo de usuário (admin/user)

### Tabela `checklist_items`
- `id` - Identificador único
- `order_number` - Ordem de exibição
- `task_description` - Descrição da tarefa
- `observations` - Observações administrativas

### Tabela `user_checklist_status`
- `id` - Identificador único
- `user_id` - Referência ao usuário
- `checklist_item_id` - Referência ao item
- `status` - Status (completed/not_done/pending)
- `user_observations` - Observações do usuário
- `updated_at` - Data da última atualização

## Segurança

- Validação de autenticação em todas as páginas
- Controle de acesso baseado em roles
- Verificação de permissões no frontend e backend
- Sessão segura com localStorage

## Responsividade

- Design mobile-first
- Interface adaptável para tablets e desktops
- Botões e formulários otimizados para touch
- Layout flexível com CSS Grid e Flexbox
