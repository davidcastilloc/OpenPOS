<template>
  <div class="border-b flex justify-between">
    <div>
      <div class="font-medium">{{ item.name }}</div>
      <div class="text-sm text-gray-500">Bs {{ item.price }} x {{ item.quantity }}</div>
    </div>
    <div class="flex items-center pr-3">
      <span class="font-medium">Bs {{ (item.price * item.quantity).toFixed(2) }}</span>
      <Icon name="material-symbols:close"  class="text-red-600 h-5 w-5" @click="$emit('remove')" />
    </div>
  </div>
</template>

<script setup>
defineProps({ item: Object });
defineEmits(['remove']);
</script>
