<template>
  <div class="flex h-screen overflow-hidden">
    <UiPosLayoutSidebar />

    <!-- Modales Globales -->
    <UiPosLayoutUiModal v-show="modalPaymentIsOpen"
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg z-50 w-1/2">
      <UiPosPaymentModalContent
        :total="total"
        :dolar-rate="getDolar"
        @payment-processed="handlePaymentProcessed"
      />
    </UiPosLayoutUiModal>

    <UiPosLayoutUiModal v-show="modalReceiptIsOpen"
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg z-50 w-1/2">
      <UiPosPaymentConfirmateReceipt 
        :order="order.items" 
        :subtotalGeneral="subtotalGeneral"
        :ivaGeneral="ivaGeneral"
        :subtotalReduced="subtotalReduced"
        :ivaReduced="ivaReduced"
        :subtotalExempt="subtotalExempt"
        :totalIva="totalIva"
        :total="total"
        @confirm="eventConfirmPrint"
        @cancel="eventCancelPrint"
        />
    </UiPosLayoutUiModal>

    <div class="flex-1 flex flex-col">
      <UiPosLayoutHeader />

      <div class="flex flex-1 overflow-hidden">
        <!-- Lista de productos -->
        <div class="w-1/2 p-4 overflow-y-auto">
          <UiPosProductPList :products="data.products" @add-product="addProductToOrder" />
        </div>

        <!-- Orden -->
        <div class="w-1/2 bg-white border-l p-4 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Recibo</h2>
            <p v-if="order.items.length > 0" class="text-sm font-bold"
              :class="paymentIsProcessed ? 'text-green-400' : 'text-red-400'">
              {{ paymentIsProcessed ? 'Pago Procesado' : 'Pendiente de pago' }}
            </p>
            <Icon class="text-sm text-gray-500 -ms-1 h-7 w-7" name="tdesign:clear" @click="resetAllTemporalData"/>
          </div>

          <div class="flex flex-col h-full overflow-scroll">
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
              :total="total"
            />
          </div>

          <div class="flex justify-end mt-4">
            <UiPosOrderActionButtons
              :b-paid-active="orderIsValid && !paymentIsProcessed"
              :b-receipt-active="paymentIsProcessed"
              @click-pay="eventClickPayment"
              @click-receipt="eventClickReceipt"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/pos'

// Data de productos
const { data } = await useAsyncData('products', () => $fetch('/api/sheet-data?cached'))

// Estados
const modalPaymentIsOpen = ref(false)
const modalReceiptIsOpen = ref(false)
const paymentIsProcessed = ref(false)

// Obtener dólar
const dolarStore = useMyDolarStore()
const { getDolar } = storeToRefs(dolarStore)

onMounted(() => {
  dolarStore.fetchDolar()
})

// Tipos y orden
interface productOrder extends Product {
  price: number
  quantity: number
}

interface Order {
  items: productOrder[]
}

const order = ref<Order>({ items: [] })

// Cálculos del total
const {
  subtotalGeneral,
  ivaGeneral,
  subtotalReduced,
  ivaReduced,
  subtotalExempt,
  totalIva,
  total,
} = useCalculateOrder(order)

// Agregar producto a la orden
const addProductToOrder = (product: Product) => {
  const index = order.value.items.findIndex(item => item.sku === product.sku)
  if (index === -1) {
    order.value.items.push({
      ...product,
      quantity: 1,
      price: parseFloat((getDolar.value * product.p_usd).toFixed(2)),
    })
  } else {
    order.value.items[index].quantity++
  }
}

// Validaciones y eventos
const orderIsValid = computed(() => order.value.items.length > 0)

const eventClickPayment = () => {
  if (total.value === 0) return
  modalPaymentIsOpen.value = true
}

const eventClickReceipt = () => {
  modalReceiptIsOpen.value = true
}

const paymentProcessedData = ref({})
// Procesar pago
const handlePaymentProcessed = async (data: any) => {
  const { methods, total, totalPaid, change } = data
  if (!methods) return

  modalPaymentIsOpen.value = false

  const payment = {
    cash_session_id: "49221efdf3986n6",
    methods,
    number_total: total.toFixed(2),
    number_totalPaid: totalPaid.toFixed(2),
    number_change: change.toFixed(2),
  }

  const { pb } = usePocketBase()
  const result = await pb.value.collection('payments').create(payment)
  paymentProcessedData.value = result
  paymentIsProcessed.value = true
}

const resetAllTemporalData = () => {
  // Limpiar los datos temporales
  order.value.items = []
  paymentIsProcessed.value = false
  paymentProcessedData.value = {}
  modalPaymentIsOpen.value = false
  modalReceiptIsOpen.value = false
}

const eventConfirmPrint = (dataReceipt: any) => {
  // TODO: Enviar datos al backend de impresión de recibo
  // Cerrar el modal
  console.log("LA DADATA A IMPRIMIR ", dataReceipt)
  resetAllTemporalData()
  modalReceiptIsOpen.value = false
}
const eventCancelPrint = () => {
  // Cerrar el modal
  console.log("CANCELAR")
  modalReceiptIsOpen.value = false
}

</script>
