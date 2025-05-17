import { defineStore } from 'pinia'

export const useNotification = defineStore('notification', {
  state: () => ({
    messages: [] as string[]
  }),
  actions: {
    showError(message: string) {
      this.messages.push(`Error: ${message}`)
      console.error(message)
    },
    showSuccess(message: string) {
      this.messages.push(`Éxito: ${message}`)
      console.log(message)
    }
  }
})