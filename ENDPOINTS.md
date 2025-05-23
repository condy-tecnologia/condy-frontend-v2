# Guia da API - Plataforma Condy (MVP)

Este documento descreve os endpoints da API e os modelos de dados para o Produto Mínimo Viável (MVP) da Plataforma Condy.
A API é construída com Laravel 12 e utiliza Laravel Sanctum para autenticação.

## Convenções Gerais da API

- **URL Base:** `/api`
- **Autenticação:** Laravel Sanctum (Bearer Token). Endpoints protegidos requerem o header `Authorization: Bearer <token>`.
- **Formato de Resposta:** JSON.
- **Códigos de Status HTTP:**
  - `200 OK`: Requisição bem-sucedida.
  - `201 Created`: Recurso criado com sucesso.
  - `204 No Content`: Requisição bem-sucedida, sem conteúdo para retornar (ex: DELETE).
  - `400 Bad Request`: Requisição inválida (ex: dados faltando).
  - `401 Unauthorized`: Autenticação falhou ou não foi fornecida.
  - `403 Forbidden`: Autenticado, mas sem permissão para acessar o recurso.
  - `404 Not Found`: Recurso não encontrado.
  - `422 Unprocessable Entity`: Validação falhou (erros de validação no corpo da resposta).
  - `500 Internal Server Error`: Erro no servidor.
- **Paginação:** Onde aplicável, as respostas de listagem serão paginadas usando os parâmetros `?page=<numero>&per_page=<quantidade>`.
- **Uploads de Arquivo:** Para campos como `relatorio_fotografico_urls`, `estatuto_url`, etc., a API esperará URLs de arquivos já hospedados em um serviço de armazenamento (ex: S3, Cloudinary). O upload direto de binários pode ser implementado separadamente, se necessário.

---

## Modelos de Dados (Eloquent Models) Principais

### 1. `User` (`App\Models\User`)

Representa todos os tipos de usuários na plataforma.

- `id` (PK, BigInt, AutoIncrement)
- `nome` (String)
- `cpf_cnpj` (String, Unique)
- `whatsapp` (String, Unique)
- `email` (String, Unique, Nullable inicialmente dependendo do fluxo)
- `password` (String, Hash)
- `user_type` (Enum: 'PRESTADOR', 'SINDICO_RESIDENTE', 'SINDICO_PROFISSIONAL', 'ADMIN_IMOVEIS', 'ADMIN_PLATAFORMA')
- `status` (Enum: 'ATIVO', 'INCOMPLETO', 'BLOQUEADO', 'PENDENTE_VALIDACAO') - Default: 'PENDENTE_VALIDACAO' ou 'INCOMPLETO'
- `email_verified_at` (Timestamp, Nullable)
- `remember_token` (String, Nullable)
- `created_at`, `updated_at` (Timestamps)

**Relacionamentos:**

- `profileProvider()`: One-to-One com `ProfileProvider` (se `user_type` for 'PRESTADOR').
- `profileSyndic()`: One-to-One com `ProfileSyndic` (se `user_type` for 'SINDICO_RESIDENTE' ou 'SINDICO_PROFISSIONAL').
- `profilePropertyManager()`: One-to-One com `ProfilePropertyManager` (se `user_type` for 'ADMIN_IMOVEIS').
- `condominiums()`: One-to-Many com `Condominium` (se `user_type` for síndico ou admin de imóveis, representa os condomínios que gerencia).
- `serviceRequestsCreated()`: One-to-Many com `ServiceRequest` (usuário que criou o chamado).
- `serviceRequestsAssigned()`: One-to-Many com `ServiceRequest` (prestador ao qual o chamado foi designado).
- `termsAcceptances()`: One-to-Many com `TermAcceptance`.

### 2. Perfis Específicos (Vinculados ao `User`)

