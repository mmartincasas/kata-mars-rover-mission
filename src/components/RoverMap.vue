<template>
    <div class="p-4 bg-gray-100 text-gray-800 rounded">
      RoverMap component works!
    </div>
  </template>
  
<script lang="ts" setup>

  import { watch } from 'vue'
  import type { CommandInput } from '@/models/CommandInput'
  //import { MIN_MAP_VALUE, MAX_MAP_VALUE} from '@/constants/map'

  const props = defineProps<{
    commandInput: CommandInput | null
  }>()

  watch(
  () => props.commandInput,
  (newCommands) => {
    if (newCommands) {
      console.log('RoverMap received new commands:', newCommands)
    }
  }
)

</script>