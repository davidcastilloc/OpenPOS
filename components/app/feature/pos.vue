<template>
  <div class="flex h-screen overflow-hidden">
    <UiPosLayoutSidebar />
    <div class="flex-1 flex flex-col">
      <UiPosLayoutHeader />
      <div class="flex flex-1 overflow-hidden">
        <div class="w-1/2 p-4 overflow-y-auto">
          <UiPosProductPList :products="data.products" @add-product="addProductToOrder" />
        </div>
        <div class="w-1/2 bg-white border-l p-4 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-medium">Order</h2>
            <Icon class="text-sm text-gray-500 -ms-1 h-7 w-7" name="tdesign:clear"></Icon>
          </div>
          <div class="flex flex-col h-full overflow-scroll">
            <UiPosOrderItem v-for="product in order.items" :key="product.sku" :item="product" />
          </div>
          <div class="flex justify-between items-center mt-4">
            <UiPosOrderSummary :subtotalGeneral="subtotalGeneral" :ivaGeneral="ivaGeneral"
              :subtotalReduced="subtotalReduced" :ivaReduced="ivaReduced" :subtotalExempt="subtotalExempt"
              :totalIva="totalIva" :total="total" />
          </div>
          <!-- <div class="flex justify">
            <UiPosOrderKeypad />
          </div> -->
          <div class="flex justify-end mt-4">
            <UiPosOrderActionButtons />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '../types/pos'

const { data } = await useAsyncData('products', () => $fetch('/api/sheet-data?cached'))

// use Store to fetch dolar price
const  dolarStore = useMyDolarStore()
const { getDolar } = storeToRefs(dolarStore)

onMounted( () => {
  dolarStore.fetchDolar()
})
interface productOrder  extends Product{
  price: number;
  quantity: number;
}

interface Order {
  items: productOrder[];
}

const order = ref<Order>({ items: [] })


const { subtotalGeneral, ivaGeneral, subtotalReduced, 
  ivaReduced, subtotalExempt, totalIva, total } = useCalculateOrder(order)

const addProductToOrder = (product: any) => {
  const index = order.value.items.findIndex((item) => item.sku === product.sku)
  if (index === -1) {
    order.value.items.push({ ...product, quantity: 1 , price: Number(getDolar.value * product.p_usd).toFixed(2)})
  } else {
    order.value.items[index].quantity++
  }
}
</script>
