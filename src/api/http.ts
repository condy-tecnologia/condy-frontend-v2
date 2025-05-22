import axios from 'axios'
import router from '@/router'

// Instância global de HTTP para todo o app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', // ajuste conforme seu backend
  withCredentials: true, // permite cookies httpOnly se backend optar por esta estratégia
})

// Adiciona token JWT no header Authorization se estiver salvo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Exemplo de tratamento global de erros (pode ser expandido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o token expirou ou deu 401, redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      router.push('/sign-in')
    }
    return Promise.reject(error)
  }
)

export default api 