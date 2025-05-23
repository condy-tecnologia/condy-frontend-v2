import { UnauthorizedError } from '@/boilerplate/Errors';
import { useAuthStore } from '@/stores/auth';
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard',
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      requiresAuth: false,
      guestOnly: true, // Apenas usuários não autenticados
    },
  },
  /*
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: () => import('@/views/auth/Cadastro.vue'),
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
  */ {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['usuario', 'sindico'], // Ambos podem acessar
    },
  } /*
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
    */,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global de autenticação
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Verifica se o token ainda é válido
  if (authStore.token) {
    const isValid = await authStore.verifyToken();
    if (!isValid) {
      // Token inválido, limpar e redirecionar
      authStore.signOut();
      if (to.meta.requiresAuth) {
        return next({
          path: '/login',
          query: {
            notification: new UnauthorizedError().message,
            notificationType: new UnauthorizedError().notification.type,
          },
        });
      }
    }
  }

  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role;

  // Rota requer autenticação mas usuário não está logado
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      path: '/login',
      query: {
        notification: new UnauthorizedError().message,
        notificationType: new UnauthorizedError().notification.type,
      },
    });
  }

  // Rota apenas para visitantes mas usuário está logado
  if (to.meta.guestOnly && isAuthenticated) {
    return next('/dashboard');
  }

  // Verificar permissões de role
  if (to.meta.roles && isAuthenticated) {
    const allowedRoles = to.meta.roles as string[];
    if (!userRole || !allowedRoles.includes(userRole)) {
      return next('/unauthorized');
    }
  }

  next();
});

export default router;
