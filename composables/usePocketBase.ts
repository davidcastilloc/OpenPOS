import PocketBase from 'pocketbase'
import { ref } from 'vue'
export const usePocketBase = () => {
  const pb = new PocketBase('/api/pocketbase')

  const isAuthenticated = ref(pb.authStore.isValid)

  const login = async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password)
      isAuthenticated.value = true
      return authData
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    pb.authStore.clear()
    isAuthenticated.value = false
  }

  return {
    pb,
    isAuthenticated,
    login,
    logout,
  }
}
