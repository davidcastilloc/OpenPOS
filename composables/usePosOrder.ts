import type { Product, PosOrder, ProductOrder } from '~/types/pos'
import { storeToRefs } from 'pinia'
import { useMyDolarStore } from '~/stores/dolar'



export const usePosOrder = () => {
  const order = ref<PosOrder>({ items: [] })
  const dolarStore = useMyDolarStore()
  const { getDolar } = storeToRefs(dolarStore)

  const {
    subtotalGeneral,
    ivaGeneral,
    subtotalReduced,
    ivaReduced,
    subtotalExempt,
    totalIva,
    total,
  } = useCalculateOrder(order)

  const addProductToOrder = (product: ProductOrder) => {
    const index = order.value.items.findIndex(item => item.id === product.id)
    if (index === -1) {
      order.value.items.push({
        ...product,
        quantity: 1,
        p_bs:  getDolar.value * product.p_usd ,
      })
    } else {
      order.value.items[index].quantity++
    }
  }

  const resetOrder = () => {
    order.value.items = []
  }

  const orderIsValid = computed(() => order.value.items.length > 0)

  return {
    order,
    addProductToOrder,
    resetOrder,
    orderIsValid,
    subtotalGeneral,
    ivaGeneral,
    subtotalReduced,
    ivaReduced,
    subtotalExempt,
    totalIva,
    total
  }
}