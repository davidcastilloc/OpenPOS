<template>
  <div>
    <div class="container">
      <h4>{{ header }}</h4>
      <p>{{ displayText }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(['header'])
const displayText = defineModel('display-text')
</script>

<style>

</style>