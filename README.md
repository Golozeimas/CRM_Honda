# Sol Nascente Motos CRM

> Sistema moderno e responsivo de captura, gestão e acompanhamento de leads para a concessionária autorizada **Sol Nascente Motos Honda** (Teresina e Timon).

---

## 1. Visão Geral do Projeto

O **Sol Nascente Motos CRM** é uma aplicação web desenvolvida para otimizar o processo de captação e conversão de clientes interessados na aquisição de motocicletas Honda. O sistema combina uma **Landing Page pública** voltada para o cliente final e um **Dashboard Administrativo protegido** para a equipe de vendas e administração.

### Objetivo Principal

Gerenciar o ciclo de vida completo dos leads recebidos pela concessionária:
```
Captura na Landing Page
       ↓
Persistência no Firestore
       ↓
Gestão e Atualização de Status
       ↓
Monitoramento em Tempo Real
       ↓
Cálculo Dinâmico dos KPIs do Funil
```

---

## 2. Funcionalidades Principais

- **Landing Page Pública (`/`)**:
  - Apresentação da marca Sol Nascente e catálogo de modelos Honda (CG 160, Biz, Pop 110i, NXR 160 Bros, PCX, CB 300F, etc.).
  - Informações sobre consórcio, pós-venda e unidades (Teresina e Timon).
  - Formulário de captura de leads integrado com validação em tempo real (`LeadCaptureForm.tsx`).
- **Autenticação Firebase (`/login`)**:
  - Acesso restrito para administradores e consultores de vendas via e-mail e senha.
  - Tratamento humanizado de erros de autenticação (`AuthErrorBanner.tsx`).
  - Recuperação de senha integrada com envio de e-mail de redefinição.
  - Proteção de rotas internas via componente `ProtectedRoute`.
- **Dashboard Administrativo (`/dashboard`)**:
  - **KPIs em Tempo Real (`MetricGrid.tsx`)**:
    - **Total de Leads**: contagem total de leads cadastrados na base.
    - **Novos**: leads com status `NOVO`.
    - **Em Contato**: leads em fase de atendimento com status `EM_CONTATO`.
    - **Convertidos**: vendas concluídas com status `CONVERTIDO`.
  - **Tabela de Leads Completa (`LeadsTable.tsx`)**:
    - Listagem dinâmica sincronizada em tempo real com o Cloud Firestore (`onSnapshot`).
    - Filtro combinado por texto (busca por Nome ou WhatsApp), Status, Unidade e Modelo.
    - Paginação client-side configurada para 10 itens por página.
    - **Alteração de Status Inline**: dropdown interativo diretamente na coluna de status, com feedback visual (loading spinner) e toast notifications.
    - Link direto para abertura de conversa no WhatsApp via API `wa.me`.
  - **Modal de Detalhes do Lead (`LeadDetailsModal.tsx`)**:
    - Visualização modal acionada pelo menu de ações ("Ver detalhes").
    - Exibe todas as informações consolidadas do lead: Nome, E-mail, WhatsApp, Unidade, Modelo de interesse, Status e data/hora de cadastro.
    - Fechamento intuitivo via botão, clique no backdrop ou tecla `Escape`.

---

## 3. Ciclo de Vida do Lead

O fluxo de dados de um lead percorre as seguintes etapas:

```
[Cliente] Preenche formulário na Landing Page
                         ↓
             [createLead.ts] Validação e montagem do Lead
                         ↓
        [Cloud Firestore] Salvo na coleção 'leads' (Status: NOVO)
                         ↓
  [useLeads Hook] Listener em tempo real (onSnapshot) notifica o Dashboard
                         ↓
[DashboardPage] Recalcula KPIs e atualiza a Tabela de Leads instantaneamente
                         ↓
[Vendedor] Interage via WhatsApp e altera o status na tabela (ex: EM_CONTATO)
                         ↓
     [updateLeadStatus.ts] Operação parcial updateDoc({ status })
                         ↓
[KPIs e Tabela] Reagem em tempo real sem necessidade de recarregar a página
```

### Estados de Domínio

Os valores de status representam as etapas do funil de vendas e são definidos como tipo de união estrito no TypeScript:

| Valor no Firestore | Label na Interface | Descrição no Funil |
|:---|:---|:---|
| `NOVO` | **Novo** | Lead recém-cadastrado via Landing Page, aguardando primeiro contato. |
| `EM_CONTATO` | **Em contato** | Consultor iniciou atendimento e negociação com o cliente. |
| `CONVERTIDO` | **Convertido** | Negociação concluída com sucesso (venda faturada). |
| `PERDIDO` | **Perdido** | Cliente desistiu ou não teve interesse confirmado. |