- **`ProfileProvider` (`App\Models\ProfileProvider`)**: Detalhes do Prestador.
  - `id`, `user_id` (FK para `User`), `nome_fantasia` (String, Nullable), `razao_social` (String, Nullable - se CNPJ), `cep` (String), `endereco` (String), `cidade` (String), `raio_atuacao` (JSON/TEXT - array de cidades/raios), `segmentos_atuacao` (JSON/TEXT - array de segmentos), `regime_tributario` (String, Nullable - se CNPJ), `data_nascimento` (Date, Nullable - se CPF), `created_at`, `updated_at`.
- **`ProfileSyndic` (`App\Models\ProfileSyndic`)**: Detalhes do Síndico.
  - `id`, `user_id` (FK para `User`), `periodo_mandato_inicio` (Date, Nullable), `periodo_mandato_fim` (Date, Nullable), `subsyndic_info` (JSON, Nullable - para dados do subsíndico, se aplicável e não normalizado), `created_at`, `updated_at`.
- **`ProfilePropertyManager` (`App\Models\ProfilePropertyManager`)**: Detalhes da Administradora de Imóveis.
  - `id`, `user_id` (FK para `User`), `razao_social_empresa` (String), `nome_fantasia_empresa` (String), `responsavel_empresa_nome` (String), `cep_empresa` (String), `endereco_empresa` (String), `contrato_prestacao_servico_info` (JSON/TEXT - detalhes do contrato), `contrato_vigencia_inicio` (Date, Nullable), `contrato_vigencia_fim` (Date, Nullable), `created_at`, `updated_at`.

### 3. `Condominium` (`App\Models\Condominium`)

Representa um condomínio gerenciado na plataforma.

- `id` (PK, BigInt, AutoIncrement)
- `manager_user_id` (FK para `User` - Síndico ou Admin de Imóveis responsável)
- `cnpj` (String, Unique)
- `nome_fantasia` (String)
- `razao_social` (String)
- `cep` (String)
- `endereco` (String)
- `cidade` (String)
- `regime_tributario` (String, Nullable)
- `estatuto_url` (String, Nullable - link para o documento do estatuto)
- `quantidade_moradias` (Integer)
- `dados_pagamento_plano` (JSON/TEXT, Nullable - informações simplificadas do plano para o MVP)
- `areas_comuns` (JSON/TEXT - lista ou descrição das áreas comuns)
- `created_at`, `updated_at`

**Relacionamentos:**

- `manager()`: BelongsTo `User`.
- `assets()`: HasMany `Asset`.
- `serviceRequests()`: HasMany `ServiceRequest`.

### 4. `Asset` (`App\Models\Asset`)

Representa um ativo dentro de um condomínio.

- `id` (PK, BigInt, AutoIncrement)
- `condominium_id` (FK para `Condominium`)
- `asset_code` (String, Unique por condomínio - gerado automaticamente, ex: '00001')
- `descricao_ativo` (String)
- `local_instalacao` (String)
- `marca` (String, Nullable)
- `modelo` (String, Nullable)
- `data_instalacao` (Date, Nullable)
- `valor_compra` (Decimal, Nullable)
- `garantia` (Boolean, Default: false)
- `garantia_validade` (Date, Nullable - se `garantia` for true)
- `garantia_fornecedor_info` (JSON, Nullable - {nf, cnpj, contato, razao_social})
- `contrato_manutencao` (Boolean, Default: false)
- `contrato_validade` (Date, Nullable - se `contrato_manutencao` for true)
- `contrato_fornecedor_info` (JSON, Nullable - {contrato_url, cnpj, contato, razao_social})
- `relatorio_fotografico_urls` (JSON, Nullable - array de URLs de fotos)
- `created_at`, `updated_at`

**Relacionamentos:**

- `condominium()`: BelongsTo `Condominium`.
- `serviceRequests()`: HasMany `ServiceRequest`.

### 5. `ServiceRequest` (`App\Models\ServiceRequest`)

Representa um chamado/solicitação de serviço.

