<template>
  <div class="flex h-screen overflow-hidden">
    <UiPosLayoutSidebar />
    <div class="flex-1 flex flex-col">
      <UiPosLayoutHeader />
      <div class="flex flex-1 overflow-hidden">
        <div class="w-1/2 p-4 overflow-y-auto">
          <UiPosProductPList :products="products" @add-product="addProductToOrder" />
        </div>
        <div class="w-1/2 bg-white border-l p-4 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-medium">Order</h2>
            <Icon class="text-sm text-gray-500 -ms-1 h-7 w-7" name="tdesign:clear"></Icon>
          </div>
          <div class="flex flex-col overflow-scroll">
            <UiPosOrderItem v-for="product in order.items" :key="product.sku" :item="product" />
          </div>
          <div class="flex justify-between items-center mt-4">
            <UiPosOrderSummary    
            :subtotalGeneral="subtotalGeneral"
            :ivaGeneral="ivaGeneral"
            :subtotalReduced="subtotalReduced"
            :ivaReduced="ivaReduced"
            :subtotalExempt="subtotalExempt"
            :totalIva="totalIva"
            :total="total" />
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
import type { Product, Order } from '../types'

const products = <Product[]>ref([
  {
    sku: 1,
    name: 'Product 1',
    price: 100,
    ivaRate: "general"
  },
  {
    sku: 2,
    name: 'Product 2',
    price: 200,
    ivaRate: "reduced"
  },
  {
    sku: 3,
    name: 'Product 3',
    price: 300,
    ivaRate: "exempt"
  },
  {
    sku: 4,
    name: 'Product 4',
    price: 400,
    ivaRate: "general"
  }
])

const order = ref({items:[]})

const { subtotalGeneral, ivaGeneral, subtotalReduced, ivaReduced, subtotalExempt, totalIva, total } = useCalculateOrder(order.value)

const addProductToOrder = (product: Product) => {
  // check if product is already in order
  const index = order.value.items.findIndex((item: any) => item.sku === product.sku)
  if (index === -1) {
    order.value.items.push({
     ...product,
      quantity: 1,
  })
  } else {
    console.log('product already in order')
    order.value.items[index].quantity++
  }
}
</script>
