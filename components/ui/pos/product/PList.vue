<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- Input de búsqueda -->
    <div class="col-span-2">
      <div class="flex items-center">
        <BaseInput
          type="text"
          class="w-full"
          placeholder="SKU / Barcode"
          v-model="searchTerm"
          @keydown.enter="handleEnter"
          tabindex="1"
        />
      </div>
    </div>

    <!-- Tabla de productos filtrados -->
    <div class="col-span-2">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th class="px-6 py-3">Descripcion</th>
            <th class="px-6 py-3">Unidad</th>
            <th class="px-6 py-3">Precio</th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          >
            <td class="px-6 py-4">{{ product.description }}</td>
            <td class="px-6 py-4">{{ product.unit }}</td>
            <td class="px-6 py-4">Bs {{ product.p_bs }}</td>
            <td >
              <BaseButton @click="emits('add-product', product)">
                <Icon name="ic:outline-add" />
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({ products: Array });
const emits = defineEmits(['add-product']);

const searchTerm = ref('');
const filteredProducts = ref([]);

// Identifica si la búsqueda parece venir de un lector de código de barras
const isBarcodeSearch = (value) => /^\d{8,}$/.test(value.trim());

// Ejecuta la búsqueda con lógica separada
const performSearch = (value) => {
  const term = value.trim().toLowerCase();

  if (!term) {
    filteredProducts.value = props.products;
    return;
  }

  if (isBarcodeSearch(term)) {
    // Buscar solo en productos con SKU válido
    filteredProducts.value = props.products.filter(p =>
      p.sku && p.sku !== '0' && p.sku !== 0 &&
      String(p.sku).toLowerCase().includes(term)
    );
  } else {
    // Buscar por descripción en todos los productos
    filteredProducts.value = props.products.filter(p =>
      p.description?.toLowerCase().includes(term)
    );
  }
};

// Debounce para evitar búsqueda excesiva
const debounce = (fn, delay = 400) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const debouncedSearch = debounce(performSearch, 300);

// Reacción al input del usuario
watch(searchTerm, (newVal) => {
  debouncedSearch(newVal);
});

// Mostrar todos los productos por defecto
filteredProducts.value = props.products;

const handleEnter = () => {
  const term = searchTerm.value.trim().toLowerCase();

  if (!term || !isBarcodeSearch(term)) return;

  const matchingProduct = filteredProducts.value[0];
  if (matchingProduct) {
    emits('add-product', matchingProduct);
    searchTerm.value = ''; // Limpia el input si deseas
    filteredProducts.value = props.products; // Reinicia la lista
  }
};

// set focus to input on mount and searchTerm change and after 100ms of inactivity
watch(searchTerm, () => {
  setTimeout(() => {
    const input = document.querySelector('input');
    if (input) {
      input.focus();
    }
  }, 100);
})

onMounted(() => {
  setTimeout(() => {
    const input = document.querySelector('input');
    if (input) {
      input.focus();
    }
  }, 100);
});

</script>
