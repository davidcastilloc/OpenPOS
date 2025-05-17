import type { Cliente, PaymentMethod, ReceiptData } from '~/types/pos'
import { useNotification } from '~/stores/notification'
import type { TicketPayload } from '~/types/TPrinter'

export interface PaymentData {
  methods: PaymentMethod
  total: number
  totalPaid: number
  change: number
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  error?: string | unknown
}

export const usePosPayment = () => {
  const { pb } = usePocketBase()
  const notification = useNotification()
  const processPayment = async (data: PaymentData): Promise<PaymentResult> => {
    try {
      const payment = {
        cash_session_id: useCashSessionStore().getActiveSessionId,
        methods: data.methods,
        number_total: data.total.toFixed(2),
        number_totalPaid: data.totalPaid.toFixed(2),
        number_change: data.change.toFixed(2),
      }

      const result = await pb.collection('payments').create(payment)
      return { success: true, paymentId: result.id }
    } catch (error) {
      notification.showError('Error procesando el pago')
      return { success: false, error: error }
    }
  }

  const sendToPrinterServer = async (data: TicketPayload) => {
      const response = await $fetch('/api/printer/print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      return response
  }

  const processReceipt = async (paymentId: string, clientData: Cliente, dataReceipt: ReceiptData) => {
    try {
      const data = {
        cash_session_id: useCashSessionStore().getActiveSessionId,
        payment_id: paymentId,
        client_data: clientData,
        json_data: dataReceipt,
      }
      const receipt = await pb.collection('receipts').create(data)
      await sendToPrinterServer(
        {
          items: dataReceipt.items,
          total: dataReceipt.total,
          empresa: 'EMPRENDIMIENTO GEORGINA MANOUKIAN',
          direccion: 'Av. Francisco de Miranda sector La Laguna frente a la garza',
          rif: 'N-CRNE2025/55212',
          telefono: '0414-7790151',
          subtotalGeneral: dataReceipt.subtotalGeneral,
          subtotalReduced: dataReceipt.subtotalReduced,
          subtotalExempt: dataReceipt.subtotalExempt,
          ivaGeneral: dataReceipt.ivaGeneral,
          ivaReduced: dataReceipt.ivaReduced,
          totalIva: dataReceipt.totalIva,
          numero_control: receipt.id,
          cliente: clientData
        }
      )
    
      return { success: true }
    } catch (error) {
      notification.showError('Error generando recibo')
      return { success: false, error: error }
    }
  }

  return { processPayment, processReceipt, sendToPrinterServer }
}