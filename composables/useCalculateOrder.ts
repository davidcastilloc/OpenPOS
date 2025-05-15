interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  ivaRate: 'general' | 'reduced' | 'exempt';
}

interface Order {
  items: Product[];
}

const IVA_RATES = {
  general: 0.16,
  reduced: 0.08,
  exempt: 0,
} as const;

export const useCalculateOrder = (order: Ref<Order>) => {
  const currentOrder = toRef(order);

  const calculateSubtotal = (rateType: Product['ivaRate']) =>
    computed(() =>
      currentOrder.value.items
        ?.filter((item) => item.ivaRate === rateType)
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
