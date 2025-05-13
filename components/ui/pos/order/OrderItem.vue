<template>
  <div class="border-b flex justify-between">
    <div>
      <div class="font-medium">{{ item.name }}</div>
      <div class="text-sm text-gray-500">${{ item.price }} x {{ item.qty }}</div>
    </div>
    <div class="flex items-center pr-3">
      <span class="font-medium">${{ (item.price * item.qty).toFixed(2) }}</span>
      <Icon name="material-symbols:close h-5 w-5"  class="text-red-600" @click="$emit('remove')" />
    </div>
  </div>
</template>

<script setup>
defineProps({ item: Object });
defineEmits(['remove']);
</script>
