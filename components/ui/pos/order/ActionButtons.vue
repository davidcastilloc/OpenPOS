<template>
  <div class="w-full grid grid-cols-2 gap-2">
    <BaseButton variant="primary" @click="pay">
      <Icon class="-ms-1 h-4 w-4" name="hugeicons:payment-02" /> 
      <span>Pago</span>
    </BaseButton>
    <BaseButton variant="primary">
      <Icon class="-ms-1 h-4 w-4" @click="receipt" name="streamline:receipt" /> 
      <span>Recibo</span>
    </BaseButton>
  </div>
</template>

<script setup>
// emits events to parent component
const emit = defineEmits(['click-pay', 'click-receipt'])
const pay = () => {
  emit('click-pay')
}
const receipt = () => {
  emit('click-receipt')
}
</script>
