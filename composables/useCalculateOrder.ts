import type { Product } from "~/types/pos";
interface productOrder  extends Product{
  quantity: number;
  price: number;
}

interface Order {
  items: productOrder[];
}

const IVA_RATES = {
  general: 0.16,
  reduced: 0.08,
  exempt: 0,
} as const;

export const useCalculateOrder = (order: Ref<Order>) => {
  const currentOrder = toRef(order);

  const calculateSubtotal = (rateType: productOrder['iva_rate']) =>
    computed(() =>
      currentOrder.value.items
        ?.filter((item) => item.iva_rate === rateType)
        .reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0
    );

  const calculateIva = (subtotal: Ref<number>, rate: keyof typeof IVA_RATES) =>
    computed(() => subtotal.value * IVA_RATES[rate]);

  const subtotalGeneral = calculateSubtotal('general');
  const ivaGeneral = calculateIva(subtotalGeneral, 'general');

  const subtotalReduced = calculateSubtotal('reduced');
  const ivaReduced = calculateIva(subtotalReduced, 'reduced');

  const subtotalExempt = calculateSubtotal('exempt');

  const totalIva = computed(() => ivaGeneral.value + ivaReduced.value);
  const total = computed(() =>
    subtotalGeneral.value +
    subtotalReduced.value +
    subtotalExempt.value +
    totalIva.value
  );

  return {
    subtotalGeneral,
    ivaGeneral,
    subtotalReduced,
    ivaReduced,
    subtotalExempt,
    totalIva,
    total,
  };
};
