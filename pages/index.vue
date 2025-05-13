<template>
  <div>
   <UiPosPrinter />
  </div>
</template>

<script lang="ts" setup>

 const cartItems = [
    { name: 'Item 1', quantity: 2, price: 10 },
    { name: 'Item 2', quantity: 1, price: 15 },
    { name: 'Item 3', quantity: 3, price: 5 }
  ]
  const cartTotals = {
    subtotal: 40,
    tax: 4,
    total: 44
  }
</script>

<style>

</style>