<template>
  <BaseCard class="product-card hover:shadow-lg transition-shadow duration-200">
    <div class="p-4">
      <div class="mb-4 relative aspect-square overflow-hidden rounded-lg">
        <img 
          :src="productImage" 
          :alt="name"
          class="w-full h-full object-cover"
        />
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
          >
            <Iconify icon="lucide:plus" class="w-5 h-5" />
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['addToCart'])

const productImage = computed(() => {
  return props.image || '/images/placeholder-product.jpeg'
})

function addToCart() {
  emit('addToCart')
}
</script>

<style scoped>
.product-card {
  min-width: 250px;
  max-width: 300px;
}
</style>