<template>
  <header class="bg-white shadow p-4 flex justify-between items-center text-black">
    <div class="flex items-center space-x-2">
      <span class="text-lg font-semibold">Caja #{{ cashierNumber.toString().padStart(3, '0') }}</span>
      <span class="text-gray-500">|</span>
      <span class="text-gray-600">Usuario: {{ username }}</span>
      <span class="text-gray-500">|</span>
      <span class="text-gray-600">Rol: {{ role }}</span>
      <span class="text-gray-500">|</span>
      <span class="text-gray-600">Fecha: {{ date }}</span>
      <span class="text-gray-500">|</span>
      <span class="text-gray-600">Hora: {{ time }}</span>
      <span class="text-gray-500">|</span>
      <span class="text-gray-600">Sucursal: {{ branch }}</span>
    </div>
    <div>
      <span class="bg-green-100 px-3 py-1 rounded-full text-sm">Sesión activa</span>
      <button class="ml-4 bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200">Cerrar Caja</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  cashierNumber?: number
  username?: string
  role?: string
  branch?: string
}

const props = withDefaults(defineProps<Props>(), {
  cashierNumber: 1,
  username: 'Admin',
  role: 'Gerente',
  branch: 'Viveres Milenium 2609, C.A'
})

const date = new Date().toLocaleDateString('es-VE', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

const time = ref(new Date().toLocaleTimeString())

let intervalId: number

onMounted(() => {
  intervalId = window.setInterval(() => {
    time.value = time.value = new Date().toLocaleTimeString()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

// Desestructuramos las props para usarlas directo en template
const { cashierNumber, username, role, branch } = props
</script>
