<template>
  <form @submit.prevent="onSubmit" 
  class="p-6 bg-rover-secondary text-rover-grey rounded space-y-4 shadow-md">

  <div class="flex flex-row flex-wrap gap-4">
  <div class="flex-1 min-w-[70px]">
    <label for="x">X: </label>
    <input id="x" type="number" v-model.number="roverControlForm.x" class="w-full p-1 border rounded text-rover-secondary" />
    <p v-if="submitted && v$.x.$error" class="text-rover-error text-sm">
      {{ v$.x.$errors[0]?.$message || 'X is invalid' }}
    </p>
  </div>

  <div class="flex-1 min-w-[70px]">
    <label for="y">Y: </label>
    <input id="y" type="number" v-model.number="roverControlForm.y" class="w-full p-1 border rounded text-rover-secondary" />
    <p v-if="submitted && v$.y.$error" class="text-rover-error text-sm">
      {{ v$.y.$errors[0]?.$message || 'Y is invalid' }}
    </p>
  </div>

  <div class="flex-1 min-w-[100px]">
    <label for="direction">Direction: </label>
    <select id="direction" v-model="roverControlForm.direction" class="w-full p-1 border rounded text-rover-secondary">
      <option value="N">North</option>
      <option value="E">East</option>
      <option value="S">South</option>
      <option value="W">West</option>
    </select>
  </div>
</div>

    <div class="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4">
      <div class="flex-1">
        <label for="commands">Commands: </label>
        <input
          id="commands"
          type="text"
          v-model="roverControlForm.commands"
          @input="roverControlForm.commands = roverControlForm.commands.toUpperCase()"
          class="p-1 border rounded text-rover-secondary"
          placeholder="E.g. FFRRFFRL"
        />
        <p v-if="submitted && v$.commands.$error" class="text-rover-error text-sm">
          {{ v$.commands.$errors[0]?.$message || 'Commands is invalid' }}
        </p>
      </div>

      <button 
        type="submit" 
        :disabled="props.roverStatus == 'executing'"
        class="p-2 bg-rover-blue-accent text-white rounded hover:bg-rover-blue-active
        disabled:opacity-50 disabled:hover:bg-rover-blue-accent w-full md:w-auto">
        Send Commands
      </button>
    </div>
  </form>
</template>

  
<script lang="ts" setup>

  import { ref, reactive } from 'vue'
  import type { CommandInput } from '@/models/CommandInput'
  import type { RoverStatus } from '@/models/RoverStatus'
  import useVuelidate from '@vuelidate/core'
  import { required, numeric, helpers, minValue, maxValue, maxLength } from '@vuelidate/validators'
  import { MIN_MAP_VALUE, MAX_MAP_VALUE, MAX_COMMANDS_LENGTH, VALID_COMMANDS_REGEX} from '@/constants/map'

  const props = defineProps<{
    roverStatus: RoverStatus
  }>()
  
  const submitted = ref(false)

  const roverControlForm = reactive<CommandInput>({
    x: 0,
    y: 0,
    direction: 'N',
    commands: ''
  })

  const validationRules = {
    x: {required, 
        minValue: minValue(MIN_MAP_VALUE),
        maxValue: maxValue(MAX_MAP_VALUE),
        numeric},
    y: {required, 
        minValue: minValue(MIN_MAP_VALUE),
        maxValue: maxValue(MAX_MAP_VALUE),
        numeric},
    commands: {
      required,
      maxLength: maxLength(MAX_COMMANDS_LENGTH),
      validCommands: helpers.withMessage(
        'Only F, L, R characters are allowed',
        (value: string) => VALID_COMMANDS_REGEX.test(value || '')
      )
    }
  }

  const v$ = useVuelidate(validationRules, roverControlForm)

  const emit = defineEmits<{
    (e: 'submit', payload: CommandInput): void
  }>()

  const onSubmit = async () => {
    submitted.value = true
    const isValid = await v$.value.$validate()
    if (isValid) {
      emit('submit', { ...roverControlForm })
    } 
  }

</script>