- `id` (PK, BigInt, AutoIncrement)
- `condominium_id` (FK para `Condominium`)
- `asset_id` (FK para `Asset`, Nullable - se o chamado não for específico de um ativo)
- `requester_user_id` (FK para `User` - quem abriu o chamado)
- `assigned_provider_user_id` (FK para `User`, Nullable - prestador designado)
- `admin_forwarder_user_id` (FK para `User`, Nullable - admin que encaminhou)
- `numero_chamado` (String, Unique - gerado automaticamente)
- `descricao_ocorrido` (Text)
- `fotos_videos_urls` (JSON, Nullable - array de URLs)
- `informacoes_adicionais` (Text, Nullable)
- `prioridade` (Enum: 'BAIXA', 'MEDIA', 'ALTA', 'URGENTE')
- `escopo` (Enum: 'ORCAMENTO', 'SERVICO_IMEDIATO')
- `status` (Enum: 'NOVO', 'EM_ANALISE_ADMIN', 'ENCAMINHADO_PRESTADOR', 'ACEITO_PRESTADOR', 'ORCAMENTO_ENVIADO', 'APROVADO_SINDICO', 'EM_EXECUCAO', 'CONCLUIDO', 'CANCELADO', 'REJEITADO_PRESTADOR') - Default: 'NOVO'
- `created_at`, `updated_at`

**Relacionamentos:**

- `condominium()`: BelongsTo `Condominium`.
- `asset()`: BelongsTo `Asset`.
- `requester()`: BelongsTo `User`.
- `provider()`: BelongsTo `User`.
- `adminForwarder()`: BelongsTo `User`.

### 6. `TermAcceptance` (`App\Models\TermAcceptance`)

Registra a aceitação dos termos de uso.

- `id` (PK)
- `user_id` (FK para `User`, Nullable se aceito antes do cadastro completo)
- `temp_user_identifier` (String, Nullable - ex: CPF/CNPJ usado na checagem inicial)
- `terms_version` (String - ex: "1.0.0")
- `ip_address` (String, Nullable)
- `user_agent` (Text, Nullable)
- `accepted_at` (Timestamp)

**Relacionamentos:**

- `user()`: BelongsTo `User`.

### 7. `PasswordResetToken` (`App\Models\PasswordResetToken`)

(Laravel já possui `password_reset_tokens`, mas se for um fluxo customizado para WhatsApp)

- `identifier` (String, Index - CPF/CNPJ ou email)
- `token` (String, Unique - o token enviado)
- `created_at` (Timestamp)

---

## Endpoints da API

### Authentication & Access (`/api/auth`, `/api/access`)

1.  **Verificação de Acesso Inicial**

    - **Endpoint:** `POST /api/access/check`
    - **Descrição:** Verifica o status do usuário (CPF/CNPJ, Nome, WhatsApp) na plataforma.
    - **Request Body:**
      ```json
      {
        "cpf_cnpj": "string",
        "nome": "string",
        "whatsapp": "string"
      }
      ```
    - **Response (200 OK):**
      ```json
      {
          "status": "NO_CADASTRO" | "CADASTRO_COMPLETO" | "CADASTRO_INCOMPLETO" | "BLOQUEADO",
          "user_type_suggestion": "PRESTADOR" | "SINDICO" | null // Se NO_CADASTRO, pode sugerir ou indicar fallback
      }
      ```
    - **Referência:** #1

2.  **Registrar Aceite dos Termos**

    - **Endpoint:** `POST /api/terms/accept`
    - **Descrição:** Usuário aceita os termos antes de prosseguir com o cadastro.
    - **Request Body:**
      ```json
      {
        "temp_user_identifier": "string", // CPF/CNPJ da etapa de check
        "terms_version": "string" // Ex: "v1.2025-05"
      }
      ```
    - **Response (200 OK):**
      ```json
      {
        "message": "Termos aceitos com sucesso.",
        "acceptance_id": "integer" // ID do registro de aceite
      }
      ```
    - **Referência:** #2 (menciona aprovar termos antes de seguir)

3.  **Login com CPF/CNPJ (Inicia fluxo de token via WhatsApp)**

    - **Endpoint:** `POST /api/auth/login`
    - **Descrição:** Solicita o envio de um token de login para o WhatsApp do usuário. (A API apenas registra a solicitação; o envio do token é um processo assíncrono).
    - **Request Body:**
      ```json
      {
        "cpf_cnpj": "string"
      }
      ```
    - **Response (200 OK):**
      ```json
      {
        "message": "Se o CPF/CNPJ estiver correto, um token será enviado para o WhatsApp associado."
      }
      ```
    - **Referência:** #10

