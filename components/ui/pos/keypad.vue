<template>
  <div class="grid grid-cols-3 gap-2 w-[240px] p-2 bg-muted-100 dark:bg-muted-900 rounded-lg">
    <BaseButton
      v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]"
      :key="num"
      shape="square"
      color="primary"
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

<style>
.container {
  display: flex;
  width: 200px;
  flex-wrap: wrap;
  border-radius: 5px;
  border: outset;
}
.btn {
  width: 50px;
  height: 50px;
  margin: 2px;
  text-align: center;
  border-radius: 5px;
  border: outset;
}
</style>