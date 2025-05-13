<template>
  <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg print:shadow-none">
    <!-- Header Section -->
    <div class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your Business Name</h2>
      <p class="text-gray-600 dark:text-gray-300 text-sm">123 Business Address</p>
      <p class="text-gray-600 dark:text-gray-300 text-sm">Phone: (555) 123-4567</p>
    </div>

    <!-- Receipt Details -->
    <div class="mb-6">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-600 dark:text-gray-300">Date:</span>
        <span class="text-gray-800 dark:text-white">{{ receiptDate }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-300">Receipt #:</span>
        <span class="text-gray-800 dark:text-white">{{ receiptNumber }}</span>
      </div>
    </div>

    <!-- Items List -->
    <div class="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
      <div v-for="(item, index) in items" :key="index" class="flex justify-between mb-3">
        <div>
          <span class="text-gray-800 dark:text-white">{{ item.name }}</span>
          <span class="text-gray-600 dark:text-gray-300 text-sm block">x{{ item.quantity }}</span>
        </div>
        <span class="text-gray-800 dark:text-white">${{ item.price }}</span>
      </div>
    </div>

    <!-- Totals -->
    <div class="mb-6">
      <div class="flex justify-between mb-2">
        <span class="text-gray-600 dark:text-gray-300">Subtotal:</span>
        <span class="text-gray-800 dark:text-white">${{ totals.subtotal }}</span>
      </div>
      <div class="flex justify-between mb-2">
        <span class="text-gray-600 dark:text-gray-300">Tax:</span>
        <span class="text-gray-800 dark:text-white">${{ totals.tax }}</span>
      </div>
      <div class="flex justify-between font-bold">
        <span class="text-gray-800 dark:text-white">Total:</span>
        <span class="text-primary-600 dark:text-primary-400">${{ totals.total }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface ReceiptItem {
  name: string
  quantity: number
  price: number
}

interface ReceiptTotals {
  subtotal: number
  tax: number
  total: number
}

defineProps({
  receiptDate: {
    type: String,
    default: new Date().toLocaleDateString()
  },
  receiptNumber: {
    type: String,
    default: '0001'
  },
  items: {
    type: Array as () => ReceiptItem[],
    default: () => []
  },
  totals: {
    type: Object as () => ReceiptTotals,
    default: () => ({
      subtotal: 0,
      tax: 0,
      total: 0
    })
  }
})
</script>

<style scoped>
@media print {
  .print\:shadow-none {
    box-shadow: none;
  }
}
</style>