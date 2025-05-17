<template>
  <div class="text-sm">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-base font-semibold">Detalles de Pago</h3>
      <span class="font-bold text-primary">Total: {{ formatCurrency(total, 'VES') }}</span>
    </div>

    <!-- Métodos -->
    <div class="grid gap-2">
      <PaymentMethodCompact
        v-for="(method, key) in paymentMethods"
        :key="key"
        v-model="paymentMethods[key]"
        :label="methodLabels[key]"
        :currency="methodCurrencies[key]"
        :dolar-rate="dolarRate"
        @input="calculateChange"
      />
    </div>

    <!-- Resumen -->
    <div class="rounded-lg bg-muted p-2 space-y-1">
      <div class="flex justify-between">
        <span>Pagado:</span>
        <span>{{ formatCurrency(totalPaid, 'VES') }}</span>
      </div>
      <div class="flex justify-between">
        <span>Restante:</span>
        <span>{{ formatCurrency(remaining, 'VES') }}</span>
      </div>
      <div class="flex justify-between font-semibold">
        <span>Vuelto:</span>
        <span>{{ formatCurrency(change, 'VES') }}</span>
      </div>
    </div>

    <BaseButton
      class="w-full h-9"
      :disabled="!isPaymentValid"
      @click="processPayment"
    >
      Confirmar Pago
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import PaymentMethodCompact from './methodCompact.vue'

const props = defineProps<{
  total: number
  dolarRate: number
}>()

const emit = defineEmits(['payment-processed'])

const paymentMethods = ref({
  cash: { enabled: false, amount: 0 },
  card: { enabled: false, amount: 0 },
  bioPago: { enabled: false, amount: 0 },
  usdCash: { enabled: false, amount: 0 } // pago en dólares
})

const methodLabels = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  bioPago: 'BioPago',
  usdCash: 'Dólares'
}

const methodCurrencies = {
  cash: 'VES',
  card: 'VES',
  bioPago: 'VES',
  usdCash: 'USD'
}

const totalPaid = computed(() => {
  return Object.entries(paymentMethods.value).reduce((acc, [key, method]) => {
    const isUSD = methodCurrencies[key] === 'USD'
    const amount = method.enabled ? Number(method.amount) : 0
    return acc + (isUSD ? amount * props.dolarRate : amount)
  }, 0)
})

const remaining = computed(() => props.total - totalPaid.value)
const change = computed(() => Math.max(totalPaid.value - props.total, 0))
const isPaymentValid = computed(() => totalPaid.value >= props.total)

const calculateChange = () => {
  Object.values(paymentMethods.value).forEach(method => {
    if (method.amount < 0) method.amount = 0
  })
}

const formatCurrency = (amount: number, currency: 'VES' | 'USD') =>
  new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency
  }).format(amount)

const resetAllInputs = () => {
  Object.values(paymentMethods.value).forEach(method => {
    method.amount = 0
    method.enabled = false
  })
}

const processPayment = () => {
  if (!isPaymentValid.value) return
  emit('payment-processed', {
    methods: paymentMethods.value,
    total: props.total,
    totalPaid: totalPaid.value,
    change: change.value
  })
  resetAllInputs()
}
</script>
