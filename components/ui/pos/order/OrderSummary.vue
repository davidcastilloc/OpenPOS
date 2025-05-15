<template>
  <div class="container">
    <div class="flex justify-between py-2 border-b">
      <span>Subtotal:</span>
      <span>Bs {{ subtotal.toFixed(2) }}</span>
    </div>
    <div class="flex justify-between py-2 border-b">
      <span>Impuestos:</span>
      <span>Bs {{ tax.toFixed(2) }}</span>
    </div>
    <div class="flex justify-between py-2 font-bold text-lg">
      <span>Total:</span>
      <span>Bs {{ total.toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ subtotal: Number, tax: Number, total: Number });
</script>
