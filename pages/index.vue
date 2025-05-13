<template>
  <div class="flex h-screen overflow-hidden">
    <UiPosLayoutSidebar />
    <div class="flex-1 flex flex-col">
      <UiPosLayoutHeader />
      <div class="flex flex-1 overflow-hidden">
        <div class="w-1/2 p-4 overflow-y-auto">
          <UiPosProductPList :products="products" />
        </div>
        <div class="w-1/2 bg-white border-l p-4 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-medium">Order</h2>
            <Icon class="text-sm text-gray-500 -ms-1 h-7 w-7" name="tdesign:clear"></Icon>
          </div>
          <div class="flex flex-col overflow-scroll">
            <UiPosOrderItem v-for="product in order" :key="product.sku" :item="product" />
          </div>
          <div class="flex justify-between items-center mt-4">
            <UiPosOrderSummary :subtotal="100" :total="100" :tax="100" />
          </div>
          <div class="flex justify">
            <UiPosOrderKeypad />
          </div>
          <div class="flex justify-end mt-4">
            <UiPosOrderActionButtons />
          </div>
        </div>
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

const order = ref([
  {
    sku: 1,
    name: 'Product 1',
    price: 1.2,
    qty: 1,
  },
  {
    sku: 2,
    name: 'Product 2',
    price: 1.3,
    qty: 1,
  },
  {
    sku: 3,
    name: 'Product 3',
    price: 1.6,
    qty: 3,
  },
  {
    sku: 4,
    name: 'Product 4',
    price: 1.8,
    qty: 4,
  }
])
</script>
