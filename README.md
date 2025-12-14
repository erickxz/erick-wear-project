# E-commerce Project

Projeto de e-commerce completo desenvolvido com Next.js 15, TypeScript, PostgreSQL e Stripe para processamento de pagamentos.

## 📋 Sobre o Projeto

Este é um e-commerce moderno e completo que permite aos usuários:
- Navegar por produtos e categorias
- Adicionar produtos ao carrinho
- Fazer login/cadastro
- Realizar checkout com endereço de entrega
- Processar pagamentos via Stripe
- Visualizar histórico de pedidos

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15** (App Router) - Framework React para produção
- **React 19** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de UI reutilizáveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **React Query (TanStack Query)** - Gerenciamento de estado do servidor
- **Sonner** - Notificações toast

### Backend & Database
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM type-safe para TypeScript
- **BetterAuth** - Sistema de autenticação
- **Stripe** - Processamento de pagamentos
- **Server Actions** - Ações do servidor do Next.js

### Ferramentas
- **react-number-format** - Formatação de números e máscaras
- **lucide-react** - Ícones
- **next-themes** - Suporte a temas

## 📁 Estrutura do Projeto

```
ecommerce-project/
├── src/
│   ├── actions/              # Server Actions
│   │   ├── add-cart-product/
│   │   ├── create-checkout-session/
│   │   ├── create-shipping-address/
│   │   ├── decrease-cart-product/
│   │   ├── finish-order/
│   │   ├── get-cart/
│   │   ├── get-orders/
│   │   ├── get-shipping-addresses/
│   │   ├── link-shipping-address-to-cart/
│   │   └── remove-cart-product/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # Rotas de autenticação (BetterAuth)
│   │   │   └── stripe/       # Webhook do Stripe
│   │   ├── authentication/   # Página de login/cadastro
│   │   ├── cart/             # Fluxo de carrinho
│   │   │   ├── identification/ # Seleção de endereço
│   │   │   └── confirmation/   # Confirmação do pedido
│   │   ├── category/         # Página de categoria
│   │   ├── checkout/         # Página de sucesso do checkout
│   │   ├── orders/           # Página de pedidos
│   │   ├── product-variant/  # Página de detalhes do produto
│   │   └── page.tsx          # Página inicial
│   ├── components/
│   │   ├── common/           # Componentes reutilizáveis
│   │   └── ui/               # Componentes shadcn/ui
│   ├── db/
│   │   ├── schema.ts         # Schema do banco de dados
│   │   ├── index.ts          # Configuração do Drizzle
│   │   └── seed.ts           # Script de seed
│   ├── hooks/
│   │   ├── mutations/        # Hooks de mutations (React Query)
│   │   └── queries/          # Hooks de queries (React Query)
│   ├── lib/
│   │   ├── auth.ts           # Configuração do BetterAuth
│   │   ├── auth-client.ts   # Cliente de autenticação
│   │   └── utils.ts         # Utilitários
│   └── providers/
│       └── react-query.tsx  # Provider do React Query
├── public/                   # Arquivos estáticos
└── package.json
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

1. **user** - Usuários do sistema
   - id, name, email, emailVerified, image, createdAt, updatedAt

2. **session** - Sessões de autenticação
   - id, expiresAt, token, userId, ipAddress, userAgent

3. **account** - Contas de autenticação (email/password ou OAuth)
   - id, accountId, providerId, userId, accessToken, refreshToken

4. **verification** - Tokens de verificação
   - id, identifier, value, expiresAt

5. **category** - Categorias de produtos
   - id, name, slug, createdAt

6. **product** - Produtos
   - id, categoryId, name, slug, description, createdAt

7. **product_variant** - Variações de produtos (cores, tamanhos, etc.)
   - id, productId, name, slug, color, priceInCents, imageUrl, createdAt

8. **shipping_address** - Endereços de entrega
   - id, userId, recipientName, street, number, complement, city, state, neighborhood, zipCode, country, phone, email, cpfOrCnpj, createdAt

9. **cart** - Carrinhos de compra
   - id, userId, shippingAddressId, createdAt

10. **cart_item** - Itens do carrinho
    - id, cartId, productVariantId, quantity, createdAt

11. **order** - Pedidos
    - id, userId, cartId, shippingAddressId, recipientName, street, number, complement, city, state, neighborhood, zipCode, country, phone, email, cpfOrCnpj, totalPriceInCents, status (pending/paid/shipped/delivered/cancelled), createdAt

12. **order_item** - Itens do pedido
    - id, orderId, productVariantId, quantity, priceInCents, createdAt

## 🔧 Funcionalidades

### 1. Autenticação
- Login com email e senha
- Cadastro de novos usuários
- Login com Google (OAuth)
- Gerenciamento de sessões
- Proteção de rotas

**Localização:** `src/app/authentication/`

### 2. Catálogo de Produtos
- Página inicial com produtos em destaque
- Listagem de produtos por categoria
- Página de detalhes do produto com variações
- Seleção de variações (cores, tamanhos)
- Produtos relacionados

**Localização:** 
- `src/app/page.tsx` - Página inicial
- `src/app/category/[slug]/page.tsx` - Página de categoria
- `src/app/product-variant/[slug]/page.tsx` - Detalhes do produto

### 3. Carrinho de Compras
- Adicionar produtos ao carrinho
- Aumentar/diminuir quantidade
- Remover produtos
- Visualização em tempo real (via React Query)
- Cálculo automático de totais

**Localização:** `src/components/common/cart.tsx`

### 4. Checkout
- **Identificação** (`/cart/identification`):
  - Seleção ou criação de endereço de entrega
  - Validação de dados via Zod
  - Formulário com máscaras (CEP, CPF/CNPJ, telefone)
  
- **Confirmação** (`/cart/confirmation`):
  - Revisão do pedido
  - Dados do endereço selecionado
  - Botão para finalizar pedido

**Localização:** `src/app/cart/`

### 5. Pagamento (Stripe)
- Criação de sessão de checkout no Stripe
- Redirecionamento para página de pagamento
- Webhook para processar pagamentos concluídos
- Atualização automática do status do pedido
- Limpeza do carrinho após pagamento

**Localização:**
- `src/actions/create-checkout-session/`
- `src/app/api/stripe/webhook/route.ts`

### 6. Pedidos
- Visualização de histórico de pedidos
- Detalhes de cada pedido (itens, valores, status)
- Status do pedido (Pendente, Pago, Enviado, Entregue, Cancelado)

**Localização:** `src/app/orders/`

## 📦 Server Actions

Todas as Server Actions seguem o padrão de ter uma pasta com dois arquivos: `index.ts` e `schema.ts`.

### Server Actions Disponíveis

1. **add-cart-product** - Adiciona produto ao carrinho
2. **create-checkout-session** - Cria sessão de checkout no Stripe
3. **create-shipping-address** - Cria novo endereço de entrega
4. **decrease-cart-product** - Diminui quantidade do produto no carrinho
5. **finish-order** - Finaliza o pedido e cria ordem
6. **get-cart** - Busca o carrinho do usuário
7. **get-orders** - Busca os pedidos do usuário
8. **get-shipping-addresses** - Busca endereços de entrega do usuário
9. **link-shipping-address-to-cart** - Vincula endereço ao carrinho
10. **remove-cart-product** - Remove produto do carrinho

## 🎣 Hooks Customizados (React Query)

### Queries
- **use-cart** - Busca e monitora o carrinho
- **use-orders** - Busca pedidos do usuário
- **use-shipping-addresses** - Busca endereços de entrega

### Mutations
- **use-create-shipping-address** - Cria endereço de entrega
- **use-decrease-product-quantity** - Diminui quantidade no carrinho
- **use-finish-order** - Finaliza pedido
- **use-increase-product-quantity** - Aumenta quantidade no carrinho
- **use-link-shipping-address-to-cart** - Vincula endereço ao carrinho
- **use-remove-product-from-cart** - Remove produto do carrinho

Todos os hooks seguem o padrão de exportar as query keys e mutation keys para facilitar invalidação de cache.

## 🔄 Fluxo de Compra

1. **Navegação**: Usuário navega pelos produtos na página inicial ou por categoria
2. **Detalhes**: Usuário clica em um produto e vê detalhes e variações
3. **Adicionar ao Carrinho**: Usuário seleciona variação e adiciona ao carrinho
4. **Identificação**: Usuário acessa o carrinho e seleciona/cria endereço de entrega
5. **Confirmação**: Usuário confirma os dados do pedido
6. **Finalização**: Sistema cria o pedido (status: pending)
7. **Pagamento**: Usuário é redirecionado para Stripe Checkout
8. **Webhook**: Após pagamento, webhook atualiza pedido para "paid" e limpa carrinho
9. **Sucesso**: Usuário é redirecionado para página de sucesso

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce

# BetterAuth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Instalação

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run db:push

# (Opcional) Popular banco com dados de exemplo
npm run db:seed
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm start

# Linting
npm run lint

# Banco de dados
npm run db:generate  # Gera migrations
npm run db:migrate   # Executa migrations
npm run db:push      # Sincroniza schema com banco
```

## 🎨 Componentes UI

O projeto utiliza componentes do shadcn/ui:
- Button
- Card
- Dialog
- Form
- Input
- Label
- Radio Group
- Scroll Area
- Separator
- Sheet
- Sonner (Toast)
- Tabs

## 📝 Padrões de Código

- **Nomenclatura**: kebab-case para arquivos e pastas
- **TypeScript**: Tipagem estrita em todo o código
- **Validação**: Zod para validação de formulários e schemas
- **Formulários**: React Hook Form com componentes shadcn/ui
- **Estado do Servidor**: React Query para gerenciar estado assíncrono
- **Server Actions**: Todas em `src/actions/` com estrutura padronizada
- **Componentes**: Reutilizáveis quando possível, específicos na pasta da página quando necessário

## 🔐 Segurança

- Autenticação via BetterAuth
- Validação de dados no servidor com Zod
- Proteção de rotas autenticadas
- Verificação de propriedade (usuário só acessa seus próprios dados)
- Webhook do Stripe com verificação de assinatura

## 📄 Licença

Este projeto é privado.
