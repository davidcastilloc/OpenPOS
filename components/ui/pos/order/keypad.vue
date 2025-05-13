<template>
  <div class="grid grid-cols-3 gap-2 p-2 bg-muted-100 dark:bg-muted-900 rounded-lg w-full">
    <BaseButton
      v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]"
      :key="num"
      variant="primary"
      size="md"
      @click="emits('keypad-event-button', num)"
    >
      {{ num }}
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(['keypad-event-button'])
</script>
