<template>
  <!-- Formulário de login -->
  <form @submit.prevent="fazerLogin" class="space-y-5">
    <!-- Email de cadastro -->
    <div class="form-group">
      <div class="input-container">
        <div class="input-icon">
          <img src="@/assets/svg/email_icon.svg" alt="Email" class="w-5 h-5" />
        </div>
        <input
          id="email-input"
          v-model="formData.email"
          type="email"
          class="form-input"
          :class="{ error: formData.email && !isValidEmail }"
          placeholder=" "
          required
          @input="validarEmail"
        />
        <label
          for="email-input"
          class="floating-label"
          :class="{ 'text-red-500': formData.email && !isValidEmail }"
        >
          Email de cadastro
        </label>
        <div v-if="formData.email && isValidEmail" class="check-icon">
          <img
            src="@/assets/svg/checkmark_success.svg"
            alt="Sucesso"
            class="w-5 h-5"
          />
        </div>
        <div v-if="formData.email && !isValidEmail" class="check-icon">
          <img
            src="@/assets/svg/checkmark_error.svg"
            alt="Erro"
            class="w-5 h-5"
          />
        </div>
      </div>
    </div>

    <!-- Senha de acesso -->
    <div class="form-group">
      <div class="input-container">
        <div class="input-icon">
          <img src="@/assets/svg/lock_icon.svg" alt="Senha" class="w-5 h-5" />
        </div>
        <input
          id="senha-input"
          v-model="formData.senha"
          :type="mostrarSenha ? 'text' : 'password'"
          class="form-input"
          placeholder=" "
          required
        />
        <label for="senha-input" class="floating-label">Senha de acesso</label>
        <div
          class="check-icon cursor-pointer"
          @click="alternarVisibilidadeSenha"
        >
          <img
            :src="
              mostrarSenha
                ? 'src/assets/svg/eye_off.svg'
                : 'src/assets/svg/eye.svg'
            "
            alt="Mostrar/Ocultar senha"
            class="w-5 h-5"
          />
        </div>
      </div>
    </div>

    <!-- Loading ou Botão de login -->
    <span v-if="loading" class="flex items-center justify-center">
      <img src="@/assets/loading.gif" alt="Carregando" class="w-10 h-10 mr-2" />
    </span>
    <span v-else>
      <button
        type="submit"
        class="btn-primary"
        :disabled="loading || !isValidEmail || !formData.senha"
      >
        Acessar minha conta
      </button>
    </span>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

const emit = defineEmits(['showError']);

const formData = reactive({
  email: '',
  senha: '',
});

const loading = ref(false);

const errorMessage = ref('');
const errorTitle = ref('');
const mostrarSenha = ref(false);

const isValidEmail = computed(() => {
  if (!formData.email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(formData.email);
});

function validarEmail() {
  // Validação em tempo real do email
}

function alternarVisibilidadeSenha() {
  mostrarSenha.value = !mostrarSenha.value;
}

async function fazerLogin() {
  if (!isValidEmail.value || !formData.senha) {
    return;
  }

  loading.value = true;

  try {
    // Aqui você faria a chamada para a API de login
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.senha,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // Salvar token, redirecionar, etc.
      // Exemplo: localStorage.setItem('token', data.token)
      // this.$router.push('/dashboard')
      console.log('Login realizado com sucesso', data);
    } else {
      const errorData = await response.json();
      errorTitle.value = 'Dados incorretos';
      errorMessage.value =
        'Email ou senha incorretos. Verifique seus dados e tente novamente.';
      emit('showError', {
        errorTitle: errorTitle.value,
        errorMessage: errorMessage.value,
      });
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    errorTitle.value = 'Erro de conexão';
    errorMessage.value =
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
    emit('showError', {
      errorTitle: errorTitle.value,
      errorMessage: errorMessage.value,
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.input-container {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  z-index: 2;
  pointer-events: none;
}

.check-icon {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  z-index: 2;
}

.form-input {
  height: 56px !important;
  padding-left: 40px !important;
  padding-right: 40px !important;
  width: 100%;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  color: #111827;
  background-color: #fff;
}

.form-input:focus {
  outline: none !important;
  border-color: #1f45ff !important;
  border-width: 2px !important;
  box-shadow: 0 0 0 4px rgba(31, 69, 255, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

/* Estilo para o label flutuante */
.floating-label {
  position: absolute;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #161616;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  background-color: transparent;
  padding: 0;
  font-weight: normal;
  z-index: 5;
}

/* Estilo quando o input está em foco ou preenchido */
.form-input:focus ~ .floating-label,
.form-input:not(:placeholder-shown) ~ .floating-label {
  top: -1px;
  left: 15px;
  transform: translateY(0);
  font-size: 12px;
  font-weight: 600;
  color: #1f45ff;
  background-color: white;
  padding: 0 8px;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 20px;
}

/* Cores dos estados de erro */
.form-input.error {
  border-color: #ef4444 !important;
}

.form-input.error:focus {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
}

.text-red-500 {
  color: #ff7387 !important;
}

.btn-primary {
  width: 100%;
  height: 58px;
  font-size: 20px;
  background-color: #2563eb;
  color: white;
  border-radius: 12px;
  font-weight: 500;
  transition: background-color 0.2s;
  cursor: pointer;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

/* Estilo de erro para o label */
.form-input.error ~ .floating-label.text-red-500 {
  color: #ff7387 !important;
}
</style>
