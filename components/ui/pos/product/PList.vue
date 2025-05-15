<template>
  <div class="grid grid-cols-3 gap-4">
    <!-- SKU Barcode finder whit-icon -->
    <div class="col-span-3">
      <div class="flex items-center">
        <BaseInput type="text" class="w-full" placeholder="SKU / Barcode" />
          <BaseButton>
        <Icon name="ic:outline-search" />
        </BaseButton>
      </div>
    </div>
    <!-- Product Cards -->
    <PCard v-for="product in products" :key="product.sku" v-bind="product" @add="emits('add-product', product)" />
  </div>
</template>

<script setup>
import PCard from './PCard.vue';

defineProps({ products: Array });
const emits = defineEmits(['add-product']);
</script>
