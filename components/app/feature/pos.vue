<template>
  <div class="flex h-screen overflow-hidden">
    <UiPosLayoutSidebar />
    <!--Modals Globales-->
    <UiPosLayoutUiModal v-model="modalIsOpen"
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg z-50 w-1/2">
      <UiPosPaymentModalContent :total="total" :dolar-rate="getDolar" @payment-processed="handlePaymentProcesed" />
    </UiPosLayoutUiModal>
    <div class="flex-1 flex flex-col">
      <UiPosLayoutHeader />
      <div class="flex flex-1 overflow-hidden">
        <div class="w-1/2 p-4 overflow-y-auto">
          <UiPosProductPList :products="data.products" @add-product="addProductToOrder" />
        </div>
        <div class="w-1/2 bg-white border-l p-4 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Recibo</h2>
            <p v-show="order.items.length > 0" class="text-sm font-bold"
              :class="paymentProcessed?.value ? 'text-green-400' : 'text-red-400'">
              {{ paymentProcessed?.value ? 'Pago Procesado' : 'Pendiente de pago' }}
            </p>
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
            <UiPosOrderActionButtons @click-pay="eventClickPayment(total)" @click-receipt="eventClickReceipt({
              order, subtotalGeneral, ivaGeneral, subtotalReduced,
              ivaReduced, subtotalExempt, totalIva, total
            })" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '../types/pos'
import { usePocketBase } from '~/composables/usePocketBase'

const { data } = await useAsyncData('products', () => $fetch('/api/sheet-data?cached'))

const showModal = ref(true)

const operationNumber = ref(1)

const paymentProcessed = reactive({
  
})

// use Store to fetch dolar price
const dolarStore = useMyDolarStore()
const { getDolar } = storeToRefs(dolarStore)

onMounted(() => {
  dolarStore.fetchDolar()
})
interface productOrder extends Product {
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
    order.value.items.push({ ...product, quantity: 1, price: Number(getDolar.value * product.p_usd).toFixed(2) })
  } else {
    order.value.items[index].quantity++
  }
}

const modalIsOpen = ref(false)

const eventClickPayment = (total: Number) => {
  console.log('click payment open modal for payment', total)
  // validate payment 0
  if (total === 0) {
    return
  }
  modalIsOpen.value = true
  console.log('modalIsOpen', modalIsOpen.value)
}

const eventClickReceipt = (data: any) => {
  console.log('click receipt open modal for receipt', data)

}

const handlePaymentProcesed = async (data: any) => {
  const { methods, total, totalPaid, change } = data
  if (!methods) {
    return
  }
  modalIsOpen.value = false
  // call to pocket base api to save payment
  const payment = {
    "cash_session_id": "49221efdf3986n6",
    "methods": methods,
    "number_total": total.toFixed(2),
    "number_totalPaid": totalPaid.toFixed(2),
    "number_change": change.toFixed(2),
  };
  const { pb } = usePocketBase()
  let result = await pb.value.collection('payments').create(payment)
  console.log('result', result)
  paymentProcessed.value = result
}
</script>
