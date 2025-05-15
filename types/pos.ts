interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    ivaRate: 'general' | 'reduced' | 'exempt';
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