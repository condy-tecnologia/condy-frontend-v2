import router from '@/router'
import { SecureStorage } from '@/utils/security'
import axios from 'axios'

// Instância global de HTTP para todo o app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', // ajuste conforme seu backend
  withCredentials: true, // permite cookies httpOnly se backend optar por esta estratégia
  timeout: 10000, // timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Proteção CSRF básica
  },
})

// Adiciona token JWT no header Authorization se estiver salvo
api.interceptors.request.use(
  (config) => {
    const token = SecureStorage.getToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Adiciona timestamp para evitar cache de requests sensíveis
    if (config.method?.toLowerCase() !== 'get') {
      config.headers['X-Timestamp'] = Date.now().toString()
    }
    
    return config
  },
  (error) => {
    console.error('Erro na requisição:', error)
    return Promise.reject(error)
  }
)

// Tratamento global de erros mais robusto
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log de erro para debug (remover em produção)
    if (import.meta.env.DEV) {
      console.error('Erro na API:', error)
    }
    
    const status = error.response?.status
    const message = error.response?.data?.message || 'Erro interno do servidor'
    
    switch (status) {
      case 401:
        // Token expirado ou inválido
        SecureStorage.removeToken()
        if (router.currentRoute.value.path !== '/sign-in') {
          router.push('/sign-in')
        }
        break
        
      case 403:
        // Acesso negado
        console.warn('Acesso negado:', message)
        break
        
      case 404:
        console.warn('Recurso não encontrado')
        break
        
      case 422:
        // Erro de validação
        console.warn('Erro de validação:', message)
        break
        
      case 429:
        // Rate limiting
        console.warn('Muitas requisições. Tente novamente em alguns minutos.')
        break
        
      case 500:
      case 502:
      case 503:
        // Erro do servidor
        console.error('Erro interno do servidor')
        break
        
      default:
        if (!navigator.onLine) {
          console.error('Sem conexão com a internet')
        }
    }
    
    return Promise.reject(error)
  }
)

export default api 