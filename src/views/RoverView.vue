<template>
    <div class="space-y-4 p-6">
      <RoverConsole @submit="handleCommandInput"/>
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
  