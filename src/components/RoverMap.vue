<template>
  <div class="flex flex-col">
    <div 
    v-for="(row, rowIndex) in map.grid" 
    :key="rowIndex" 
    class="flex"
    >
      <div
        v-for="cell in row"
        :key="`${cell.x}-${cell.y}`"
        class="w-[10px] h-[10px] border border-gray-200"
        :class="{
          'bg-red-500': cell.hasRover
        }"
      >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { reactive, ref, watch } from 'vue'
import type { CommandInput } from '@/models/CommandInput'
import { MAX_MAP_VALUE } from '@/constants/map'
import { createEmptyMap } from '@/utils/mapFactory'

const props = defineProps<{
  commandInput: CommandInput | null
}>()

const rover = reactive<CommandInput>({
  x: 0,
  y: 0,
  direction: 'N',
  commands: ''
})

const map = ref(createEmptyMap(MAX_MAP_VALUE))

watch(
  () => props.commandInput,
  (newCommands) => {
    if (newCommands) {
      getNewCommands(newCommands)
      drawRoverPosition()
      moveRover()
    }
  }
)

function getNewCommands (newCommands: CommandInput) {
  rover.x = newCommands.x
  rover.y = newCommands.y
  rover.direction = newCommands.direction
  rover.commands = newCommands.commands
  console.log('Rover received new commands:', rover)
}

function moveRover() {
  let index = 0;

  function executeNextMove() {
    if (index < rover.commands.length) {
      const command = rover.commands[index];

      if (command === 'L' || command === 'R') {
        turnRover(command);
      }
      switch (rover.direction) {
        case 'N':
          rover.y -= 1;
          break;
        case 'S':
          rover.y += 1;
          break;
        case 'E':
          rover.x += 1;
          break;
        case 'W':
          rover.x -= 1;
          break;
      }

      drawRoverPosition();

      index++;

      setTimeout(executeNextMove, 500);
    }
  }

  executeNextMove();
}


function turnRover(direction: 'L' | 'R') {
  if (direction === 'L') {
    switch (rover.direction) {
      case 'N':
        rover.direction = 'W'
        break
      case 'S':
        rover.direction = 'E'
        break
      case 'E':
        rover.direction = 'N'
        break
      case 'W':
        rover.direction = 'S'
        break
    }
  } else if (direction === 'R') {
    switch (rover.direction) {
      case 'N':
        rover.direction = 'E'
        break
      case 'S':
        rover.direction = 'W'
        break
      case 'E':
        rover.direction = 'S'
        break
      case 'W':
        rover.direction = 'N'
        break
    }
  }
}

function drawRoverPosition() {
  map.value.grid.forEach ((row) => row.forEach((cell) => (cell.hasRover = false)))

  const cell = map.value.grid[rover.y]?.[rover.x]
  if (cell) {
    cell.hasRover = true
  }
  
}

</script>