4.  **Verificar Token e Efetuar Login (Sanctum)**

    - **Endpoint:** `POST /api/auth/token/verify`
    - **Descrição:** Usuário insere o token recebido via WhatsApp para completar o login e obter um token Sanctum.
    - **Request Body:**
      ```json
      {
        "cpf_cnpj": "string",
        "token": "string" // Token recebido no WhatsApp
      }
      ```
    - **Response (200 OK):**
      ```json
      {
        "token": "string", // Token Sanctum
        "user": {
          /* ...dados do usuário... */
        }
      }
      ```
    - **Referência:** #10

5.  **Definir/Atualizar Senha (Autenticado)**

    - **Endpoint:** `POST /api/user/password`
    - **Autenticação:** Requerida (Sanctum)
    - **Descrição:** Permite ao usuário definir ou atualizar sua senha após o login (especialmente útil após o primeiro login com token).
    - **Request Body:**
      ```json
      {
        "password": "string",
        "password_confirmation": "string"
      }
      ```
    - **Response (200 OK):**
      ```json
      {
        "message": "Senha atualizada com sucesso."
      }
      ```
    - **Referência:** #10

6.  **Solicitar Redefinição de Senha**

    - **Endpoint:** `POST /api/auth/password/request-reset`
    - **Descrição:** Usuário solicita um token para redefinir a senha, enviado via WhatsApp.
    - **Request Body:**
      ```json
      {
        "cpf_cnpj": "string"
      }
      ```
    - **Response (200 OK):**
      ```json
      {
        "message": "Se o CPF/CNPJ for válido, um token de redefinição de senha será enviado para o WhatsApp."
      }
      ```
    - **Referência:** #11

7.  **Redefinir Senha com Token**

    - **Endpoint:** `POST /api/auth/password/reset`
    - **Descrição:** Usuário redefine a senha usando o token recebido.
    - **Request Body:**
      ```json
      {
        "cpf_cnpj": "string",
        "token": "string", // Token de redefinição
        "password": "string",
        "password_confirmation": "string"
      }
      ```
    - **Response (200 OK):**
      ```json
      {
        "message": "Senha redefinida com sucesso."
      }
      ```
    - **Referência:** #11

8.  **Logout (Autenticado)**
    - **Endpoint:** `POST /api/auth/logout`
    - **Autenticação:** Requerida (Sanctum)
    - **Descrição:** Invalida o token Sanctum do usuário.
    - **Response (200 OK):**
      ```json
      {
        "message": "Logout realizado com sucesso."
      }
      ```

---

### User Registration (`/api/register`)

_(Todos os endpoints de registro abaixo devem receber `cpf_cnpj`, `nome`, `whatsapp` preenchidos da etapa de acesso inicial, e um `term_acceptance_id` da aceitação dos termos. O `password` e `password_confirmation` também são esperados)._

1.  **Registrar Prestador de Serviço**

    - **Endpoint:** `POST /api/register/provider`
    - **Descrição:** Cadastra um novo usuário como Prestador de Serviço.
    - **Request Body (além dos comuns: `cpf_cnpj`, `nome`, `whatsapp`, `email`, `password`, `password_confirmation`, `term_acceptance_id`):**
      - **Se CNPJ:** `nome_fantasia` (string), `razao_social` (string), `regime_tributario` (string)
      - **Se CPF:** `data_nascimento` (date: YYYY-MM-DD)
      - **Comum a ambos:** `cep` (string), `endereco` (string), `cidade` (string), `raio_atuacao` (array de strings), `segmentos_atuacao` (array de strings)
    - **Response (201 Created):**
      ```json
      {
        "token": "string", // Token Sanctum
        "user": {
          /* ...dados do usuário e perfil prestador... */
        }
      }
      ```
    - **Referência:** #1, #2

