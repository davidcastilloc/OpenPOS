interface Product {
    id: number;
    cod: string;
    sku: number;
    description: string;
    unit: string;
    p_usd: number;
    p_bs: number;
    iva_rate: 'general' | 'reduced' | 'exempt'; // Permite "exempt" o cualquier otra cadena si hay otros valores posibles
    category: string;
    profit: number | null;
    location: string | null;
  }

  interface Sale {
    products: Product[];
    discount: number;
  }

  interface Order {
    items: Product[];
  }
  
  interface SaleTotals {
    subtotalGeneral: number;
    ivaGeneral: number;
    subtotalReduced: number;
    ivaReduced: number;
    subtotalExempt: number;
    totalIva: number;
    total: number;
  }

  export type {
    Product,
    Sale,
    Order,
    SaleTotals
  }