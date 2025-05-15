<template>
  <BaseCard class="hover:shadow-lg transition-shadow duration-200">
    <div class="p-4">
      <div class="mb-4 relative aspect-square overflow-hidden rounded-lg">
        <img 
          v-if="productImage"
          :src="productImage" 
          :alt="name"
          class="w-auto object-cover"
        />
        <Icon
          v-else
          name="solar:box-bold"
          class="w-full h-full text-gray-400"
        </Icon>
      </div>
      
      <div class="flex flex-col gap-2">
        <h3 class="font-semibold text-lg text-gray-900 dark:text-white">
          {{ name }}
        </h3>
        <div class="flex justify-between items-center">
          <span class="text-primary-500 font-bold text-xl">
            ${{ price }}
          </span>
          <BaseButton
            class="!px-3 !py-2"
            rounded="md"
            @click="addToCart"
          >+</BaseButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
const props = defineProps({
  id: {
      type: String,
    },
    sku: {
      type: String,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      required: true,
      type: Number,
    },
    category: {
      type: Object,
    },
    unitOfMeasure: {
      type: Object,
    },
    active: {
      type: Boolean,
    },
    image: {
      type: String,
    },
})

const emit = defineEmits(['add'])

const productImage = computed(() => {
  return props.image
})

function addToCart() {
  emit('add')
}
</script>
