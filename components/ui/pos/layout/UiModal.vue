<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @keydown.esc.window="closeModal"
    tabindex="0"
  >
    <div
      class="relative w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl transition-all transform sm:scale-100 scale-95"
      role="dialog"
      aria-modal="true"
    >
      <!-- Botón de cierre -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Cerrar modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
            stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Contenido del modal -->
      <div class="p-2 text-gray-800">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['modal:close'])

const closeModal = () => {
  emit('modal:close')
}
</script>
