<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'usuario', // 'usuario' ou 'sindico'
})

function submit() {
  auth.signUp({ ...form })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crie sua conta
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="submit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Nome</label>
            <input v-model="form.name" id="name" name="name" type="text" required placeholder="Nome completo" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm" />
          </div>
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <input v-model="form.email" id="email-address" name="email" type="email" autocomplete="email" required placeholder="Email" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm" />
          </div>
          <div>
            <label for="password" class="sr-only">Senha</label>
            <input v-model="form.password" id="password" name="password" type="password" autocomplete="current-password" required placeholder="Senha" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm" />
          </div>
          <div class="pt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de conta</label>
            <select v-model="form.role" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md">
              <option value="usuario">Usuário</option>
              <option value="sindico">Síndico</option>
            </select>
          </div>
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            Criar conta
          </button>
        </div>
        <p class="text-center text-sm">
          Já tem conta?
          <router-link to="/sign-in" class="font-medium text-emerald-600 hover:text-emerald-500">Entrar</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style> 