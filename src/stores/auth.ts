import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/http'
import router from '@/router'

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

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const user = ref<Record<string, any> | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function signUp(payload: SignUpPayload) {
    const { data } = await api.post('/auth/register', payload)
    handleAuthSuccess(data)
  }

  async function signIn(payload: SignInPayload) {
    const { data } = await api.post('/auth/login', payload)
    handleAuthSuccess(data)
  }

  function signOut() {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
    router.push('/sign-in')
  }

  function handleAuthSuccess(data: any) {
    token.value = data.access_token
    user.value = data.user
    if (token.value) {
      localStorage.setItem('access_token', token.value)
    }
    router.push('/')
  }

  return { token, user, isAuthenticated, signUp, signIn, signOut }
}) 