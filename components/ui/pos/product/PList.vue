<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- Input de búsqueda -->
    <div class="col-span-2">
      <div class="flex items-center">
        <BaseInput
          ref="searchInputRef"
          type="text"
          class="w-full"
          placeholder="SKU / Barcode"
          v-model="searchTerm"
          @keyup.enter="handleEnter"
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
            <th class="px-6 py-3">Categoria</th>
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
            <td class="px-6 py-4">{{ product.category }}</td>
            <td class="px-6 py-4">Bs {{ (product.p_usd * rate).toFixed(2) }}</td>
            <td>
              <BaseButton @click="() => addProduct(product)">
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
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  products: Array,
  rate: Number,
});

const emits = defineEmits(['add-product']);

const searchTerm = ref('');
const filteredProducts = ref([]);
const isSearching = ref(false);
const searchInputRef = ref(null);

// Enfocar input cuando se agrega un producto
const focusInput = () => {
  nextTick(() => {
    searchInputRef.value?.focus();
  });
};

// Validar si el término parece un código de barras
const isBarcodeSearch = (value) => /^\d{8,}$/.test(value.trim());

// Búsqueda real de productos
const performSearch = (value) => {
  isSearching.value = true;

  const term = value.trim().toLowerCase();

  if (!term) {
    filteredProducts.value = props.products;
    isSearching.value = false;
    return;
  }

  if (isBarcodeSearch(term)) {
    filteredProducts.value = props.products.filter(p =>
      p.sku && p.sku !== '0' && p.sku !== 0 &&
      String(p.sku).toLowerCase().includes(term)
    );
  } else {
    filteredProducts.value = props.products.filter(p =>
      p.description?.toLowerCase().includes(term)
    );
  }

  setTimeout(() => {
    isSearching.value = false;
  }, 100);
};

// Debounce para evitar llamadas excesivas
const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const debouncedSearch = debounce(performSearch, 300);

watch(searchTerm, (newVal) => {
  debouncedSearch(newVal);
});

filteredProducts.value = props.products;

// Agregar producto y limpiar
const addProduct = (product) => {
  emits('add-product', product);
  searchTerm.value = '';
  filteredProducts.value = props.products;
  focusInput();
};

const findProductBySku = (sku) => {
 return props.products.find(p => p.sku === Number(sku));
};

// Enter manual (ej. escáner)
const handleEnter = () => {
  const term = searchTerm.value.trim();
  if (isSearching.value) return;
  if (!term || !isBarcodeSearch(term)) return;
  // Buscar en la lista de productos props.products el sku
  const matchingProduct = findProductBySku(term);
  addProduct(matchingProduct);
  filteredProducts.value = props.products;
  focusInput();
  console.log('SCANEADO')
};

// Autoagrega solo si no estamos buscando
watch(
  filteredProducts,
  (newVal) => {
    if (isSearching.value) return;

    if (newVal.length === 1) {
      addProduct(newVal[0]);
    }
  },
  { deep: true }
);
</script>
