<template>
<div
  class="mb-4 px-4 py-2 rounded text-sm font-semibold transition-all duration-300 text-center bg-gray-900"
  :class="{
    'text-gray-400': roverStatus === 'waiting',
    'text-yellow-400 animate-pulse': roverStatus === 'executing',
    'text-green-400': roverStatus === 'success',
    'text-red-400 animate-shake': isErrorStatus
  }"
>
  {{ statusMessage }}
</div>
  <div class="flex flex-col">
    <div 
    v-for="(row, rowIndex) in map.grid" 
    :key="rowIndex" 
    class="flex"
    >
    <div
        v-for="cell in row"
        :key="`${cell.x}-${cell.y}`"
        class="w-[12px] h-[12px] border border-rover-secondary relative">
        <div v-if="cell.hasRover" :class="getRoverClass()"></div>
        <div v-if="cell.isObstacle" class="absolute inset-0 bg-rover-grey"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { reactive, ref, watch, computed } from 'vue'
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

const hasError = ref(false)
const isSuccess = ref(false)

const roverStatus = ref<
  'waiting' |
  'executing' |
  'success' |
  'errorAppearInObstacle' |
  'errorObstacle' |
  'errorLimits'
>('waiting')

const isErrorStatus = computed(() =>
  ['errorAppearInObstacle', 'errorObstacle', 'errorLimits'].includes(roverStatus.value)
)

const statusMessage = computed(() => {
  switch (roverStatus.value) {
    case 'executing': return 'Executing commands...'
    case 'success': return 'Mission accomplished!'
    case 'errorAppearInObstacle': return 'The rover is on an obstacle. Please enter a new position.'
    case 'errorLimits': return 'Execution aborted: The rover is out of bounds!'
    case 'errorObstacle': return 'Execution aborted: An obstacle is blocking the path!'
    default: return 'Waiting for new commands...'
  }
})

watch(
  () => props.commandInput,
  (newCommands) => {
    if (newCommands) {
      getNewCommands(newCommands)
      isSuccess.value = false
      hasError.value = false

      if(isObstacle(rover.x, rover.y)){
        roverStatus.value = 'errorAppearInObstacle'
        map.value.grid.forEach ((row) => row.forEach((cell) => (cell.hasRover = false)))
        return
      }

      roverStatus.value = 'executing'
      drawRoverPosition()
      setTimeout(moveRover, 500)
    }
  }
)

function getNewCommands (newCommands: CommandInput) {
  rover.x = newCommands.x
  rover.y = newCommands.y
  rover.direction = newCommands.direction
  rover.commands = newCommands.commands
}

function moveRover() {
  let index = 0

  function executeNextMove() {
    if (index < rover.commands.length) {
      const command = rover.commands[index];

      if (command === 'L' || command === 'R') {
        turnRover(command);
      }

      const currentX = rover.x
      const currentY = rover.y

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

      if (isOutOfLimits(rover.x, rover.y)) {

        rover.x = currentX
        rover.y = currentY
        roverStatus.value = 'errorLimits'
        hasError.value = true
        return
      }

      if (isObstacle(rover.x, rover.y)){
        rover.x = currentX
        rover.y = currentY
        roverStatus.value = 'errorObstacle'
        hasError.value = true
        return
      }

      hasError.value = false
      index++

      if(index === rover.commands.length){
        isSuccess.value = true
        roverStatus.value = 'success'
      }

      drawRoverPosition()
      setTimeout(executeNextMove, 500);
    }
  }

  executeNextMove()
}

function isOutOfLimits (x: number, y: number){
  return (x < 0 || x> MAX_MAP_VALUE || y < 0 || y > MAX_MAP_VALUE)
}

function isObstacle (x: number, y: number){
  const cell = map.value.grid[y]?.[x]
  return cell.isObstacle
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

function getRoverClass() {
  let baseClass = 'rover'

  if (hasError.value) {
    baseClass += ' error'
  }
  if (isSuccess.value) {
    baseClass += ' success'
  }

  switch (rover.direction) {
    case 'N':
      return baseClass + ' rotate-0'
    case 'S':
      return baseClass + ' rotate-180'
    case 'E':
      return baseClass + ' rotate-90'
    case 'W':
      return baseClass + ' rotate-270'
    default:
      return baseClass
  }
}

</script>

<style scoped>

.rover {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid rgb(255, 230, 0);
}

.rover.error {
  border-bottom: 10px solid rgb(255, 0, 43);
}

.rover.success {
  border-bottom: 10px solid rgb(102, 255, 0);
}

.rotate-0 {
  transform: rotate(0deg);
}

.rotate-90 {
  transform: rotate(90deg);
}

.rotate-180 {
  transform: rotate(180deg);
}

.rotate-270 {
  transform: rotate(270deg); 
}

</style>
