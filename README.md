# Sol Nascente Motos — Mini CRM

> Sistema web responsivo de captura, qualificação e gestão em tempo real de leads para a concessionária autorizada **Sol Nascente Motos Honda** (Teresina - PI e Timon - MA).

🔗 **Acesse a aplicação em produção:** [https://hondacrm-efcb2.web.app/](https://hondacrm-efcb2.web.app/)

---

## Visão Geral

O **Sol Nascente Motos CRM** é uma solução voltada para o ciclo de vendas de motocicletas Honda zero km. O sistema unifica:

1. **Landing Page Pública**: voltada ao consumidor final, com catálogo de modelos em destaque, showroom oficial, informações de unidades físicas e formulário de solicitação de proposta em tempo real.
2. **Dashboard Administrativo Protegido**: voltado aos consultores de vendas e administradores, oferecendo acompanhamento de métricas do funil, listagem reativa via Firestore, filtros avançados, alteração inline de status, edição completa de dados cadastrais e exclusão de leads com confirmação.

A aplicação opera com reatividade ponta a ponta: qualquer lead submetido no site público é persistido no Cloud Firestore e propagado instantaneamente para a equipe de vendas sem necessidade de recarregar a página.

```
[Cliente] Submete formulário na Landing Page
                    ↓
   [Cloud Firestore] Gravação na coleção 'leads' (Status: NOVO)
                    ↓
[useLeads Listener] Sincronização em tempo real (onSnapshot)
                    ↓
 [Dashboard Vendas] Atualização instantânea dos KPIs e da Tabela
                    ↓
  [Ações de Venda] Edição de dados, exclusão ou avanço de status
```

---

## Funcionalidades

### 1. Landing Page Pública (`/`)
- **Identidade Oficial da Marca**: Logotipo oficial da Sol Nascente Motos integrado no cabeçalho e rodapé.
- **Showroom e Catálogo de Modelos**: Cards dedicados para os modelos mais procurados da semana (Honda CG 160, Honda Biz, Honda NXR 160 Bros, Honda CB 300F), exibindo fotografias reais dos veículos em proporção nativa 16:9 (`aspect-video`), tags de categoria, disponibilidade em estoque e valores de parcelamento.
- **Interação Rápida de Simulação**: O clique no botão "Simular esta moto" rola suavemente para o formulário e pré-seleciona automaticamente o modelo no formulário de atendimento.
- **Unidades Físicas**: Apresentação dos endereços, horários de atendimento e botões de contato direto para as concessionárias Matriz (Teresina - PI) e Filial (Timon - MA).
- **Formulário de Captura de Leads (`LeadCaptureForm.tsx`)**:
  - Validação em tempo real com React Hook Form.
  - Máscara automática de telefone/WhatsApp com DDD.
  - Feedback visual dos estados de submissão (normal, carregamento, sucesso e erro).
  - Canal direto via deep link oficial para WhatsApp (`wa.me`).

### 2. Autenticação Administrativa (/login)
- **Acesso Restrito**: Login seguro com e-mail e senha gerenciado pelo Firebase Authentication.
- **Sessão Persistente**: Contexto de autenticação (`AuthContext.tsx`) com monitoramento de estado via `onAuthStateChanged`.
- **Proteção de Rotas**: Componente `ProtectedRoute.tsx` bloqueia o acesso não autenticado ao painel e redireciona automaticamente para o login.
- **Tratamento Humanizado de Erros**: Mapeamento amigável de códigos de erro do Firebase (`auth/invalid-credential`, `auth/too-many-requests`, etc.) via `AuthErrorBanner.tsx`.
- **Recuperação de Senha**: Envio de e-mail de redefinição de senha diretamente na interface de login.

### 3. Dashboard Administrativo (/dashboard)
- **KPIs em Tempo Real (`MetricGrid.tsx`)**:
  - **Total de Leads**: total absoluto de documentos na base de dados.
  - **Novos**: leads aguardando primeiro contato (`status: 'NOVO'`).
  - **Em Contato**: negociações em andamento (`status: 'EM_CONTATO'`).
  - **Convertidos**: vendas faturadas com sucesso (`status: 'CONVERTIDO'`).
  - Barras de progresso e badges dinâmicos de conversão.
- **Tabela de Leads Completa (`LeadsTable.tsx`)**:
  - Sincronização reativa contínua via listener `onSnapshot` do Firestore.
  - Busca textual em tempo real por Nome ou WhatsApp.
  - Filtro por **Status** (`Todos`, `Novo`, `Em contato`, `Convertido`, `Perdido`).
  - Filtro por **Unidade** (`Todas`, `Teresina`, `Timon`).
  - Filtro por **Modelo** com normalização canônica inteligente, reconhecendo variações de cadastro (`cg160`, `titan`, `CG 160 Titan`, `biz`, `bros`, `twister`, etc.).
  - **Alteração de Status Inline**: Dropdown diretamente na célula de status com atualização imediata no banco e feedback visual via `react-toastify`.
  - Link direto para abertura de conversa com o lead no WhatsApp com mensagem predefinida.
- **Modal de Detalhes (`LeadDetailsModal.tsx`)**:
  - Visão abrangente com dados de contato, concessionária, modelo de interesse, data/hora exata de registro e ID do Firestore.
  - Ações rápidas no rodapé para abrir edição ou exclusão.
- **Modal de Edição Cadastral (`LeadEditModal.tsx`)**:
  - Permite alterar Nome, WhatsApp (com máscara automática), Modelo de interesse, Unidade e E-mail.
  - Recalcula automaticamente as iniciais do avatar e a URL formatada do WhatsApp, persistindo as mudanças via `updateLead.ts`.
- **Modal de Exclusão com Confirmação (`LeadDeleteConfirmModal.tsx`)**:
  - Confirmação explícita antes da remoção definitiva do documento no Firestore via `deleteLead.ts`.
- **Paginação Client-Side (`Pagination.tsx`)**:
  - Paginação fluida configurada em 10 itens por página com controles numéricos e de navegação.

---

## Tecnologias Utilizadas

### Frontend
- **React (`^19.2.8`)**: Biblioteca para interfaces declarativas e componentes modulares.
- **TypeScript (`~6.0.2`)**: Tipagem estática rigorosa para contratos de domínio e integridade do código.
- **Vite (`^8.3.0`)**: Build tool e servidor de desenvolvimento com Hot Module Replacement (HMR).
- **Tailwind CSS (`^4.3.3`)**: Estilização utilitária moderna integrada via `@tailwindcss/vite`.
- **React Router DOM (`^7.18.3`)**: Gerenciamento de rotas no cliente (SPA).
- **React Hook Form (`^7.88.0`)**: Controle de performance e validação de formulários.
- **Zod (`^4.6.5`)**: Esquemas de validação de dados.
- **React Toastify (`^11.1.0`)**: Notificações toast para feedback de ações.
- **Google Material Symbols**: Ícones utilitários da interface.

### Serviços e Backend
- **Firebase Web SDK (`^12.19.0`)**: SDK cliente modular oficial do Google Firebase:
  - **Firebase Authentication**: Gerenciamento de sessões de usuários administrativos.
  - **Cloud Firestore**: Banco de dados NoSQL reativo em tempo real para armazenamento e consulta de leads.
- **Backend Node.js/Express (`backend/`)**: Serviço auxiliar em TypeScript disponível no repositório com suporte a `firebase-admin` e endpoints dedicados, caso a arquitetura exija transição para API intermediária.

### Qualidade e Ferramentas
- **Oxlint (`^1.81.0`)**: Linter de alta velocidade para análise estática e prevenção de bugs.

---

## Arquitetura da Aplicação

A arquitetura do frontend adota a abordagem **BaaS (Backend as a Service)** com conexão direta entre o cliente React e o Firebase Web SDK v12 modular. Essa decisão elimina a latência de endpoints REST intermediários e viabiliza a sincronização bidirecional em tempo real nativa (`onSnapshot`).

```
frontend/
├── index.html                  # Ponto de entrada HTML da SPA
├── package.json                # Scripts e dependências do frontend
├── vite.config.ts              # Configuração do Vite com plugins React e Tailwind
└── src/
    ├── App.tsx                 # Declaração central de rotas e providers
    ├── main.tsx                # Bootstrap da aplicação React no DOM
    ├── index.css               # Design tokens, tipografia e diretivas do Tailwind v4
    ├── assets/                 # Imagens das motos e logotipo oficial Sol Nascente
    ├── components/
    │   ├── auth/               # LoginForm, PasswordInput, ProtectedRoute, AuthErrorBanner
    │   ├── dashboard/          # MetricGrid, MetricCard, DashboardHeader
    │   │   └── leads/          # LeadsTable, LeadRow, LeadsToolbar, Pagination, Modals
    │   ├── layout/             # AppLayout, Header, Sidebar (com drawer mobile)
    │   └── public/             # PublicHeader, PublicFooter, LeadCaptureForm, ModelCard, UnitCard
    ├── config/                 # Re-exportações de serviços Firebase
    ├── contexts/               # AuthContext e useAuth (estado global de sessão)
    ├── hooks/                  # useLeads (listener reativo do Firestore)
    ├── pages/                  # PublicLandingPage, LoginPage, DashboardPage
    ├── services/
    │   ├── firebase/           # Inicialização do app Firebase, auth e db
    │   └── leads/              # createLead, updateLead, updateLeadStatus, deleteLead
    └── types/                  # Modelos de domínio TypeScript (Lead, LeadStatus, etc.)
```

---

## Autenticação

- **Provedor**: Firebase Authentication (Email/Password).
- **Fluxo de Sessão**:
  1. O usuário insere credenciais em `/login`.
  2. A função `login()` em `services/firebase/auth.ts` executa `signInWithEmailAndPassword`.
  3. O observador `onAuthStateChanged` em `AuthContext.tsx` captura o usuário autenticado e atualiza o estado global.
  4. Redirecionamento automático para `/dashboard`.
- **Proteção de Acesso**: O componente `ProtectedRoute.tsx` verifica o estado `isAuthenticated`. Caso falso, preserva a rota de destino e redireciona para `/login`.
- **Encerramento de Sessão**: A função `logout()` encerra a sessão no Firebase e redireciona o operador para a tela de autenticação.

---

## Estrutura do Banco de Dados

Os leads são persistidos na coleção `leads` do Cloud Firestore:

```
leads/{leadId}
```

### Esquema do Documento

| Campo | Tipo | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `string` | ID único do documento gerado automaticamente. | `"abc123xyz"` |
| `name` | `string` | Nome completo do lead. | `"João Matheus"` |
| `initials` | `string` | Iniciais calculadas para o avatar. | `"JM"` |
| `email` | `string` | E-mail do lead (opcional no formulário público). | `"cliente@email.com"` |
| `whatsapp` | `string` | Número formatado com DDD. | `"(86) 99999-9999"` |
| `whatsappUrl` | `string` | Link direto para WhatsApp (`wa.me`). | `"https://wa.me/5586999999999"` |
| `model` | `string` | Código do modelo de interesse. | `"cg160"` |
| `modelDisplay` | `string` | Rótulo legível do modelo. | `"Honda CG 160"` |
| `unit` | `'TERESINA' \| 'TIMON'` | Concessionária designada. | `"TERESINA"` |
| `status` | `LeadStatus` | `'NOVO' \| 'EM_CONTATO' \| 'CONVERTIDO' \| 'PERDIDO'` | `"NOVO"` |
| `createdAt` | `Timestamp` / `string` | Timestamp do servidor (`serverTimestamp()`). | `"16/09/2026 05:40"` |

## Rotas da Aplicação

| Rota | Componente | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `/` | `PublicLandingPage` | Público | Landing page comercial com catálogo de motos e formulário. |
| `/login` | `LoginPage` | Público | Formulário de acesso administrativo e recuperação de senha. |
| `/dashboard` | `DashboardPage` | Protegido | Painel gerencial com KPIs, tabela e modais de leads. |
| `*` | `Navigate to="/"` | Público | Redirecionamento automático para a página inicial. |

---

## Design Responsivo

A aplicação foi integralmente desenvolvida e adaptada para oferecer experiência fluida em dispositivos móveis, tablets e computadores, mantendo a integridade visual da marca Honda em qualquer resolução.

### Faixas de Viewport Suportadas

- **320px (Small Mobile)**: Largura mínima suportada (ex: iPhone SE 1ª geração). O layout é dimensionado sem transbordo horizontal (`scrollWidth <= clientWidth`), botões empilhados com áreas de toque confortáveis e tipografia autoajustável.
- **360px–390px (Standard Mobile)**: Smartphones padrão de mercado (ex: Samsung Galaxy, iPhone 12/13/14).
- **390px–430px (Large Mobile)**: Smartphones de grande formato (ex: iPhone Pro Max, Galaxy Plus).
- **< 767px (Mobile Breakpoint)**: 
  - O menu lateral administrativo (`Sidebar`) se converte em gaveta deslizante (drawer) acionada pelo botão hambúrguer no `Header`, com fechamento por backdrop escurecido.
  - A tabela de leads utiliza contêiner com rolagem horizontal controlada (`overflow-x-auto` com largura mínima protegida de 720px), preservando a legibilidade das 7 colunas sem deformar o layout da página.
  - Modais recebem limite de altura (`max-h-[90vh]`), rolagem interna suave e botões de ação empilhados verticalmente.
  - Os cards de "Proof Badges" na Landing Page passam de 3 colunas para disposição em coluna única legível.
- **768px (Tablet / Intermediário)**: Transição equilibrada com grids de 2 colunas para cards de métricas, modelos e concessionárias.
- **1024px+ (Desktop)**: Layout desktop de referência totalmente preservado, com menu lateral fixo persistente (`w-[240px]`), cabeçalho alinhado e grids completos de 4 colunas.
- **1280px+ e 1440px+ (Wide Desktop)**: Máximo aproveitamento do espaço em contêineres centralizados (`max-w-7xl`).

---

## Variáveis de Ambiente (Environment Variables)

Para executar a aplicação, crie um arquivo `.env` dentro do diretório `frontend/` com base nas variáveis abaixo:

```env
# Configurações do Projeto Firebase (Web Client SDK)
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

> **Nota de Segurança**: As chaves `VITE_FIREBASE_*` são parâmetros de conexão pública necessários para que o navegador se comunique com os servidores do Firebase. A proteção efetiva dos dados é governada exclusivamente pelas **Regras de Segurança do Cloud Firestore** e pelas regras do **Firebase Authentication**. Jamais inclua chaves privadas de Service Account no frontend.

---

## Instalação e Execução Local

### Pré-requisitos
- **Node.js**: Versão 20 ou superior recomendada.
- **pnpm** (ou `npm` / `yarn`).

### Passo a Passo

1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/CRM_Honda.git
   cd CRM_Honda
   ```

2. **Instalar as dependências do frontend**:
   ```bash
   cd frontend
   npm install
   # ou pnpm install
   ```

3. **Configurar o arquivo de ambiente**:
   Crie o arquivo `frontend/.env` e preencha as variáveis de conexão com o Firebase conforme a seção anterior.

4. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   # ou pnpm dev
   ```
   A aplicação estará acessível em `http://localhost:5173` (ou porta alternativa indicada no terminal).

---

## Scripts Disponíveis

Executados a partir do diretório `frontend/`:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento Vite com HMR ativo. |
| `npm run build` | Executa a verificação estática de tipos TypeScript (`tsc -b`) e compila o bundle de produção otimizado em `dist/`. |
| `npm run lint` | Executa a análise estática de código com o linter **Oxlint**. |
| `npm run preview` | Inicia um servidor local para inspecionar o bundle de produção compilado. |

---

## Deploy em Produção

A aplicação está disponível e publicada em produção no **Firebase Hosting**:
**URL Oficial:** [https://hondacrm-efcb2.web.app/](https://hondacrm-efcb2.web.app/)

Por se tratar de uma Single Page Application (SPA) construída com Vite, a aplicação pode ser hospedada em qualquer provedor de hospedagem estática moderna (Firebase Hosting, Vercel, Netlify ou Cloudflare Pages).

### Configuração de Roteamento SPA
Como a aplicação utiliza o `BrowserRouter` do React Router DOM, todas as rotas devem ser redirecionadas para o arquivo `index.html`.

- **Vercel (`vercel.json`)**:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- **Netlify (`_redirects` na pasta `public/`)**:
  ```text
  /*    /index.html   200
  ```
- **Firebase Hosting (`firebase.json`)**:
  ```json
  {
    "hosting": {
      "public": "dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        { "source": "**", "destination": "/index.html" }
      ]
    }
  }
  ```

---

## Decisões Técnicas (Technical Decisions)

1. **Arquitetura BaaS Direta**: A conexão direta com o Firebase via SDK modular v12 elimina o overhead de manter uma camada de API REST intermediária para operações CRUD elementares, habilitando reatividade em tempo real nativa (`onSnapshot`) e acelerando o ciclo de entrega.
2. **Normalização Canônica de Modelos**: O formulário público e as diferentes origens de dados podem registrar nomes como `CG 160`, `cg160` ou `CG 160 Titan`. O sistema implementa uma função normalizadora (`normalizeModelKey`) na barra de ferramentas do Dashboard, assegurando que o filtro agrupe corretamente todos os registros equivalentes.
3. **Ergonomia Responsiva sem Destruir o Desktop**:
   - Uso de gaveta deslizante (`Sidebar`) com backdrop escurecido no mobile para não sobrecarregar a tela principal.
   - Isolamento da rolagem horizontal exclusivamente dentro do invólucro da tabela (`min-w-[720px]`), impedindo que a página inteira transborde no smartphone.
   - Modais com limite de viewport (`max-h-[90vh]`) e rolagem vertical interna para garantir acessibilidade em dispositivos com altura reduzida ou em modo paisagem.
4. **Tailwind CSS v4**: Utilização da geração mais recente do Tailwind via `@tailwindcss/vite`, eliminando a necessidade de arquivos pesados de configuração legada e aproveitando variáveis CSS nativas (`@theme`).

---

## Considerações para Produção Futura 

Para evolução futura do sistema em ambientes corporativos de larga escala, recomendam-se os seguintes aprimoramentos:

1. **Role-Based Access Control (RBAC)**: Configuração de *Custom Claims* no Firebase Authentication para distinguir permissões granulares entre consultores de vendas, supervisores e administradores gerais.
2. **Firebase App Check**: Proteção dos serviços contra tráfego automatizado e bots através do Google reCAPTCHA Enterprise.
3. **Cloud Functions para Gatilhos e Notificações**: Disparo automático de e-mails para a equipe de plantão ou envio de mensagens automáticas de confirmação para o lead via WhatsApp Business API no momento da gravação.
4. **Paginação por Cursores no Firestore**: Substituição da paginação client-side por consultas paginadas via `startAfter()` quando a coleção ultrapassar milhares de registros.
5. **Automação de Testes (CI/CD)**: Implementação de suíte de testes unitários e de integração com Vitest e Playwright em esteira GitHub Actions.

---

## Status do Projeto

- **Fase**: MVP Completo, Funcional e Responsivo.
- **Ambiente Testado**: Windows 11, Node.js v24, Chrome, Edge.
- **Validações Técnicas**: Tipagem estática (`tsc -b`), linter (`oxlint`) e compilação de produção (`vite build`) validadas com sucesso.
