<template>
  <div>
  
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