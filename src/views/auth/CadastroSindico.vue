<template>
    <div class="flex flex-col h-screen bg-[#EDF0FB]">
      <Header />
  
      <div class="flex-grow p-4 space-y-4 overflow-y-auto">
        <MessageBubble
          v-for="message in messages"
          :key="message.id"
          :text="message.text"
          :is-user="message.isUser"
          :timestamp="message.timestamp"
        />
      </div>
  
      <InputArea @send-message="handleSendMessage" :disabled="isBotTyping" />
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue';
  import MessageBubble from '@/components/auth/MessageBubble.vue';
  import InputArea from '@/components/auth/InputArea.vue';
  import Header from '@/components/Header.vue';

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
        timestamp: new Date().toLocaleTimeString()
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
      timestamp: new Date().toLocaleTimeString()
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
  const registrationStep = ref('initial'); // initial, awaiting_cnpj, validating_cnpj, etc.
  const registrationData = ref({
    cnpj: '',
    companyName: '',
    // outros campos
  });
  
  const handleSendMessage = (text) => {
    addUserMessage(text);
    processUserMessage(text);
  };
  
  const processUserMessage = (userInput) => {
    // Aqui entra a lógica do chatbot baseada no registrationStep e userInput
    // Exemplo simplificado:
    if (registrationStep.value === 'initial') {
      addBotMessage("Olá! Para iniciarmos seu cadastro, por favor, informe o CNPJ da sua empresa.");
      registrationStep.value = 'awaiting_cnpj';
    } else if (registrationStep.value === 'awaiting_cnpj') {
      registrationData.value.cnpj = userInput;
      // Simulação de validação
      isBotTyping.value = true;
      setTimeout(() => {
        if (isValidCNPJ(userInput)) { // Implementar isValidCNPJ
          addBotMessage(`CNPJ ${userInput} recebido. Agora, qual o nome da empresa?`);
          registrationStep.value = 'awaiting_company_name';
        } else {
          addBotMessage("CNPJ inválido. Por favor, tente novamente.");
        }
        isBotTyping.value = false;
      }, 1500);
    }
    // ... outras etapas do fluxo
  };
  
  const isValidCNPJ = (cnpj) => {
    // Lógica de validação de CNPJ (pode ser uma regex simples ou mais complexa)
    // Exemplo muito básico:
    return cnpj && cnpj.length === 14 && /^\d+$/.test(cnpj);
  };
  
  // Mensagem inicial do bot
  addBotMessage("Bem-vindo ao nosso assistente de cadastro! Gostaria de iniciar um novo cadastro?");
  // Poderia ter botões de Sim/Não aqui, e o fluxo começaria com a resposta.
  // Para simplificar, vamos direto ao pedido do CNPJ após uma mensagem inicial.
  // addBotMessage("Olá! Para iniciarmos seu cadastro, por favor, informe o CNPJ da sua empresa.");
  // registrationStep.value = 'awaiting_cnpj'; // Ajustar conforme a interação inicial desejada
  
  </script>