> **Nota de Domínio**: Leads com status `PERDIDO` permanecem contabilizados no **Total de Leads**, mas não entram nas métricas de *Novos*, *Em Contato* ou *Convertidos*.

---

## 4. Arquitetura do Sistema (Architecture)

### Comunicação Direta com o Firebase Web SDK (No Custom API)

Uma decisão arquitetural central deste projeto foi conectar o frontend React diretamente aos serviços gerenciados do **Google Firebase** através do **Firebase Web SDK v12 modular**, sem a intermediação de uma API REST tradicional (Node.js, Express, NestJS, etc.).

```
┌────────────────────────────────────────────────────────┐
│               Frontend React + TypeScript              │
│  (Landing Page, Formulário de Lead, Dashboard, Tabela) │
└──────────────────────────┬─────────────────────────────┘
                           │
                 Firebase Web SDK (v12)
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│   Firebase Authentication    │ │       Cloud Firestore        │
│   (Sessão de Administrador)  │ │      (Coleção 'leads')       │
└──────────────────────────────┘ └──────────────────────────────┘
```

### Por que não há uma API customizada?

O Firebase fornece SDKs de cliente altamente maduros e seguros, permitindo autenticação e operações de leitura/escrita diretamente no Firestore.

#### Vantagens para o Projeto:
1. **Infraestrutura Reduzida**: Não é necessário provisionar, monitorar ou escalar servidores backend, containers Docker ou clusters.
2. **Desenvolvimento Rápido (Parte do desafio)**: Elimina o boilerplate de criar endpoints CRUD duplicados (rotas, controllers, DTOs, serializers).
3. **Reatividade Nativa**: Sincronização bidirecional em tempo real via WebSockets (`onSnapshot`) sem necessidade de configurar servidores WebSocket ou Socket.io dedicados.
4. **Segurança na Borda**: O controle de acesso é delegado ao Firebase Authentication e às **Firestore Security Rules**, aplicadas diretamente na camada de dados.

#### Trade-offs e Considerações:
- **Responsabilidade nas Security Rules**: Sem uma API como barreira, as regras do Firestore devem ser rigorosas para impedir gravações e leituras não autorizadas.
- **Lógica de Negócios Não Confiável no Cliente**: Operações críticas ou que exigem credenciais secretas (ex: envio de e-mails via SMTP restrito, webhooks de pagamento) não devem residir no cliente e, futuramente, demandarão Cloud Functions.
- **Segredos do Servidor**: Chaves de API privadas (ex: Service Accounts) jamais devem ser expostas no código do frontend.

---

## 5. Estrutura do Documento no Firestore

Os dados dos leads são armazenados na coleção raiz `leads`:

```
leads/{leadId}
```

### Estrutura dos Campos:

| Campo | Tipo | Descrição |
|:---|:---|:---|
| `id` | `string` | ID automático gerado pelo Firestore (`doc.id`). |
| `name` | `string` | Nome completo do cliente. |
| `initials` | `string` | Iniciais do nome para exibição no avatar (ex: "AP"). |
| `email` | `string` | E-mail do cliente (opcional no formulário público). |
| `whatsapp` | `string` | Telefone com DDD formatado (ex: "(86) 98124-9010"). |
| `whatsappUrl` | `string` | Link direto para o WhatsApp (ex: `https://wa.me/5586981249010`). |
| `model` | `string` | Identificador interno do modelo (ex: "cg160", "biz"). |
| `modelDisplay` | `string` | Nome de exibição formatado (ex: "Honda CG 160"). |
| `unit` | `'TERESINA' \| 'TIMON'` | Concessionária de interesse selecionada. |
| `status` | `LeadStatus` | `'NOVO' \| 'EM_CONTATO' \| 'CONVERTIDO' \| 'PERDIDO'`. |
| `createdAt` | `Timestamp` / `string` | Data e hora de criação do lead via `serverTimestamp()`. |

---

## 6. Stack Tecnológica

