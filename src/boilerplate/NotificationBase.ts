/**
 * Define os tipos possíveis para uma notificação.
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Interface para a estrutura de uma payload de notificação.
 */
export interface NotificationPayload {
  message: string;
  type: NotificationType;
  code?: string; // Um código único para identificar a notificação, ex: 'login-required'
  details?: string; // Detalhes adicionais, se houver
}

/**
 * Classe base para erros que carregam uma payload de notificação.
 */
export class BaseNotificationError extends Error {
  public notification: NotificationPayload;

  constructor(
    message: string,
    type: NotificationType,
    code?: string,
    details?: string
  ) {
    super(message);
    this.name = this.constructor.name; // Garante que o nome do erro seja o da classe filha
    this.notification = { message, type, code, details };
  }
}
