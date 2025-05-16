<template>
  <div class="p-4 space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold">Payment Details</h3>
      <div class="text-xl font-bold">Total: {{ formatCurrency(total) }}</div>
    </div>

    <div class="grid gap-4">
      <!-- Cash Payment -->
      <div class="payment-method">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="paymentMethods.cash.enabled" class="checkbox">
          <span>Cash</span>
        </label>
        <div v-if="paymentMethods.cash.enabled" class="mt-2">
          <BaseInput
            v-model="paymentMethods.cash.amount"
            type="number"
            placeholder="Enter cash amount"
            @input="calculateChange"
          />
        </div>
      </div>

      <!-- Card Payment -->
      <div class="payment-method">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="paymentMethods.card.enabled" class="checkbox">
          <span>Card</span>
        </label>
        <div v-if="paymentMethods.card.enabled" class="mt-2">
          <BaseInput
            v-model="paymentMethods.card.amount"
            type="number"
            placeholder="Enter card amount"
            @input="calculateChange"
          />
        </div>
      </div>

      <!-- BioPago -->
      <div class="payment-method">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="paymentMethods.bioPago.enabled" class="checkbox">
          <span>BioPago</span>
        </label>
        <div v-if="paymentMethods.bioPago.enabled" class="mt-2">
          <BaseInput
            v-model="paymentMethods.bioPago.amount"
            type="number"
            placeholder="Enter BioPago amount"
            @input="calculateChange"
          />
        </div>
      </div>
    </div>

    <!-- Payment Summary -->
    <div class="mt-4 p-4 bg-gray-100 rounded-lg">
      <div class="space-y-2">
        <div class="flex justify-between">
          <span>Total Paid:</span>
          <span>{{ formatCurrency(totalPaid) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Remaining:</span>
          <span>{{ formatCurrency(remaining) }}</span>
        </div>
        <div class="flex justify-between font-bold">
          <span>Change:</span>
          <span>{{ formatCurrency(change) }}</span>
        </div>
      </div>
    </div>

    <BaseButton 
      :disabled="!isPaymentValid" 
      @click="processPayment"
      class="w-full"
    >
      Process Payment
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const props = defineProps<{
  total: number
}>()

const emit = defineEmits(['payment-processed'])

const paymentMethods = ref({
  cash: {
    enabled: false,
    amount: 0
  },
  card: {
    enabled: false,
    amount: 0
  },
  bioPago: {
    enabled: false,
    amount: 0
  }
})

const totalPaid = computed(() => {
  return Object.values(paymentMethods.value).reduce((acc, method) => {
    return acc + (method.enabled ? Number(method.amount) : 0)
  }, 0)
})

const remaining = computed(() => {
  return props.total - totalPaid.value
})

const change = computed(() => {
  return totalPaid.value > props.total ? totalPaid.value - props.total : 0
})

const isPaymentValid = computed(() => {
  return totalPaid.value >= props.total
})

const calculateChange = () => {
  // Ensure amounts are valid numbers
  Object.values(paymentMethods.value).forEach(method => {
    if (method.amount < 0) method.amount = 0
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES'
  }).format(amount)
}

const processPayment = () => {
  if (!isPaymentValid.value) return

  const paymentDetails = {
    methods: paymentMethods.value,
    total: props.total,
    totalPaid: totalPaid.value,
    change: change.value
  }

  emit('payment-processed', paymentDetails)
}
</script>

<style scoped>
.payment-method {
  padding: 1rem;
  border: 1px solid;
  border-radius: 0.5rem;
}
</style>