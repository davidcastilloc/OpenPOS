<template>
  <div class="border-b flex justify-between">
    <div>
      <div class="font-medium">{{ item.description }}</div>
      <div class="text-sm text-gray-500">Bs {{ (item.p_bs).toFixed(2) }} x {{ item.quantity }}</div>
    </div>
    <div class="flex items-center pr-3">
      <span class="font-medium">Bs {{ (item.p_bs * item.quantity).toFixed(2) }}</span>
      <Icon name="material-symbols:close"  class="text-red-600 h-5 w-5" @click="$emit('remove')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductOrder } from '~/types/pos'

defineProps({ item: {
  type: Object as PropType<ProductOrder>,
  required: true,
} });
defineEmits(['remove']);
</script>
