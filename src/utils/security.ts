import CryptoJS from 'crypto-js'

// Chave para criptografia local (em produção, deve vir do backend)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'fallback-key-change-in-production'

/**
 * Criptografa dados sensíveis antes de armazenar
 */
export function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString()
}

/**
 * Descriptografa dados sensíveis
 */
export function decryptData(encryptedData: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return ''
  }
}

/**
 * Sanitiza input do usuário para prevenir XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Valida CNPJ com algoritmo correto
 */
export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '')
  
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false
  }

  // Algoritmo de validação do CNPJ
  let sum = 0
  let weight = 2
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  
  let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  sum = 0
  weight = 2
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  
  let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  return parseInt(cnpj.charAt(12)) === digit1 && parseInt(cnpj.charAt(13)) === digit2
}

/**
 * Valida se o token JWT não está expirado
 */
export function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp > currentTime
  } catch {
    return false
  }
}

/**
 * Gera um nonce para CSP
 */
export function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
}

/**
 * Armazenamento seguro usando httpOnly cookies quando possível
 */
export class SecureStorage {
  static setToken(token: string): void {
    // Em produção, prefira httpOnly cookies via backend
    if (import.meta.env.PROD) {
      // Para produção, o token deve vir via httpOnly cookie do backend
      console.warn('Token sendo armazenado em localStorage em produção - considere httpOnly cookies')
    }
    
    const encrypted = encryptData(token)
    sessionStorage.setItem('_t', encrypted) // Usar sessionStorage ao invés de localStorage
  }

  static getToken(): string | null {
    const encrypted = sessionStorage.getItem('_t')
    if (!encrypted) return null
    
    const decrypted = decryptData(encrypted)
    
    // Valida se o token não expirou
    if (!isTokenValid(decrypted)) {
      this.removeToken()
      return null
    }
    
    return decrypted
  }

  static removeToken(): void {
    sessionStorage.removeItem('_t')
  }
} 