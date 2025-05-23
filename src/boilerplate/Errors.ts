import {
  BaseNotificationError,
  NotificationType,
  type NotificationPayload,
} from './NotificationBase';

// --- Classes de Erro Específicas ---

/**
 * Erro para requisições inválidas (HTTP 400).
 */
export class BadRequestError extends BaseNotificationError {
  constructor(
    message: string = 'Requisição inválida.',
    code: string = 'bad-request',
    details?: string
  ) {
    super(message, NotificationType.ERROR, code, details);
  }
}

/**
 * Erro para não autorizado (HTTP 401).
 * Usado quando a autenticação é necessária e falhou ou ainda não foi fornecida.
 */
export class UnauthorizedError extends BaseNotificationError {
  constructor(
    message: string = 'Não autorizado. Autenticação necessária.',
    code: string = 'unauthorized',
    details?: string
  ) {
    super(message, NotificationType.ERROR, code, details);
  }
}

/**
 * Erro para acesso proibido (HTTP 403).
 * Usado quando o servidor entende a requisição, mas se recusa a autorizá-la.
 */
export class ForbiddenError extends BaseNotificationError {
  constructor(
    message: string = 'Acesso proibido. Você não tem permissão para este recurso.',
    code: string = 'forbidden',
    details?: string
  ) {
    super(message, NotificationType.ERROR, code, details);
  }
}

/**
 * Erro para recurso não encontrado (HTTP 404).
 */
export class NotFoundError extends BaseNotificationError {
  constructor(
    message: string = 'Recurso não encontrado.',
    code: string = 'not-found',
    details?: string
  ) {
    super(message, NotificationType.ERROR, code, details);
  }
}

/**
 * Erro interno do servidor (HTTP 500).
 */
export class InternalServerError extends BaseNotificationError {
  constructor(
    message: string = 'Erro interno do servidor. Tente novamente mais tarde.',
    code: string = 'server-error',
    details?: string
  ) {
    super(message, NotificationType.ERROR, code, details);
  }
}

/**
 * Erro de validação de dados.
 */
export class ValidationError extends BaseNotificationError {
  constructor(
    message: string = 'Erro de validação. Verifique os dados fornecidos.',
    code: string = 'validation-error',
    details?: string
  ) {
    super(message, NotificationType.ERROR, code, details);
  }
}

// --- Mensagens de Notificação Pré-definidas ---
// Usadas para passar via query params ou para consistência nas mensagens.
// A chave do objeto é o 'code' da notificação.

export const predefinedNotifications: Record<
  string,
  Omit<NotificationPayload, 'code'>
> = {
  // Erros Comuns
  'login-required': {
    message: 'Você precisa estar logado para acessar esta página.',
    type: NotificationType.ERROR,
  },
  'token-invalido': {
    message:
      'Sua sessão expirou ou o token é inválido. Por favor, faça login novamente.',
    type: NotificationType.ERROR,
  },
  'unauthorized-access': {
    message: 'Você não tem permissão para acessar este recurso.',
    type: NotificationType.ERROR,
  },
  'generic-error': {
    message: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    type: NotificationType.ERROR,
  },
  'form-validation-error': {
    message: 'Por favor, corrija os erros destacados no formulário.',
    type: NotificationType.ERROR,
  },
  'resource-not-found': {
    message: 'O recurso solicitado não foi encontrado.',
    type: NotificationType.ERROR,
  },

  // Sucesso
  'login-success': {
    message: 'Login realizado com sucesso! Redirecionando...',
    type: NotificationType.SUCCESS,
  },
  'logout-success': {
    message: 'Logout realizado com sucesso!',
    type: NotificationType.SUCCESS,
  },
  'registration-success': {
    message: 'Cadastro realizado com sucesso! Você já pode fazer login.',
    type: NotificationType.SUCCESS,
  },
  'profile-updated': {
    message: 'Perfil atualizado com sucesso!',
    type: NotificationType.SUCCESS,
  },
  'item-saved': {
    message: 'Item salvo com sucesso!',
    type: NotificationType.SUCCESS,
  },
  'item-deleted': {
    message: 'Item excluído com sucesso!',
    type: NotificationType.SUCCESS,
  },

  // Avisos
  'unsaved-changes': {
    message: 'Você possui alterações não salvas. Deseja sair mesmo assim?',
    type: NotificationType.WARNING,
  },
  'session-expiring': {
    message: 'Sua sessão está prestes a expirar. Salve seu trabalho.',
    type: NotificationType.WARNING,
  },
  'action-irreversible': {
    message: 'Esta ação é irreversível. Tem certeza que deseja continuar?',
    type: NotificationType.WARNING,
  },

  // Informações
  'feature-not-implemented': {
    message: 'Esta funcionalidade ainda não foi implementada.',
    type: NotificationType.INFO,
  },
  'data-loaded': {
    message: 'Dados carregados.',
    type: NotificationType.INFO,
  },
  'no-data': {
    message: 'Nenhum dado encontrado para os critérios selecionados.',
    type: NotificationType.INFO,
  },
};

/**
 * Função utilitária para obter uma notificação pré-definida pelo seu código.
 * @param code O código da notificação (ex: 'login-required').
 * @returns A NotificationPayload correspondente ou undefined se não encontrada.
 */
export function getPredefinedNotification(
  code: string
): NotificationPayload | undefined {
  const notificationBase = predefinedNotifications[code];
  if (notificationBase) {
    return { ...notificationBase, code };
  }
  console.warn(
    `[getPredefinedNotification] Código de notificação pré-definida não encontrado: ${code}`
  );
  return undefined;
}

/*
 Exemplo de uso das classes de erro:

 function algumaOperacaoPerigosa(userRole: string) {
   if (userRole !== 'admin') {
     throw new ForbiddenError("Apenas administradores podem realizar esta operação.", "admin-only-op");
   }
   // ... lógica da operaçãoB
 }

 try {
   algumaOperacaoPerigosa('user');
 } catch (error) {
   if (error instanceof BaseNotificationError) {
     console.error("Erro de Notificação:", error.notification.message, error.notification.type, error.notification.code);
     // Aqui você poderia, por exemplo, exibir a notificação para o usuário
     // showToast(error.notification.message, error.notification.type);
   } else {
     console.error("Erro desconhecido:", error);
   }
 }

 Exemplo de uso com router query:
 // No componente que recebe a notificação via query (ex: Login.vue, App.vue)
 import { useRoute } from 'vue-router';
 import { getPredefinedNotification } from '@/boilerplate/NotificationMessages';

 const route = useRoute();
 const notificationCode = route.query.notification as string;

 if (notificationCode) {
   const notification = getPredefinedNotification(notificationCode);
   if (notification) {
     // Exibir a notificação (ex: com um sistema de toast)
     // showGlobalToast(notification.message, notification.type);
     // É uma boa prática limpar a query após exibir a notificação
     // router.replace({ query: { ...route.query, notification: undefined, notificationType: undefined } });
   }
 }
*/
