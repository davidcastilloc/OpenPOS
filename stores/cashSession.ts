// stores/cashSession.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CashSession } from '~/types/TCashSession'

export const useCashSessionStore = defineStore('cashSession', () => {
  const { pb } = usePocketBase()
  const activeSession = ref<CashSession | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isSessionOpen = computed(() => !!activeSession.value && activeSession.value.status)

  const getActiveSessionId = computed(() => activeSession.value?.id)

  // 📥 Verifica si ya hay una sesión abierta
  async function fetchActiveSession() {
    loading.value = true
    try {
      const sessions = await pb.collection('cash_sessions').getFullList<CashSession>({
        filter: 'status = true',
        sort: '-created',
        $autoCancel: false
      })
      activeSession.value = sessions[0] || null
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch active session'
    } finally {
      loading.value = false
    }
  }

  // 🚀 Abre una nueva sesión de caja
  async function openSession(opening_cash: number, cashierId: string) {
    loading.value = true
    try {
      // Evita abrir si ya hay una sesión activa
      if (isSessionOpen.value) {
        throw new Error('Ya hay una sesión de caja abierta.')
      }

      const session = await pb.collection('cash_sessions').create<CashSession>({
        opening_cash,
        status: true,
        cashier: cashierId
      })

      activeSession.value = session
    } catch (err: any) {
      error.value = err.message || 'Error al abrir la sesión de caja'
    } finally {
      loading.value = false
    }
  }

  // 🛑 Cierra la sesión de caja activa
  async function closeSession(closing_cash: number, totalTransactions: number) {
    loading.value = true
    try {
      if (!activeSession.value || !activeSession.value.id) {
        throw new Error('No hay una sesión activa para cerrar.')
      }

      const closed = await pb.collection('cash_sessions').update<CashSession>(
        activeSession.value.id,
        {
          closing_cash,
          totalTransactions,
          end_time: new Date().toISOString(),
          status: false
        }
      )

      activeSession.value = null
    } catch (err: any) {
      error.value = err.message || 'Error al cerrar la sesión de caja'
    } finally {
      loading.value = false
    }
  }

  return {
    getActiveSessionId,
    activeSession,
    isSessionOpen,
    loading,
    error,
    fetchActiveSession,
    openSession,
    closeSession
  }
})
