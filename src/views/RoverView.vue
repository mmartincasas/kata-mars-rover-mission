<template>
  <div class="min-h-screen flex flex-col items-center space-y-4 p-6 relative">

    <h1 class="p-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rover-turquoise to-rover-blue-accent flex items-center gap-2">
        <span class="text-white">🛰️</span>
        <span>Welcome to Rover Control System</span>
        <div class="relative group ml-2">
          <button @click="showHelp = true"
            class="w-6 h-6 rounded-full flex items-center justify-center hover:bg-rover-blue-active transition-colors duration-200 focus:outline-none"
            aria-label="Help">
            <img src="/img/info.svg" alt="Info" class="w-4 h-4"/>
          </button>
          <span
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-black bg-opacity-80 rounded opacity-0 group-hover:opacity-100 
            transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Help
          </span>
        </div>
    </h1>

    <RoverConsole 
      @submit="handleCommandInput" 
      :roverStatus="roverStatus"/>
    <RoverMap 
      :commandInput="commandInput"
      @status-change="roverStatus = $event"/>

    <HelpModal v-model="showHelp"/>

  </div>
</template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import RoverConsole from '@/components/RoverControl.vue'
  import RoverMap from '@/components/RoverMap.vue'
  import HelpModal from '@/components/HelpModal.vue'
  import type { CommandInput } from '@/models/CommandInput'
  import type { RoverStatus } from '@/models/RoverStatus'

  const commandInput = ref<CommandInput | null>(null)

  const roverStatus = ref<RoverStatus>('waiting')

const showHelp = ref(false)

onMounted(() => {
  setTimeout(() => {
    showHelp.value = true
  }, 1000)
})
  function handleCommandInput (data: CommandInput) {
    commandInput.value = data
  }

  </script>
  