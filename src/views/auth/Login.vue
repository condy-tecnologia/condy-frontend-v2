<template>
  <div class="flex flex-col min-h-screen">
    <Head>
      <Title>Condy - Login</Title>
      <Meta
        name="description"
        content="Acesse sua conta Condy para gerenciar seus condomínios de forma simples e inteligente."
      />
    </Head>

    <div class="flex flex-grow w-full overflow-auto">
      <div class="w-full lg:w-1/2 bg-white flex flex-col m-20">
        <header class="flex justify-start pt-8 sm:pt-10 px-6 sm:px-8">
          <img
            src="@/assets/horizontal_logo.svg"
            alt="Condy"
            class="h-8 md:h-10"
          />
        </header>

        <main
          class="flex flex-col items-start justify-center flex-grow px-6 sm:px-8 py-10"
        >
          <div class="w-full max-w-md">
            <div class="text-center mb-8">
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Bem-vindo à Condy, sua nova central de gestão condominial.
              </h1>
              <p class="text-gray-600">
                Gerencie chamados, acompanhe serviços e facilite a rotina do seu
                condomínio.
              </p>
            </div>

            <LoginForm @showError="handleShowError" />

            <div
              class="mt-8 p-4 bg-green-50 rounded-xl border border-green-200"
            >
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <img
                    src="@/assets/svg/whatsapp_icon.svg"
                    alt="WhatsApp"
                    class="w-6 h-6"
                  />
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-800">
                    Esqueceu sua senha ou email de cadastro?
                  </p>
                  <p class="text-sm text-gray-600">
                    Fale com a gente pelo WhatsApp
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <button
                    class="text-green-600 hover:text-green-700 focus:outline-none"
                  >
                    <img
                      src="@/assets/svg/arrow_right.svg"
                      alt="Seta para direita"
                      class="w-7 h-7"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div class="hidden lg:flex lg:w-1/2 relative">
        <img
          src="@/assets/imgs/imagem_fundo.png"
          alt="Ambiente moderno de condomínio"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <Footer />

    <div
      v-if="showError"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
    >
      <div class="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <div class="text-center">
          <img
            src="@/assets/horizontal_logo.svg"
            alt="Condy"
            class="h-8 mx-auto mb-6"
          />

          <div class="mb-6">
            <div
              class="w-16 h-16 mx-auto flex items-center justify-center bg-red-100 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {{ errorTitle }}
          </h2>
          <p class="text-gray-600 mb-6">{{ errorMessage }}</p>

          <div
            class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3"
          >
            <button
              @click="showError = false"
              class="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Fechar
            </button>
            <button
              @click="showError = false"
              class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import { ref } from 'vue';

const showError = ref(false);
const errorTitle = ref('');
const errorMessage = ref('');

const handleShowError = error => {
  showError.value = true;
  errorTitle.value = error.errorTitle;
  errorMessage.value = error.errorMessage;
};
</script>
