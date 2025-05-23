import api from '@/api/http'
import router from '@/router'
import { SecureStorage, sanitizeInput } from '@/utils/security'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface SignUpPayload {
  name: string
  email: string
  password: string
  role: 'usuario' | 'sindico'
}

interface SignInPayload {
  email: string
  password: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
  verified: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(SecureStorage.getToken())
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function signUp(payload: SignUpPayload) {
    try {
      loading.value = true
      error.value = null
      
      // Sanitiza os inputs
      const sanitizedPayload = {
        ...payload,
        name: sanitizeInput(payload.name),
        email: sanitizeInput(payload.email).toLowerCase(),
      }
      
      // Validações básicas
      if (!sanitizedPayload.email.includes('@')) {
        throw new Error('Email inválido')
      }
      
      if (sanitizedPayload.password.length < 8) {
        throw new Error('Senha deve ter pelo menos 8 caracteres')
      }
      
      const { data } = await api.post('/auth/register', sanitizedPayload)
      handleAuthSuccess(data)
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Erro no cadastro'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function signIn(payload: SignInPayload) {
    try {
      loading.value = true
      error.value = null
      
      // Sanitiza os inputs
      const sanitizedPayload = {
        email: sanitizeInput(payload.email).toLowerCase(),
        password: payload.password // Não sanitizar senha para não alterar
      }
      
      const { data } = await api.post('/auth/login', sanitizedPayload)
      handleAuthSuccess(data)
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Erro no login'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function verifyToken() {
    try {
      if (!token.value) return false
      
      const { data } = await api.get('/auth/verify')
      user.value = data.user
      return true
    } catch {
      // Token inválido, fazer logout
      signOut()
      return false
    }
  }

  function signOut() {
    token.value = null
    user.value = null
    error.value = null
    SecureStorage.removeToken()
    
    // Limpar outros dados sensíveis se houver
    
    router.push('/sign-in')
  }

  function handleAuthSuccess(data: any) {
    if (data.access_token && data.user) {
      token.value = data.access_token
      user.value = data.user
      SecureStorage.setToken(data.access_token)
      
      // Redirecionar baseado no role
      const redirectPath = data.user.role === 'sindico' ? '/dashboard/sindico' : '/dashboard'
      router.push(redirectPath)
    } else {
      throw new Error('Resposta inválida do servidor')
    }
  }

  // Limpar erro quando necessário
  function clearError() {
    error.value = null
  }

  return { 
    token, 
    user, 
    loading, 
    error, 
    isAuthenticated, 
    signUp, 
    signIn, 
    signOut, 
    verifyToken,
    clearError
  }
}) 