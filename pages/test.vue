<template>
    <UiPosPaymentConfirmateReceipt :order="items" :total="total" 
    />
</template>

<script lang="ts" setup>
const items = ref([
  {
    description: 'Item 1',
    price: 100,
    quantity: 3,
    total: 100,
    iva: 10,
    isExempt: false,
    isReduced: false
  },
])
</script>

<style>

</style>