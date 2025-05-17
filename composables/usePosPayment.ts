import type { PaymentMethod } from '~/types/pos'
import { useNotification } from '~/stores/notification'

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

  const processReceipt = async (paymentId: string, clientData: any, dataReceipt: any) => {
    try {
      const data = {
        cash_session_id: useCashSessionStore().getActiveSessionId,
        payment_id: paymentId,
        client_data: clientData,
        json_data: dataReceipt,
      }
      await pb.collection('receipts').create(data)
      return { success: true }
    } catch (error) {
      notification.showError('Error generando recibo')
      return { success: false, error: error }
    }
  }

  return { processPayment, processReceipt }
}