<template>
  <dialog
    ref="dialogRef"
    class="modal"
    :class="{ 'modal-open': isOpen }"
    @close="handleClose"
  >
    <div class="modal-box">
      <!-- Header -->
      <div class="modal-header">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          @click="closeModal"
        >
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <slot></slot>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <slot name="footer">
          <div class="modal-action">
            <button class="btn" @click="closeModal">Close</button>
          </div>
        </slot>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const isOpen = ref(false)

const openModal = () => {
  if (dialogRef.value) {
    dialogRef.value.showModal()
    isOpen.value = true
  }
}

const closeModal = () => {
  if (dialogRef.value) {
    dialogRef.value.close()
    isOpen.value = false
    emit('update:modelValue', false)
  }
}

const handleClose = () => {
  isOpen.value = false
  emit('update:modelValue', false)
}

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    openModal()
  } else {
    closeModal()
  }
})

// Close modal on escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
  if (props.modelValue) {
    openModal()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.modal {
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  padding: 0;
}

.modal::backdrop {
  background: rgba(0, 0, 0, 0.5);
}
.modal-box {
  position: relative;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  padding: 1.5rem;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
}

.modal-header {
  margin-bottom: 1rem;
  position: relative;
}

.modal-content {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.modal-footer {
  margin-top: 1rem;
}

.modal-action {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.modal-open {
  display: block;
}
</style>