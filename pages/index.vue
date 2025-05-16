<template>
  <div class="min-h-screen flex items-center justify-center bg-muted-100 dark:bg-muted-900">
    <div class="w-full max-w-md p-6">
      <div class="text-center mb-8">
        <h1 class="font-bold text-3xl text-muted-800 dark:text-white mb-2">
          Welcome Back
        </h1>
        <p class="text-muted-400">
          Sign in to your POS account
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-2">
          <BaseInput
            v-model="form.user"
            label="Email"
            placeholder="Enter your email"
            :error="errors.user"
          />
        </div>

        <div class="space-y-2">
          <BaseInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            :error="errors.password"
          />
        </div>

        <div class="flex items-center justify-between">
          <BaseCheckbox v-model="form.remember" label="Remember me" />
          <NuxtLink to="/forgot-password" class="text-primary-500 hover:text-primary-400">
            Forgot Password?
          </NuxtLink>
        </div>

        <BaseButton
          type="submit"
          :loading="loading"
          class="w-full"
        >
          Sign In
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
const loading = ref(false)
const form = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: ''
})

const validateForm = () => {
  let isValid = true
  errors.user = ''
  errors.password = ''

  if (!form.user) {
    errors.user = 'User is required'
    isValid = false
  } 

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    // Add your login logic here
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
    navigateTo('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>
