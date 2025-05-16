<template>
  <div class="receipt-validation">
    <div class="validation-header">
      <h2>Receipt Validation</h2>
    </div>

    <div class="validation-form">
      <div class="form-group">
        <label for="receiptNumber">Receipt Number</label>
        <input 
          type="text" 
          id="receiptNumber"
          v-model="receiptNumber"
          placeholder="Enter receipt number"
        >
      </div>

      <div class="form-group">
        <label for="amount">Amount</label>
        <input 
          type="number" 
          id="amount"
          v-model="amount"
          placeholder="Enter amount"
        >
      </div>

      <div class="validation-status" :class="statusClass">
        {{ validationMessage }}
      </div>

      <button 
        class="validate-btn"
        @click="validateReceipt"
        :disabled="isValidating"
      >
        {{ isValidating ? 'Validating...' : 'Validate Receipt' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const receiptNumber = ref('')
const amount = ref(0)
const isValidating = ref(false)
const validationStatus = ref<'none' | 'valid' | 'invalid'>('none')

const validationMessage = computed(() => {
  switch (validationStatus.value) {
    case 'valid':
      return 'Receipt is valid'
    case 'invalid':
      return 'Invalid receipt'
    default:
      return ''
  }
})

const statusClass = computed(() => ({
  'status-valid': validationStatus.value === 'valid',
  'status-invalid': validationStatus.value === 'invalid'
}))

const validateReceipt = async () => {
  if (!receiptNumber.value || amount.value <= 0) return
  
  isValidating.value = true
  try {
    // TODO: Implement actual validation logic here
    await new Promise(resolve => setTimeout(resolve, 1000))
    validationStatus.value = 'valid'
  } catch (error) {
    validationStatus.value = 'invalid'
  } finally {
    isValidating.value = false
  }
}
</script>

<style scoped>
.receipt-validation {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.validation-header {
  text-align: center;
  margin-bottom: 20px;
}

.validation-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: bold;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.validation-status {
  text-align: center;
  padding: 10px;
  border-radius: 4px;
}

.status-valid {
  background-color: #d4edda;
  color: #155724;
}

.status-invalid {
  background-color: #f8d7da;
  color: #721c24;
}

.validate-btn {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.validate-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
</style>