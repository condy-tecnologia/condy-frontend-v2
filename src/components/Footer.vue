<template>
  <!-- Footer -->
  <footer class="bg-blue-600 py-8 text-white">
    <div class="container mx-auto px-4">
      <div
        class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
      >
        <img :src="logo" alt="Condy" class="h-8 md:h-10 text-white" />

        <div class="flex items-center space-x-4">
          <span class="text-sm text-white">Incubado por</span>
          <img :src="incubadoraLogo" alt="Incubadora" class="h-8" />

          <span class="text-sm text-white ml-4">Acelerado por</span>
          <img :src="aceleradoraLogo" alt="Aceleradora" class="h-8" />
        </div>
      </div>

      <div class="mt-6 text-center md:text-left text-sm text-white/80">
        Condy Tecnologia LTDA © {{ new Date().getFullYear() }} · Todos os
        direitos reservados · CNPJ 60.185.344/0001-44
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logo from '@/assets/horizontal_logo_white.svg';
import aceleradoraLogo from '@/assets/imgs/logo_aceleradora.png';
import incubadoraLogo from '@/assets/svg/incubadora_logo.svg';
</script>
