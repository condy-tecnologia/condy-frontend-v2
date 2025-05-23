import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard'
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('@/views/auth/SignIn.vue'),
    meta: {
      requiresAuth: false,
      guestOnly: true // Apenas usuários não autenticados
    }
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: () => import('@/views/auth/SignUp.vue'),
    meta: {
      requiresAuth: false,
      guestOnly: true
    }
  },
  {
    path: '/cadastro-sindico',
    name: 'CadastroSindico',
    component: () => import('@/views/auth/CadastroSindico.vue'),
    meta: {
      requiresAuth: false,
      guestOnly: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['usuario', 'sindico'] // Ambos podem acessar
    }
  },
  {
    path: '/dashboard/sindico',
    name: 'SindicoDashboard',
    component: () => import('@/views/sindico/SindicoDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['sindico'] // Apenas síndicos
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/errors/Unauthorized.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/errors/NotFound.vue'),
    meta: {
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard global de autenticação
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Verifica se o token ainda é válido
  if (authStore.token) {
    const isValid = await authStore.verifyToken()
    if (!isValid) {
      // Token inválido, limpar e redirecionar
      authStore.signOut()
      if (to.meta.requiresAuth) {
        return next('/sign-in')
      }
    }
  }
  
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.user?.role
  
  // Rota requer autenticação mas usuário não está logado
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/sign-in')
  }
  
  // Rota apenas para visitantes mas usuário está logado
  if (to.meta.guestOnly && isAuthenticated) {
    return next('/dashboard')
  }
  
  // Verificar permissões de role
  if (to.meta.roles && isAuthenticated) {
    const allowedRoles = to.meta.roles as string[]
    if (!userRole || !allowedRoles.includes(userRole)) {
      return next('/unauthorized')
    }
  }
  
  next()
})

// Adicionar meta title baseado na rota
router.afterEach((to) => {
  const appName = import.meta.env.VITE_APP_NAME || 'Condy'
  const routeName = to.name as string
  
  const titles: Record<string, string> = {
    'Home': 'Início',
    'SignIn': 'Entrar',
    'SignUp': 'Cadastrar',
    'CadastroSindico': 'Cadastro de Síndico',
    'Dashboard': 'Dashboard',
    'SindicoDashboard': 'Dashboard do Síndico',
    'Profile': 'Perfil',
    'Unauthorized': 'Acesso Negado',
    'NotFound': 'Página Não Encontrada'
  }
  
  const title = titles[routeName] || routeName
  document.title = `${title} | ${appName}`
})

export default router
