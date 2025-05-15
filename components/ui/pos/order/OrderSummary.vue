<template>
  <div class="w-full text-xs text-right mt-4 border-t pt-2 space-y-1">
    <!-- General -->
    <div v-if="subtotalGeneral" class="flex justify-between">
      <span class="text-gray-600">Subtotal General (16%)</span>
      <span class="font-medium">Bs {{ subtotalGeneral }}</span>
    </div>
    <div v-if="ivaGeneral" class="flex justify-between">
      <span class="text-gray-600">IVA General (16%)</span>
      <span class="font-medium">Bs {{ ivaGeneral }}</span>
    </div>

    <!-- Reduced -->
    <div v-if="subtotalReduced" class="flex justify-between">
      <span class="text-gray-600">Subtotal Reducido (8%)</span>
      <span class="font-medium">Bs {{ subtotalReduced }}</span>
    </div>
    <div v-if="ivaReduced" class="flex justify-between">
      <span class="text-gray-600">IVA Reducido (8%)</span>
      <span class="font-medium">Bs {{ ivaReduced }}</span>
    </div>

    <!-- Exempt -->
    <div v-if="subtotalExempt" class="flex justify-between">
      <span class="text-gray-600">Subtotal Exento (0%)</span>
      <span class="font-medium">Bs {{ subtotalExempt }}</span>
    </div>

    <!-- Totals -->
    <div v-if="totalIva" class="flex justify-between border-t pt-1">
      <span class="text-gray-700">Total IVA</span>
      <span class="font-semibold">Bs {{ totalIva }}</span>
    </div>

    <div class="flex justify-between border-t pt-1 text-sm">
      <span class="text-black font-bold">TOTAL</span>
      <span class="font-bold">Bs {{ total || 0 }}</span>
    </div>
  </div>
</template>


<script setup>
defineProps(
  { 
  subtotalGeneral: Number, 
  ivaGeneral: Number, 
  subtotalReduced: Number, 
  ivaReduced: Number, 
  subtotalExempt: Number, 
  totalIva: Number, 
  total: Number 
  }
);
</script>
