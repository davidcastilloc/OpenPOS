export interface CashSession {
    id: string
    opening_cash?: number
    closing_cash?: number
    status?: boolean
    cashier?: string // ID del usuario relacionado
    end_time?: string // ISO date string
    totalTransactions?: number
    created?: string
    updated?: string
}