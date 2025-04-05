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
        class="w-[12px] h-[12px] border border-gray-200 relative">
        <div v-if="cell.hasRover" :class="getRoverClass()"></div>
        <div v-if="cell.isObstacle" class="absolute inset-0 bg-gray-500"></div>
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

const hasError = ref(false)
const isSuccess = ref(false)

watch(
  () => props.commandInput,
  (newCommands) => {
    if (newCommands) {
      getNewCommands(newCommands)
      isSuccess.value = false
      hasError.value = false

      if(isObstacle(rover.x, rover.y)){
        console.warn('The rover is on an obstacle. Enter a new position.')
        map.value.grid.forEach ((row) => row.forEach((cell) => (cell.hasRover = false)))
        return
      }

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
  console.log('Rover received new commands:', rover)
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
        console.warn('Rover is out of the limit! Staying in the last valid position.')
        hasError.value = true
        return
      }

      if (isObstacle(rover.x, rover.y)){
        rover.x = currentX
        rover.y = currentY
        console.warn('Obstacle ahead! Sequence stopped.')
        hasError.value = true
        return
      }

      hasError.value = false
      index++

      if(index === rover.commands.length){
        isSuccess.value = true
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
  console.log(cell)
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