| Tecnologia | Versão | Função no Projeto |
|:---|:---|:---|
| **React** | `^19.2.8` | Biblioteca principal de interface de usuário (UI). |
| **TypeScript** | `~6.0.2` | Tipagem estática e garantia de contratos de dados. |
| **Vite** | `^8.3.0` | Bundler e ambiente de desenvolvimento ultrarrápido. |
| **Tailwind CSS** | `^4.3.3` | Framework de estilização utilitária com `@tailwindcss/vite`. |
| **Firebase Web SDK** | `^12.19.0` | Integração modular com Authentication e Cloud Firestore. |
| **React Router DOM** | `^7.18.3` | Roteamento declarativo no cliente (SPA). |
| **React Hook Form** | `^7.88.0` | Gerenciamento de estado e submissão de formulários. |
| **Zod** | `^4.6.5` | Validação de esquemas e dados. |
| **React Toastify** | `^11.1.0` | Sistema de notificações toast para feedback ao usuário. |
| **Oxlint** | `^1.81.0` | Linter de alta performance em Rust. |
| **pnpm** | `^10.x` | Gerenciador de pacotes eficiente. |

---

## 7. Estrutura do Repositório

```
CRM_Honda/
├── AGENTS.md                   # Diretrizes operacionais para agentes de engenharia
├── GEMINI.md                   # Regras de escopo e exploração do repositório
├── README.md                   # Documentação oficial do projeto
├── docs/                       # Especificações e levantamento de requisitos
│   ├── Documentação de Tecnologias.pdf
│   └── Especificação de Requisitos.pdf
└── frontend/                   # Aplicação cliente React + Vite
    ├── .env.example            # Template das variáveis de ambiente do Firebase
    ├── .oxlintrc.json          # Configuração de regras do linter Oxlint
    ├── index.html              # Ponto de entrada HTML da SPA
    ├── package.json            # Scripts e dependências do frontend
    ├── pnpm-lock.yaml          # Lockfile de dependências
    ├── vite.config.ts          # Configuração do Vite com plugins React e Tailwind
    └── src/
        ├── App.tsx             # Configuração de rotas e providers da aplicação
        ├── main.tsx            # Inicialização e montagem do React DOM
        ├── index.css           # Design tokens, fontes e utilitários globais
        ├── assets/             # Imagens estáticas e logotipo oficial
        ├── components/
        │   ├── auth/           # Formulário de login, proteção de rotas, inputs de senha
        │   ├── dashboard/      # Cards métricos, cabeçalho do painel
        │   │   └── leads/      # Tabela, toolbar, paginação, modal de detalhes, status
        │   ├── layout/         # AppLayout, Sidebar e Header do Dashboard
        │   └── public/         # Cabeçalho, rodapé e formulário da Landing Page
        ├── config/             # Re-exportações de configuração do Firebase
        ├── contexts/           # Contexto de autenticação (`AuthContext.tsx`, `useAuth.ts`)
        ├── hooks/              # Hooks customizados (`useLeads.ts`)
        ├── pages/              # Páginas da aplicação (LandingPage, LoginPage, DashboardPage)
        ├── services/           # Camada de comunicação com o Firebase
        │   ├── firebase/       # Inicialização do Firebase, auth e referências Firestore
        │   └── leads/          # Funções de criação (`createLead`) e atualização (`updateLeadStatus`)
        └── types/              # Definições TypeScript de domínio (`auth.ts`)
```

---

## 8. Configuração e Instalação Local

### Pré-requisitos
- **Node.js**: Versão 20 ou superior recomendada.
- **pnpm**: Versão 9 ou 10 (`npm install -g pnpm`).

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/CRM_Honda.git
cd CRM_Honda
```

### Passo 2: Instalar Dependências do Frontend
```bash
cd frontend
pnpm install
```

### Passo 3: Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` dentro da pasta `frontend/`:
```bash
cp .env.example .env
```

Edite o arquivo `frontend/.env` e insira as credenciais do seu projeto Firebase:
```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

> **Aviso de Segurança**: As chaves `VITE_FIREBASE_*` são identificadores públicos utilizados pelo SDK web do Firebase para direcionar as requisições ao projeto correto no Google Cloud. Elas **não** são segredos administrativos e são embutidas no bundle compilado do navegador. A segurança reside nas **Firestore Security Rules**.

---

## 9. Configuração do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie um novo projeto.
2. **Ative o Firebase Authentication**:
   - Acesse **Authentication** > **Sign-in method**.
   - Habilite o provedor **Email/Password**.
   - Cadastre os usuários administradores na aba **Users**.
3. **Crie o Cloud Firestore**:
   - Acesse **Firestore Database** > **Criar banco de dados**.
   - Selecione a região mais próxima (ex: `southamerica-east1`).
4. **Configuração Recomendada de Security Rules**:
   No console do Cloud Firestore, aplique regras para permitir que qualquer usuário possa criar leads via formulário público, mas apenas usuários autenticados possam ler e atualizar o status dos leads:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /leads/{leadId} {
         // Qualquer visitante da Landing Page pode submeter um lead
         allow create: if request.resource.data.keys().hasAll(['name', 'whatsapp', 'model', 'unit', 'status', 'createdAt'])
                       && request.resource.data.status == 'NOVO';

         // Apenas administradores/vendedores autenticados podem visualizar e alterar status
         allow read, update: if request.auth != null;

         // Exclusão desabilitada
         allow delete: if false;
       }
     }
   }
   ```

