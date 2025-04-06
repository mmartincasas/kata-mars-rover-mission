<template>
  <div class="min-h-screen flex flex-col items-center space-y-4 p-6">
    <h1 class="p-4 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rover-turquoise to-rover-blue-accent flex items-center gap-2">
      <span class="text-white">🛰️</span>
      <span>Welcome to Rover Control System</span>
    </h1>
    <RoverConsole @submit="handleCommandInput" />
    <RoverMap :commandInput="commandInput" />
  </div>
</template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import RoverConsole from '@/components/RoverControl.vue'
  import RoverMap from '@/components/RoverMap.vue';
  import type { CommandInput } from '@/models/CommandInput';

  const commandInput = ref<CommandInput | null>(null)

  function handleCommandInput (data: CommandInput) {
    commandInput.value = data
  }

  </script>
  