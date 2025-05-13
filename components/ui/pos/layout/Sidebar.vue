<template>
  <div class="w-16 bg-blue-700 text-white flex flex-col">
    <button v-for="item in menu" :key="item.icon" class="p-4 hover:bg-blue-800">
      <span class="material-icons">{{ item.icon }}</span>
    </button>
  </div>
</template>

<script setup>
const menu = [
  { icon: 'home' },
  { icon: 'point_of_sale' },
  { icon: 'inventory' },
  { icon: 'settings' },
  { icon: 'account_circle' },
];
</script>
