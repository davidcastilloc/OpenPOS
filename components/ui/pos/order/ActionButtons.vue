<template>
  <div class="w-full grid grid-cols-2 gap-2">
    <BaseButton variant="primary" @click="pay" :disabled="!bPaidActive">
      <Icon class="-ms-1 h-4 w-4" name="hugeicons:payment-02" />
      <span>Pago</span>
    </BaseButton>
    <BaseButton variant="primary" @click="receipt" :disabled="!bReceiptActive" >
      <Icon class="-ms-1 h-4 w-4" name="streamline:receipt" />
      <span>Recibo</span>
    </BaseButton>
  </div>
</template>

<script setup lang="ts">

interface Props {
  bPaidActive?: boolean
  bReceiptActive?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  bPaidActive: true,
  bReceiptActive: true,
})

// emits events to parent component
const emit = defineEmits(['click-pay', 'click-receipt'])
const pay = () => {
  emit('click-pay')
}
const receipt = () => {
  emit('click-receipt')
}

</script>
