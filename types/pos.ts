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

interface ReceiptData {
  cliente: Cliente
  items: ProductOrder[]
  subtotalGeneral: number
  ivaGeneral: number
  subtotalReduced: number
  ivaReduced: number
  subtotalExempt: number
  totalIva: number
  total: number
}

interface Cliente {
  nacionalidad: string
  cedula: number
  fecha_nac: string
  rif: string
  primer_apellido: string
  segundo_apellido: string
  primer_nombre: string
  segundo_nombre: string
  request_date: string
}

interface PaymentMethod {
  amount: number;
  enabled: boolean;
  type?: 'cash' | 'credit' | 'debit' | 'transfer'; // Permite "check" o cualquier otra cadena si hay otros valores posibles
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

export interface ProductOrder extends Product {
  quantity: number
}

export interface PosOrder {
  items: ProductOrder[]
}

interface ResponseApiProducts {
  success: boolean
  cached: boolean
  updated: string
  products: Product[]
}

export type {
  Product,
  Sale,
  Order,
  SaleTotals,
  ResponseApiProducts,
  PaymentMethod,
  Cliente,
  ReceiptData
}