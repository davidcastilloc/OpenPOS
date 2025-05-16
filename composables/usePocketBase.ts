import PocketBase from 'pocketbase'
import { ref } from 'vue'
export const usePocketBase = () => {
  const pb = ref(new PocketBase('/api/pocketbase'))

  const isAuthenticated = ref(pb.value.authStore.isValid)

  const login = async (email: string, password: string) => {
    try {
      const authData = await pb.value.collection('users').authWithPassword(email, password)
      isAuthenticated.value = true
      return authData
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    pb.value.authStore.clear()
    isAuthenticated.value = false
  }

  return {
    pb,
    isAuthenticated,
    login,
    logout,
  }
}
