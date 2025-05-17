import type { Cliente, PaymentMethod, Product  } from "./pos";
export interface TicketPayload {
    empresa: string;
    direccion: string;
    rif: string;
    telefono: string;
    cliente: Cliente;
    items: Product[];
    subtotalGeneral: number;
    subtotalReduced: number;
    subtotalExempt: number;
    ivaGeneral: number;
    ivaReduced: number;
    totalIva: number;
    total: number;
    pagos?: PaymentMethod[];
    numero_control: string;
    caja?: string;
    sucursal?: string;
  }