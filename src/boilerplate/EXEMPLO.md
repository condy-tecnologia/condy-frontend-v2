# Sistema de Erros e Notificações (`Errors.ts`)

Este arquivo (`src/boilerplate/Errors.ts`) define um sistema padronizado para lidar com erros e notificações na aplicação. Ele inclui classes de erro específicas, um conjunto de notificações pré-definidas e utilitários para facilitar seu uso.

## Visão Geral

O sistema é construído em torno da classe `BaseNotificationError`, que serve como base para todos os erros personalizados. Cada erro carrega consigo uma `NotificationPayload`, contendo:

- `message`: A mensagem a ser exibida ao usuário.
- `type`: O tipo de notificação (`ERROR`, `SUCCESS`, `WARNING`, `INFO`).
- `code`: Um código único para identificar a notificação/erro.
- `details`: (Opcional) Informações adicionais ou técnicas sobre o erro.

## Classes de Erro Específicas

São fornecidas classes de erro que herdam de `BaseNotificationError` para cenários comuns, mapeando frequentemente para códigos de status HTTP:

- **`BadRequestError` (HTTP 400):** Para requisições inválidas.
  ```typescript
  throw new BadRequestError(
    'Dados de entrada ausentes.',
    'missing-input',
    "O campo 'email' é obrigatório."
  );
  ```
- **`UnauthorizedError` (HTTP 401):** Para autenticação necessária e falha ou não fornecida.
  ```typescript
  throw new UnauthorizedError('Token de acesso inválido.', 'invalid-token');
  ```
- **`ForbiddenError` (HTTP 403):** Para acesso proibido a um recurso, mesmo que autenticado.
  ```typescript
  throw new ForbiddenError(
    'Você não tem permissão para editar este perfil.',
    'edit-profile-forbidden'
  );
  ```
- **`NotFoundError` (HTTP 404):** Para recurso não encontrado.
  ```typescript
  throw new NotFoundError(
    'Usuário com ID 123 não encontrado.',
    'user-not-found'
  );
  ```
- **`InternalServerError` (HTTP 500):** Para erros inesperados no servidor.
  ```typescript
  throw new InternalServerError(
    'Falha ao processar o pagamento.',
    'payment-gateway-error'
  );
  ```
- **`ValidationError`:** Para erros de validação de dados.
  ```typescript
  throw new ValidationError(
    'Formulário contém erros.',
    'form-validation',
    'Verifique os campos destacados.'
  );
  ```

### Construtor das Classes de Erro

Todas as classes de erro específicas seguem um padrão de construtor:

- **`BadRequestError` (HTTP 400):** Para requisições inválidas.
- **`UnauthorizedError` (HTTP 401):** Para autenticação necessária e falha ou não fornecida.
- **`ForbiddenError` (HTTP 403):** Para acesso proibido a um recurso, mesmo que autenticado.
- **`NotFoundError` (HTTP 404):** Para recurso não encontrado.
- **`InternalServerError` (HTTP 500):** Para erros inesperados no servidor.
- **`ValidationError`:** Para erros de validação de dados.
- **`bad-request`:** Para requisições inválidas.
- **`invalid-token`:** Para autenticação necessária e falha ou não fornecida.
- **`unauthorized-access`:** Para acesso proibido a um recurso, mesmo que autenticado.
- **`generic-error`:** Para erros inesperados no servidor.
- **`form-validation-error`:** Para erros de validação de dados.
- **`resource-not-found`:** Para recurso não encontrado.
