<template>
  <div>
    <UiPosDisplay v-model:display-text="displaytext" header="Total: " />
    <UiPosKeypad @keypad-event-button="eventKeypadCollector" />
    <UiPosProduct
      name="Product 1"
      :price="100" />
  </div>
</template>

<script lang="ts" setup>

const displaytext = ref('')
const eventKeypadCollector = (event: any )=>{
  displaytext.value += event
  console.log(displaytext.value)
}
</script>

<style>

</style>