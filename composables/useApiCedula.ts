// https://api.cedula.com.ve/api/v1?app_id=990+&token=0f2ef4b5e34c35f23272caf3f3c33fb3&cedula=24980047


export const useUseApiCedula = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<any>(null)

  const fetchCedula = async (cedula: string) => {
    loading.value = true
    error.value = null
    data.value = null

    try {
      const response = await $fetch(`https://api.cedula.com.ve/api/v1`, {
        params: {
          app_id: '990',
          token: '0f2ef4b5e34c35f23272caf3f3c33fb3',
          cedula
        }
      })
      data.value = response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    data,
    fetchCedula
  }
}