2.  **Registrar Síndico Residente**

    - **Endpoint:** `POST /api/register/syndic/resident`
    - **Descrição:** Cadastra um novo usuário como Síndico Residente.
    - **Request Body (além dos comuns):**
      `email_pessoal` (string), `periodo_mandato_inicio` (date), `periodo_mandato_fim` (date),
      `subsyndic_nome_completo` (string, opcional), `subsyndic_cpf` (string, opcional), `subsyndic_whatsapp` (string, opcional), `subsyndic_email` (string, opcional)
    - **Response (201 Created):**
      ```json
      {
        "token": "string",
        "user": {
          /* ...dados do usuário e perfil síndico... */
        }
      }
      ```
    - **Referência:** #1, #4

3.  **Registrar Síndico Profissional**

    - **Endpoint:** `POST /api/register/syndic/professional`
    - **Descrição:** Cadastra um novo usuário como Síndico Profissional.
    - **Request Body (além dos comuns):**
      `email_pessoal` (string), `periodo_contrato_inicio` (date), `periodo_contrato_fim` (date),
      // Para MVP, dados de Responsável Condomínio e Sub-Responsável podem ser simplificados ou adicionados via outro endpoint após o cadastro principal.
      // Exemplo simplificado: `responsavel_condominio_principal_nome` (string, opcional)
    - **Response (201 Created):**
      ```json
      {
        "token": "string",
        "user": {
          /* ...dados do usuário e perfil síndico profissional... */
        }
      }
      ```
    - **Referência:** #1, #5

4.  **Registrar Administradora de Imóveis**
    - **Endpoint:** `POST /api/register/property-manager`
    - **Descrição:** Cadastra uma nova Administradora de Imóveis.
    - **Request Body (além dos comuns, onde `nome` é o nome da empresa e `whatsapp` é o da empresa):**
      `razao_social` (string), `nome_fantasia_empresa` (string), `email_empresa` (string), `responsavel_empresa_nome` (string), `cep_empresa` (string), `endereco_empresa` (string), `contrato_prestacao_servico_info` (string/text - descrição ou URL), `contrato_vigencia_inicio` (date), `contrato_vigencia_fim` (date)
    - **Response (201 Created):**
      ```json
      {
        "token": "string",
        "user": {
          /* ...dados do usuário e perfil administradora... */
        }
      }
      ```
    - **Referência:** #1, #6

---

### Condominiums (`/api/condominiums`)

_(Endpoints protegidos por Sanctum - requer perfil de Síndico ou Administradora)_

1.  **Listar Condomínios do Usuário Logado**

    - **Endpoint:** `GET /api/condominiums`
    - **Response (200 OK):** Array de objetos `Condominium`.

2.  **Criar Novo Condomínio**

    - **Endpoint:** `POST /api/condominiums`
    - **Request Body:** (Conforme campos do Model `Condominium` gerenciáveis pelo usuário)
      `cnpj`, `nome_fantasia`, `razao_social`, `cep`, `endereco`, `cidade`, `regime_tributario`, `estatuto_url` (opcional), `quantidade_moradias`, `dados_pagamento_plano` (string/JSON simples para MVP), `areas_comuns` (string/JSON)
    - **Response (201 Created):** Objeto `Condominium` criado.
    - **Referência:** #7

3.  **Obter Detalhes de um Condomínio**

    - **Endpoint:** `GET /api/condominiums/{condominium_id}`
    - **Response (200 OK):** Objeto `Condominium`.

4.  **Atualizar Condomínio**

    - **Endpoint:** `PUT /api/condominiums/{condominium_id}`
    - **Request Body:** Campos a serem atualizados.
    - **Response (200 OK):** Objeto `Condominium` atualizado.

5.  **Deletar Condomínio**
    - **Endpoint:** `DELETE /api/condominiums/{condominium_id}`
    - **Response (204 No Content):**

---

### Assets (`/api/condominiums/{condominium_id}/assets` e `/api/assets`)

_(Endpoints protegidos por Sanctum - requer perfil de Síndico ou Administradora com acesso ao condomínio)_

