<template>
  <div class="space-y-1 border rounded-lg p-2">
    <label class="flex items-center justify-between gap-2 text-sm">
      <span>{{ label }}</span>
      <input type="checkbox" v-model="modelValue.enabled" class="checkbox" />
    </label>

    <div v-if="modelValue.enabled" class="grid gap-1">
      <BaseInput
        v-model="modelValue.amount"
        type="number"
        class="h-8 text-sm"
        :placeholder="`Monto ${label}`"
        @input="$emit('input')"
      />

      <!-- Si es pago en dólares, mostrar equivalente -->
      <div
        v-if="currency === 'USD' && modelValue.amount"
        class="text-xs text-muted"
      >
        ≈ {{ formatCurrency(modelValue.amount * dolarRate, 'VES') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  modelValue: number
  label: string
  currency?: string
  dolarRate?: number
}>(), {
  currency: 'VES',
  dolarRate: 40 // tasa por defecto
})

const emit = defineEmits(['update:modelValue', 'input'])

const formatCurrency = (amount: number, currency: 'VES' | 'USD') =>
  new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency
  }).format(amount)
</script>
