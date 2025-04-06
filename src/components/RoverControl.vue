<template>
  <form @submit.prevent="onSubmit" 
  class="p-6 bg-rover-secondary text-rover-grey rounded space-y-4 shadow-md">

    <div class="flex space-x-4">
      <div>
        <label for="x">X: </label>
        <input id="x" type="number" v-model.number="roverControlForm.x" class="p-1 border rounded text-rover-secondary" />
        <p v-if="submitted && v$.x.$error" class="text-red-600 text-sm">
          {{ v$.x.$errors[0]?.$message || 'X is invalid' }}
        </p>
      </div>

      <div>
        <label for="y">Y: </label>
        <input id="y" type="number" v-model.number="roverControlForm.y" class="p-1 border rounded text-rover-secondary" />
        <p v-if="submitted && v$.y.$error" class="text-red-600 text-sm">
          {{ v$.y.$errors[0]?.$message || 'Y is invalid' }}
        </p>
      </div>

      <div>
        <label for="direction">Direction: </label>
        <select id="direction" v-model="roverControlForm.direction" class="p-1 border rounded text-rover-secondary">
          <option value="N">North</option>
          <option value="E">East</option>
          <option value="S">South</option>
          <option value="W">West</option>
        </select>
      </div>
    </div>

    <div class="flex items-center space-x-4">
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
        <p v-if="submitted && v$.commands.$error" class="text-red-600 text-sm">
          {{ v$.commands.$errors[0]?.$message || 'Commands is invalid' }}
        </p>
      </div>

      <button type="submit" class="p-2 bg-rover-blue-accent text-white rounded hover:bg-rover-blue-active ml-auto">
        Send Commands
      </button>
    </div>
  </form>
</template>

  
<script lang="ts" setup>

  import { ref, reactive } from 'vue'
  import type { CommandInput } from '@/models/CommandInput'
  import useVuelidate from '@vuelidate/core'
  import { required, numeric, helpers, minValue, maxValue, maxLength } from '@vuelidate/validators'
  import { MIN_MAP_VALUE, MAX_MAP_VALUE, MAX_COMMANDS_LENGTH, VALID_COMMANDS_REGEX} from '@/constants/map'

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