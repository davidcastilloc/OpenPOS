interface Product {
    cod: number;
    sku: number;
    descripcion: string;
    unidad_venta: string;
    pdivisa: number;
    iva_rate: 'general' | 'reduced' | 'exempt'; // Permite "exempt" o cualquier otra cadena si hay otros valores posibles
    pbolivares: number | null;
    categoria: string;
    margen_de_ganancia_sugerido: number | null;
    ubicacion: string | null;
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