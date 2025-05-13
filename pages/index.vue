<template>
  <div class="flex h-screen overflow-hidden">
    <UiPosLayoutSidebar />
    <div class="flex-1 flex flex-col">
        <UiPosLayoutHeader />
        <div class="flex flex-1 overflow-hidden">
          <UiPosProductPList :products="products"/>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Component logic here
const products = ref([
  {
    sku: 1,
    name: 'Product 1',
    price: 100,
  },
  {
    sku: 2,
    name: 'Product 2',
    price: 200,
  },
  {
    sku: 3,
    name: 'Product 3',
    price: 300,
  },
  {
    sku: 4,
    name: 'Product 4',
    price: 400,
  }
])
</script>

<style>

</style>