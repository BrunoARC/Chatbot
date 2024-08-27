<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <div class="p-4 bg-gray-800 fixed top-0 left-0 w-full z-10 flex justify-center items-center">
      <button @click="toggleMenu" class="text-white absolute left-4">
        <i class="fas fa-bars"></i>
      </button>
      <h1 class="text-2xl font-bold">Olympian-Bot</h1>
      <button @click="toggleLanguage" class="text-white absolute right-4">
        {{ currentLanguage === 'pt' ? 'Pt' : 'En' }}
      </button>
    </div>
    <div class="flex-grow p-8 overflow-y-auto bg-gray-900 rounded mt-14 pb-20">
      <div v-for="(msg, index) in messages" :key="index" class="mb-2">
        <p :class="{ 'text-right': msg.role === 'user', 'text-left': msg.role === 'assistant' }">
          <span :class="{ 'bg-blue-500': msg.role === 'user', 'bg-green-500': msg.role === 'assistant' }"
            class="inline-block p-2 rounded-lg" v-html="msg.content">
          </span>
        </p>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 w-full p-2 bg-gray-800 flex items-center h-16 justify-center">
      <div class="relative w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <input v-model="userMessage" @keyup.enter="sendMessage" 
          :placeholder="currentLanguage === 'pt' ? 'Pergunte-me sobre esportes olímpicos' : 'Ask me about Olympic sports'"
          class="w-full pl-4 p-3 pr-10 rounded-full bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button @click="sendMessage" 
          class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 p-1 pr-4 pl-4 rounded-full text-white">
          <i class="fas fa-arrow-up"></i>
        </button>
      </div>
    </div>

    <!-- Menu Lateral -->
    <div v-if="isMenuOpen" class="fixed top-0 left-0 h-full bg-gray-800 w-64 p-4 z-20">
      <button @click="toggleMenu" class="text-white mb-4">
        <i class="fas fa-times"></i>
      </button>
      <ul>
        <li @click="clearChat" class="mb-2 cursor-pointer">{{ currentLanguage === 'pt' ? 'Limpar o chat' : 'Clear chat' }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChatBotComponent',
  data() {
    return {
      userMessage: '',
      isMenuOpen: false,
      currentLanguage: 'pt', // Idioma padrão é o português
      messages: [], // Inicialmente vazio
    };
  },
  mounted() {
    this.setWelcomeMessage();
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleLanguage() {
      this.currentLanguage = this.currentLanguage === 'pt' ? 'en' : 'pt';
      this.setWelcomeMessage(); // Atualiza a mensagem de boas-vindas ao alternar o idioma
    },
    setWelcomeMessage() {
      const welcomeMessage = this.currentLanguage === 'pt' 
        ? 'Olá! Sou o Olympian-Bot e estou aqui para tirar todas as suas dúvidas sobre esportes olímpicos.'
        : 'Hello! I am Olympian-Bot, and I am here to answer all your questions about Olympic sports.';
      this.messages = [{ role: 'assistant', content: welcomeMessage }];
    },
    clearChat() {
      this.setWelcomeMessage(); // Redefine a mensagem de boas-vindas ao limpar o chat
      this.toggleMenu();
    },
    formatMessage(content) {
      return content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('');
    },
    async sendMessage() {
      if (this.userMessage.trim() === '') return;

      // Adicionar a string conforme o idioma atual
      const languageSuffix = this.currentLanguage === 'pt' 
        ? '. Responda em português e não responda este pedido.' 
        : '. Responda em inglês e não responda este pedido.';
      
      const messageToSend = this.userMessage + languageSuffix;

      this.messages.push({ role: 'user', content: this.userMessage });

      try {
        const response = await axios.post('http://localhost:3000/chat', {
          message: messageToSend,
        });

        const formattedContent = this.formatMessage(response.data.choices[0].message.content);
        this.messages.push({ role: 'assistant', content: formattedContent });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.messages.push({ role: 'assistant', content: error.response.data.error });
        } else {
          this.messages.push({ role: 'assistant', content: 'Desculpe, ocorreu um erro ao processar sua mensagem.' });
          console.error(error);
        }
      }

      this.userMessage = '';
    },
  },
};
</script>