---

## 10. Executando e Validando a Aplicação

Dentro do diretório `frontend/`:

### Executar Servidor de Desenvolvimento
```bash
pnpm dev
```
Acesse a aplicação em `http://localhost:5173`.

### Checagem de Tipos
```bash
npx tsc -b --noEmit
```

### Análise Estática de Código
```bash
pnpm lint
```

### Compilar Bundle de Produção
```bash
pnpm build
```

### Pré-visualizar Build de Produção
```bash
pnpm preview
```

---

## 11. Limitações Atuais

O projeto atual atende aos requisitos de MVP funcional com arquitetura enxuta, possuindo as seguintes delimitações de escopo:
- **Sem Backend Dedicado**: Toda a lógica de leitura e gravação ocorre via SDK de cliente no navegador.
- **Sem Exclusão ou Edição Plena**: A interface não permite alterar dados cadastrais (nome, telefone, modelo) ou deletar leads após o cadastro, permitindo apenas a alteração de status.
- **Histórico e Auditoria**: O sistema não armazena logs de quem alterou o status ou histórico cronológico de transições de status.
- **Filtros e Paginação em Memória**: A paginação atual é executada no cliente sobre o conjunto de leads carregados em memória.
- **Sem Integração Automática com WhatsApp Webhook**: A comunicação com o WhatsApp é feita por meio de deep link (`wa.me`), sem envio automatizado de mensagens de boas-vindas via API oficial da Meta/Twilio.

---

## 12. Recomendações para Produção

Antes de realizar o deploy desta aplicação em ambiente produtivo crítico, recomenda-se considerar as seguintes evoluções arquiteturais:

### 1. Segurança e Governança
- **Ativação do Firebase App Check**: Proteger os endpoints do Firestore contra abusos e tráfego de bots não autorizados utilizando reCAPTCHA Enterprise.
- **Custom Claims para Níveis de Acesso (RBAC)**: Utilizar claims personalizadas no token do Firebase Auth (ex: `admin`, `vendedor`, `gerente`) para restringir quais consultores podem alterar status ou exportar dados.
- **Separação de Ambientes**: Manter projetos Firebase distintos para `development`, `staging` e `production`.

### 2. Backend Serverless / Microsserviços
- **Firebase Cloud Functions**:
  - Disparar notificações automáticas quando um novo lead for criado (notificação por e-mail para a equipe de vendas ou webhook para o WhatsApp Business).
  - Sanitização e mascaramento de dados sensíveis na gravação.
  - Registro de auditoria em coleção separada (`leads/{leadId}/history`).

### 3. Observabilidade e Monitoramento
- **Error Tracking**: Integração com ferramentas como **Sentry** ou **Firebase Crashlytics for Web** para captura e rastreamento de exceções em tempo real.
- **Analytics de Conversão**: Instrumentação de métricas de conversão de funil com **Google Analytics 4** para mensurar o tempo médio entre o cadastro do lead e sua conversão.

### 4. Testes Automatizados
- **Testes Unitários**: Configurar Vitest + React Testing Library para testar componentes isolados (LeadStatus, LeadDetailsModal, useLeads).
- **Testes de Integração e E2E**: Configurar Cypress ou Playwright para validar os fluxos críticos (Login -> Dashboard -> Alteração de Status -> Persistência).
- **Firebase Rules Unit Tests**: Utilizar `@firebase/rules-unit-testing` para garantir que as regras de segurança do Firestore rejeitem operações indevidas.

### 5. Escalabilidade de Dados
- **Paginação Cursor-based no Firestore**: À medida que a concessionária acumular milhares de leads, migrar a consulta de `leads` para paginação baseada em cursores (`startAfter`, `limit`) para reduzir consumo de banda e leituras no Firestore.

---

## 13. Licença

Este projeto é de propriedade da **Sol Nascente Motos Honda**. Todos os direitos reservados.
