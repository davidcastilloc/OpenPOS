<template>
  <BaseCard class="hover:shadow-lg transition-shadow duration-200">
    <div class="p-4">
      <div class="mb-4 relative aspect-square overflow-hidden rounded-lg">
        <img 
          v-if="productImage"
          :src="productImage" 
          :alt="productImage"
          class="w-auto object-cover"
        />
        <Icon
          v-else
          name="solar:box-bold"
          class="w-full h-full text-gray-400"
        </Icon>
      </div>
      
      <div class="flex flex-col gap-2">
        <h3 class="text-sm text-gray-900 dark:text-white">
          {{ description }}
        </h3>
        <div class="flex justify-between items-center">
          <span class="text-primary-500 font-semibold text-xl">
            Bs {{ precioAlCambioDolar }}
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
const  dolarStore = useMyDolarStore()
const { getDolar } = storeToRefs(dolarStore)

const props = defineProps(
  {
   id: {
      type: Number,
      required: true
    },
    cod:{
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    p_usd: {
      type: Number,
      required: true
    },
    p_bs: {
      type: Number,
      required: true
    },
    iva_rate: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: false
    },
    profit: {
      type: Number,
      required: false
    },
    location: {
      type: String,
      required: false
    },
  }
)
const precioAlCambioDolar = computed(() => {
  return (props.p_usd?.toFixed(2) * getDolar.value).toFixed(2)
})
const emit = defineEmits(['add'])

const productImage = computed(() => {
  return props.image
})

function addToCart() {
  emit('add')
}
</script>
