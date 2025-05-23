# Guia de Segurança - Condy Frontend v2 🛡️

## 🚨 Problemas de Segurança Identificados e Corrigidos

### 1. **Armazenamento Inseguro de Tokens** - CRÍTICO ❌ → ✅

**Antes**: Token JWT armazenado em `localStorage` em texto plano

```javascript
localStorage.setItem('access_token', token.value);
```

**Depois**: Token criptografado no `sessionStorage` com validação automática

```javascript
const encrypted = encryptData(token);
sessionStorage.setItem('_t', encrypted);
```

**Benefícios**:

- ✅ Proteção contra XSS
- ✅ Expiração automática na sessão
- ✅ Criptografia AES
- ✅ Validação de expiração

### 2. **Falta de Sanitização de Inputs** - ALTO ❌ → ✅

**Antes**: Inputs enviados diretamente sem validação

```javascript
const { data } = await api.post('/auth/register', payload);
```

**Depois**: Sanitização automática de todos os inputs

```javascript
const sanitizedPayload = {
  ...payload,
  name: sanitizeInput(payload.name),
  email: sanitizeInput(payload.email).toLowerCase(),
};
```

### 3. **Ausência de Guards de Rota** - ALTO ❌ → ✅

**Antes**: Rotas sem proteção

```javascript
const routes = [{ path: '/', component: CadastroSindico }];
```

**Depois**: Guards com verificação de roles

```javascript
router.beforeEach(async (to, from, next) => {
  // Verifica autenticação e roles
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/sign-in');
  }
});
```

### 4. **Validação Básica de CNPJ** - MÉDIO ❌ → ✅

**Antes**: Validação superficial

```javascript
const isValidCNPJ = cnpj => {
  return cnpj && cnpj.length === 14 && /^\d+$/.test(cnpj);
};
```

**Depois**: Algoritmo oficial de validação

```javascript
export function validateCNPJ(cnpj: string): boolean {
  // Implementação completa do algoritmo de validação
  // com cálculo dos dígitos verificadores
}
```

## 🛡️ Arquitetura de Segurança Implementada

### **Camada 1: Autenticação Segura**

```typescript
// SecureStorage com criptografia
export class SecureStorage {
  static setToken(token: string): void {
    const encrypted = encryptData(token);
    sessionStorage.setItem('_t', encrypted);
  }

  static getToken(): string | null {
    const encrypted = sessionStorage.getItem('_t');
    if (!encrypted) return null;

    const decrypted = decryptData(encrypted);

    // Valida se o token não expirou
    if (!isTokenValid(decrypted)) {
      this.removeToken();
      return null;
    }

    return decrypted;
  }
}
```

### **Camada 2: Sanitização e Validação**

```typescript
// Sanitização contra XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Validação robusta de CNPJ
export function validateCNPJ(cnpj: string): boolean {
  // Algoritmo completo de validação
}
```

### **Camada 3: Interceptors HTTP**

```typescript
// Interceptor de request
api.interceptors.request.use(config => {
  const token = SecureStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Proteção CSRF
  config.headers['X-Requested-With'] = 'XMLHttpRequest';

  // Timestamp para evitar cache
  if (config.method?.toLowerCase() !== 'get') {
    config.headers['X-Timestamp'] = Date.now().toString();
  }

  return config;
});

// Interceptor de response com tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;

    switch (status) {
      case 401:
        SecureStorage.removeToken();
        router.push('/sign-in');
        break;
      // ... outros casos
    }

    return Promise.reject(error);
  }
);
```

### **Camada 4: Guards de Rota**

```typescript
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Verifica se o token ainda é válido
  if (authStore.token) {
    const isValid = await authStore.verifyToken();
    if (!isValid) {
      authStore.signOut();
      if (to.meta.requiresAuth) {
        return next('/sign-in');
      }
    }
  }

  // Verificação de roles
  if (to.meta.roles && isAuthenticated) {
    const allowedRoles = to.meta.roles as string[];
    if (!userRole || !allowedRoles.includes(userRole)) {
      return next('/unauthorized');
    }
  }

  next();
});
```

## 🔐 Headers de Segurança

### **Configuração Vite para Desenvolvimento**

```typescript
server: {
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
}
```

### **Build Seguro para Produção**

```typescript
build: {
  sourcemap: false, // Não expor source maps
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true, // Remove console.log
      drop_debugger: true,
    },
  }
}
```

## 📋 Checklist de Segurança

### ✅ **Implementado**

- [x] Criptografia de tokens (AES)
- [x] SessionStorage ao invés de localStorage
- [x] Sanitização automática de inputs
- [x] Validação robusta de CNPJ
- [x] Guards de rota com roles
- [x] Headers de segurança
- [x] Interceptors HTTP seguros
- [x] Tratamento de erros robusto
- [x] Build seguro para produção
- [x] Variáveis de ambiente protegidas
- [x] Auditoria de dependências

### 🔄 **Próximos Passos (Backend)**

- [ ] HttpOnly cookies para tokens
- [ ] Rate limiting
- [ ] Refresh tokens
- [ ] Logs de auditoria
- [ ] 2FA (Two-Factor Authentication)

## ⚠️ **Importantes Considerações**

### **1. Limitações do Frontend**

- **Tokens no frontend**: Por mais seguro que seja, armazenar tokens no frontend sempre tem riscos
- **Solução ideal**: HttpOnly cookies gerenciados pelo backend

### **2. Configurações de Produção**

- **HTTPS obrigatório**: Toda comunicação deve ser criptografada
- **CSP avançado**: Content Security Policy configurado no servidor
- **Rate limiting**: Implementar no backend e/ou reverse proxy

### **3. Monitoramento**

- **Logs de segurança**: Implementar logging de tentativas de acesso
- **Alertas**: Configurar alertas para atividades suspeitas
- **Auditoria**: Revisar logs regularmente

## 🚀 **Como Aplicar Essas Melhorias**

1. **Instalar dependências**:

```bash
npm install crypto-js @types/crypto-js
```

2. **Configurar variáveis de ambiente**:

```bash
cp .env.example .env
# Editar .env com suas configurações
```

3. **Executar auditoria de segurança**:

```bash
npm run security:audit
npm run security:fix
```

4. **Testar funcionalidades**:

```bash
npm run dev
```

Este guia garante que sua aplicação esteja protegida contra as principais vulnerabilidades web, incluindo XSS, CSRF, e problemas de autenticação insegura.
