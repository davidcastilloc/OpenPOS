import type { Product, PosOrder } from "~/types/pos";

const IVA_RATES = {
  general: 0.16,
  reduced: 0.08,
  exempt: 0,
} as const;

export const useCalculateOrder = (order: Ref<PosOrder>) => {
  const currentOrder = toRef(order);

  const calculateSubtotal = (rateType: Product['iva_rate']) =>
    computed(() =>
      (currentOrder.value.items ?? [])
        .filter((item) => item.iva_rate === rateType)
        .reduce((sum, item) => {
          const quantity = Number(item.quantity) || 0;
          const price = Number(item.p_bs) || 0;
          return sum + price * quantity;
        }, 0)
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
    currentOrder,
    subtotalGeneral,
    ivaGeneral,
    subtotalReduced,
    ivaReduced,
    subtotalExempt,
    totalIva,
    total,
  };
};
