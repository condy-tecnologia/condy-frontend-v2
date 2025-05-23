<template>
  <div class="flex flex-col h-screen bg-[#EDF0FB]">
    <Header />

    <div class="flex flex-col flex-grow w-full max-w-6xl mx-auto overflow-hidden">

      <div class="flex-grow p-4 space-y-4 overflow-y-auto" ref="chatAreaContainer">
        <MessageBubble
          v-for="message in messages"
          :key="message.id"
          :text="message.text"
          :is-user="message.isUser" 
        />
      </div>

      <div class="px-4 sm:px-5 md:px-6 pb-4 pt-2">
        <InputArea
          @send-message="handleSendMessage"
          :disabled="isBotTyping"
        />
      </div>
    </div>
  </div>
</template>
  
<script setup>
import InputArea from '@/components/auth/InputArea.vue';
import MessageBubble from '@/components/auth/MessageBubble.vue';
import Header from '@/components/Header.vue';
import { useAuthStore } from '@/stores/auth';
import { sanitizeInput, validateCNPJ } from '@/utils/security';
import { nextTick, ref } from 'vue';

const authStore = useAuthStore();
const messages = ref([]);
const isBotTyping = ref(false);
let messageIdCounter = 0;

// Lógica inicial do bot (exemplo)
const addBotMessage = (text) => {
  isBotTyping.value = true;
  setTimeout(() => {
    messages.value.push({
      id: messageIdCounter++,
      text,
      isUser: false,
    });
    isBotTyping.value = false;
    scrollToBottom();
  }, 1000); // Simula o "digitando" do bot
};

const addUserMessage = (text) => {
  messages.value.push({
    id: messageIdCounter++,
    text,
    isUser: true,
  });
  scrollToBottom();
};

const scrollToBottom = () => {
  nextTick(() => {
    const chatArea = document.querySelector('.overflow-y-auto');
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  });
};

// Estado do fluxo de cadastro
const registrationStep = ref('initial');
const registrationData = ref({
  cnpj: '',
  companyName: '',
  adminName: '',
  email: '',
  phone: '',
  password: '',
});

const handleSendMessage = (text) => {
  // Sanitiza o input do usuário
  const sanitizedText = sanitizeInput(text);
  addUserMessage(sanitizedText);
  processUserMessage(sanitizedText);
};

const processUserMessage = async (userInput) => {
  try {
    switch (registrationStep.value) {
      case 'initial':
        if (userInput.toLowerCase().includes('sim') || userInput.toLowerCase().includes('cadastro')) {
          addBotMessage("Ótimo! Para iniciarmos seu cadastro, por favor, informe o CNPJ da sua empresa (apenas números).");
          registrationStep.value = 'awaiting_cnpj';
        } else {
          addBotMessage("Tudo bem! Quando quiser fazer o cadastro, é só me avisar. Digite 'sim' para começar.");
        }
        break;
        
      case 'awaiting_cnpj':
        const cleanCNPJ = userInput.replace(/[^\d]/g, '');
        if (validateCNPJ(cleanCNPJ)) {
          registrationData.value.cnpj = cleanCNPJ;
          addBotMessage(`CNPJ ${formatCNPJ(cleanCNPJ)} validado com sucesso! Agora, qual o nome da sua empresa?`);
          registrationStep.value = 'awaiting_company_name';
        } else {
          addBotMessage("CNPJ inválido. Por favor, verifique e digite novamente apenas os números do CNPJ.");
        }
        break;
        
      case 'awaiting_company_name':
        if (userInput.length >= 2) {
          registrationData.value.companyName = userInput;
          addBotMessage(`Empresa "${userInput}" registrada! Agora preciso do nome do administrador/síndico.`);
          registrationStep.value = 'awaiting_admin_name';
        } else {
          addBotMessage("Nome da empresa muito curto. Por favor, informe o nome completo da empresa.");
        }
        break;
        
      case 'awaiting_admin_name':
        if (userInput.length >= 2) {
          registrationData.value.adminName = userInput;
          addBotMessage(`Perfeito, ${userInput}! Agora preciso do seu email para contato.`);
          registrationStep.value = 'awaiting_email';
        } else {
          addBotMessage("Nome muito curto. Por favor, informe seu nome completo.");
        }
        break;
        
      case 'awaiting_email':
        if (isValidEmail(userInput)) {
          registrationData.value.email = userInput.toLowerCase();
          addBotMessage("Email válido! Agora informe um telefone para contato.");
          registrationStep.value = 'awaiting_phone';
        } else {
          addBotMessage("Email inválido. Por favor, digite um email válido (exemplo: usuario@empresa.com.br).");
        }
        break;
        
      case 'awaiting_phone':
        const cleanPhone = userInput.replace(/[^\d]/g, '');
        if (cleanPhone.length >= 10) {
          registrationData.value.phone = cleanPhone;
          addBotMessage("Telefone registrado! Por último, crie uma senha segura (mínimo 8 caracteres).");
          registrationStep.value = 'awaiting_password';
        } else {
          addBotMessage("Telefone inválido. Digite um número válido com DDD.");
        }
        break;
        
      case 'awaiting_password':
        if (isValidPassword(userInput)) {
          registrationData.value.password = userInput;
          addBotMessage("Senha segura criada! Finalizando seu cadastro...");
          await finishRegistration();
        } else {
          addBotMessage("Senha deve ter pelo menos 8 caracteres, incluindo letras e números. Tente novamente.");
        }
        break;
    }
  } catch (error) {
    console.error('Erro no processamento:', error);
    addBotMessage("Ocorreu um erro. Por favor, tente novamente.");
  }
};

const finishRegistration = async () => {
  try {
    isBotTyping.value = true;
    
    await authStore.signUp({
      name: registrationData.value.adminName,
      email: registrationData.value.email,
      password: registrationData.value.password,
      role: 'sindico'
    });
    
    addBotMessage("🎉 Cadastro realizado com sucesso! Você será redirecionado para o dashboard.");
    
    // Reset do formulário
    registrationData.value = {
      cnpj: '',
      companyName: '',
      adminName: '',
      email: '',
      phone: '',
      password: '',
    };
    
  } catch (error) {
    addBotMessage(`Erro no cadastro: ${error.message}. Vamos tentar novamente?`);
    registrationStep.value = 'awaiting_email'; // Volta para email
  } finally {
    isBotTyping.value = false;
  }
};

const formatCNPJ = (cnpj) => {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
};

// Mensagem inicial do bot
addBotMessage("👋 Bem-vindo ao Condy! Sou seu assistente para cadastro de síndicos. Gostaria de iniciar um novo cadastro? (Digite 'sim' para começar)");
</script>