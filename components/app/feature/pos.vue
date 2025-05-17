<template>
  <div class="flex h-screen overflow-hidden">
    <UiPosLayoutSidebar />

    <!-- Modales Globales -->
    <UiPosLayoutUiModal v-show="modalPaymentIsOpen" @modal:close="modalPaymentIsOpen = false"
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg z-50 w-1/2">
      <UiPosPaymentModalContent :total="total" :dolar-rate="getDolar" @payment-processed="handlePaymentProcessed" />
    </UiPosLayoutUiModal>

    <UiPosLayoutUiModal v-show="modalReceiptIsOpen" @modal:close="modalReceiptIsOpen = false"
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg z-50 w-1/2">
      <UiPosPaymentConfirmateReceipt :order="order.items" :subtotalGeneral="subtotalGeneral" :ivaGeneral="ivaGeneral"
        :subtotalReduced="subtotalReduced" :ivaReduced="ivaReduced" :subtotalExempt="subtotalExempt"
        :totalIva="totalIva" :total="total" @confirm="eventConfirmPrint" @cancel="eventCancelPrint" />
    </UiPosLayoutUiModal>

    <div class="flex-1 flex flex-col">
      <UiPosLayoutHeader />

      <div class="flex flex-1 overflow-hidden">
        <!-- Lista de productos -->
        <div class="w-1/2 p-4 overflow-y-auto">
          <UiPosProductPList :rate="getDolar" :products="data" @add-product="addProductToOrder" />
        </div>

        <!-- Orden -->
        <div class="w-1/2 bg-white border-l p-4 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Recibo</h2>
            <p v-if="order.items.length > 0" class="text-sm font-bold"
              :class="paymentIsProcessed ? 'text-green-400' : 'text-red-400'">
              {{ paymentIsProcessed ? 'Pago Procesado' : 'Pendiente de pago' }}
            </p>
            <Icon class="text-sm text-gray-500 -ms-1 h-7 w-7" name="tdesign:clear" @click="resetAllTemporalData" />
          </div>

          <div class="flex flex-col h-full overflow-scroll">
            <UiPosOrderItem v-for="product in order.items" :key="product.sku" :item="product" />
          </div>

          <div class="flex justify-between items-center mt-4">
            <UiPosOrderSummary :subtotalGeneral="subtotalGeneral" :ivaGeneral="ivaGeneral"
              :subtotalReduced="subtotalReduced" :ivaReduced="ivaReduced" :subtotalExempt="subtotalExempt"
              :totalIva="totalIva" :total="total" />
          </div>

          <div class="flex justify-end mt-4">
            <UiPosOrderActionButtons :b-paid-active="orderIsValid && !paymentIsProcessed"
              :b-receipt-active="paymentIsProcessed" @click-pay="eventClickPayment"
              @click-receipt="eventClickReceipt" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Product, ReceiptData } from '~/types/pos'

// Store
const dolarStore = useMyDolarStore()

dolarStore.fetchDolar()

// Composables
const { getDolar } = storeToRefs(dolarStore)

// Data de productos
const { data } = await useAsyncData('products', () => $fetch('/api/sheet-data?cached'), {
  transform: (data) => {
    return data.products.map((product: Product) => ({
      id: product.id,
      sku: product.sku,
      category: product.category,
      description: product.description,
      p_usd: product.p_usd,
      iva_rate: product.iva_rate,
    }))
  },
})

const {
  order,
  addProductToOrder,
  resetOrder,
} = usePosOrder()

// Store de sesiones de caja
const cashStore = useCashSessionStore()

await useAsyncData('cash-session', () =>  cashStore.fetchActiveSession())


// Estados UI
const modalPaymentIsOpen = ref(false)
const modalReceiptIsOpen = ref(false)
const paymentProcessedData = ref<{ id?: string }>({})

// Reactividad
const paymentIsProcessed = computed(() => !!paymentProcessedData.value?.id)

// Cálculos del total
const orderCalculations = useCalculateOrder(order)

// Acceder a las variables desde el objeto reactivo
const {
  subtotalGeneral,
  ivaGeneral,
  subtotalReduced,
  ivaReduced,
  subtotalExempt,
  totalIva,
  total,
} = orderCalculations

// Eventos UI
const orderIsValid = computed(() => order.value.items.length > 0)

const eventClickPayment = () => {
  if (total.value === 0) return
  modalPaymentIsOpen.value = true
}

const eventClickReceipt = () => {
  modalReceiptIsOpen.value = true
}

const { processPayment, processReceipt } = usePosPayment()

// Manejo de pagos
const handlePaymentProcessed = async (data: PaymentData) => {
  try {
    const result = await processPayment(data)

    if (result.success && result.paymentId) {
      modalPaymentIsOpen.value = false
      paymentProcessedData.value = { id: result.paymentId }
    }
  } catch (error) {
    console.error('Error en procesamiento de pago:', error)
  }
}

// Manejo de recibos
const eventConfirmPrint = async (dataReceipt: ReceiptData) => {
  if (!paymentProcessedData.value?.id) return

  try {
    await processReceipt(paymentProcessedData.value.id, dataReceipt.cliente, dataReceipt)
    resetAllTemporalData()
    modalReceiptIsOpen.value = false
  } catch (error) {
    console.error('Error generando recibo:', error)
  }
}

const resetAllTemporalData = () => {
  resetOrder()
  paymentProcessedData.value = {}
  modalPaymentIsOpen.value = false
  modalReceiptIsOpen.value = false
}
const eventCancelPrint = () => {
  // Cerrar el modal
  console.log("CANCELAR")
  modalReceiptIsOpen.value = false
}

</script>
