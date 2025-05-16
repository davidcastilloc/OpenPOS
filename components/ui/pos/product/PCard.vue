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
        <h3 class="font-semibold text-lg text-gray-900 dark:text-white">
          {{ descripcion }}
        </h3>
        <div class="flex justify-between items-center">
          <span class="text-primary-500 font-bold text-xl">
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

const props = defineProps({
    "cod": String,
    "sku": Number,
    "descripcion": String,
    "unidad_venta": String,
    "pdivisa": Number,
    "iva_rate": String,
    "image": String,
    "pbolivares": null,
    "categoria": String,
    "margen_de_ganancia_sugerido": Number,
    "ubicacion": null
})
const precioAlCambioDolar = computed(() => {
  return (props.pdivisa?.toFixed(2) * getDolar.value).toFixed(2)
})
const emit = defineEmits(['add'])

const productImage = computed(() => {
  return props.image
})

function addToCart() {
  emit('add')
}
</script>
