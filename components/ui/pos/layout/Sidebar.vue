<template>
  <div class="w-16 bg-blue-700 text-white flex flex-col">
    <button v-for="item in menu" :key="item.icon" class="p-4 hover:bg-blue-800">
      <Icon :name="item.icon"></Icon>
    </button>
  </div>
</template>

<script setup>
const menu = [
  { icon: 'material-symbols:home' },
  { icon: 'material-symbols:point-of-sale' },
  { icon: 'ic:baseline-inventory' },
  { icon: 'uil:setting' },
  { icon: 'tdesign:user-setting-filled' },
];
</script>
