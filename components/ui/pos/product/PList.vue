<template>
  <div class="grid grid-cols-3 gap-4">
    <PCard
      v-for="product in products"
      :key="product.sku"
      v-bind="product"
      @add="$emit('add-product', product)"
    />
  </div>
</template>

<script setup>
import PCard from './PCard.vue';

defineProps({ products: Array });
defineEmits(['add-product']);
</script>
