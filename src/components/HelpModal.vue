<template>
    <Teleport to="body">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
        @click.self="close"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-rover-secondary text-rover-grey p-6 rounded-xl max-w-md w-[90%] shadow-2xl border border-rover-blue-accent">
          <h2 class="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rover-turquoise to-rover-blue-accent mb-3 text-center">
            How to use the Mars Rover Control
          </h2>

          <p class="text-sm text-rover-grey mb-2">
            You’re the mission control! Send commands to a Mars rover and watch it navigate obstacles and terrain:
          </p>
  
          <ul class="text-sm list-disc pl-5 space-y-1 leading-relaxed">
            <li>Enter the starting <strong>X</strong> and <strong>Y</strong> coordinates (0–40).</li>
            <li>Select the direction: <code><strong>N</strong>orth</code>, <code><strong>E</strong>ast</code>, <code><strong>S</strong>outh</code>, or <code><strong>W</strong>est</code>.</li>
            <li>Send commands like <code>FFRFL</code>:
              <ul class="list-disc ml-4 mt-1">
                <li><code><strong>F</strong></code> = Move forward</li>
                <li><code><strong>L</strong></code> = Turn left</li>
                <li><code><strong>R</strong></code> = Turn right</li>
              </ul>
            </li>
            <li>The rover stops on boundary or obstacle.</li>
          </ul>
  
          <button
            @click="close"
            class="mt-6 w-full bg-rover-blue-accent text-white p-2 rounded hover:bg-rover-blue-active transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  const emit = defineEmits(['update:modelValue'])
  defineProps<{ modelValue: boolean }>()
  
  function close() {
    emit('update:modelValue', false)
  }
  </script>
  