1.  **Listar Ativos de um Condomínio**

    - **Endpoint:** `GET /api/condominiums/{condominium_id}/assets`
    - **Response (200 OK):** Array de objetos `Asset`.
    - **Referência:** #8

2.  **Criar Novo Ativo em um Condomínio**

    - **Endpoint:** `POST /api/condominiums/{condominium_id}/assets`
    - **Request Body:** (Conforme campos do Model `Asset`)
      `descricao_ativo`, `local_instalacao`, `marca`, `modelo`, `data_instalacao`, `valor_compra`, `garantia` (boolean), `garantia_validade` (date), `garantia_fornecedor_info` (JSON), `contrato_manutencao` (boolean), `contrato_validade` (date), `contrato_fornecedor_info` (JSON), `relatorio_fotografico_urls` (array de strings)
    - **Response (201 Created):** Objeto `Asset` criado.
    - **Referência:** #8

3.  **Obter Detalhes de um Ativo Específico**

    - **Endpoint:** `GET /api/assets/{asset_id}`
    - **Response (200 OK):** Objeto `Asset`.

4.  **Atualizar Ativo**

    - **Endpoint:** `PUT /api/assets/{asset_id}`
    - **Request Body:** Campos a serem atualizados.
    - **Response (200 OK):** Objeto `Asset` atualizado.

5.  **Deletar Ativo**
    - **Endpoint:** `DELETE /api/assets/{asset_id}`
    - **Response (204 No Content):**

---

### Service Requests (Chamados) (`/api/service-requests` e `/api/admin/service-requests`)

1.  **Síndico/Admin Imóveis: Criar Novo Chamado**

    - **Endpoint:** `POST /api/service-requests`
    - **Autenticação:** Requerida (Síndico/Admin Imóveis)
    - **Request Body:**
      `condominium_id` (integer), `asset_id` (integer, opcional), `descricao_ocorrido` (text), `fotos_videos_urls` (array de strings, opcional), `informacoes_adicionais` (text, opcional), `prioridade` (enum: 'BAIXA', 'MEDIA', 'ALTA', 'URGENTE'), `escopo` (enum: 'ORCAMENTO', 'SERVICO_IMEDIATO')
    - **Response (201 Created):** Objeto `ServiceRequest` criado.
    - **Referência:** #19

2.  **Síndico/Admin Imóveis: Listar Meus Chamados Abertos**

    - **Endpoint:** `GET /api/service-requests/mine`
    - **Autenticação:** Requerida (Síndico/Admin Imóveis)
    - **Response (200 OK):** Array de objetos `ServiceRequest` do usuário logado.

3.  **Admin da Plataforma: Listar Todos os Chamados para Análise/Encaminhamento**

    - **Endpoint:** `GET /api/admin/service-requests`
    - **Autenticação:** Requerida (Admin da Plataforma)
    - **Query Params:** `?status=NOVO` (ou outros status), `?page=1`, `?per_page=15`
    - **Response (200 OK):** Array paginado de objetos `ServiceRequest`.
    - **Referência:** #19 (parte do Admin recebe notificação)

4.  **Admin da Plataforma: Encaminhar Chamado para Prestador**
    - **Endpoint:** `POST /api/admin/service-requests/{service_request_id}/forward`
    - **Autenticação:** Requerida (Admin da Plataforma)
    - **Request Body:**
      `provider_user_id` (integer - ID do usuário prestador)
      `admin_notes` (text, opcional - notas internas do admin sobre o encaminhamento)
    - **Response (200 OK):** Objeto `ServiceRequest` atualizado (status para 'ENCAMINHADO*PRESTADOR').
      *(Nota: Este endpoint deve disparar um evento no Laravel para notificar o prestador via WhatsApp de forma assíncrona).\_
    - **Referência:** #19

---

Lembre-se de criar as migrations, seeders (para tipos de usuário, talvez alguns segmentos iniciais), e as policies de autorização para proteger seus endpoints adequadamente. Este é um ponto de partida para o MVP; mais detalhes e endpoints podem ser adicionados conforme a necessidade.
