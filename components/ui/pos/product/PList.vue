<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="col-span-2">
      <div class="flex items-center">
        <BaseInput
          ref="searchInputRef"
          id="sku"
          type="text"
          class="w-full z-50"
          placeholder="SKU / Barcode"
          v-model="searchTerm"
          @keyup.enter="handleEnter"
          tabindex="1"
        />
      </div>
    </div>

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
const inactivityTimeout = ref(null);
const inactivityTime = 5000; // Tiempo de inactividad en milisegundos (ej: 5 segundos)

// Enfocar input
const focusInput = () => {
  nextTick(() => {
    document.getElementById('sku').focus()
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
  resetInactivityTimer(); // Reiniciar el timer al escribir
});

filteredProducts.value = props.products;

// Agregar producto y limpiar
const addProduct = (product) => {
  emits('add-product', product);
  searchTerm.value = '';
  filteredProducts.value = props.products;
  focusInput();
  resetInactivityTimer(); // Reiniciar el timer al agregar producto
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
  if (matchingProduct) {
    addProduct(matchingProduct);
    filteredProducts.value = props.products;
    focusInput();
    console.log('SCANEADO');
  }
  resetInactivityTimer(); // Reiniciar el timer al presionar Enter
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

// Detectar inactividad
const resetInactivityTimer = () => {
  clearTimeout(inactivityTimeout.value);
  inactivityTimeout.value = setTimeout(focusInput, inactivityTime);
};

// Inicializar el timer al montar el componente
onMounted(() => {
  resetInactivityTimer();

  // Reiniciar el timer en eventos de interacción del usuario
  window.addEventListener('mousemove', resetInactivityTimer);
  window.addEventListener('keypress', resetInactivityTimer);
  window.addEventListener('click', resetInactivityTimer);
});

// Limpiar el timer al desmontar el componente
onUnmounted(() => {
  clearTimeout(inactivityTimeout.value);
  window.removeEventListener('mousemove', resetInactivityTimer);
  window.removeEventListener('keypress', resetInactivityTimer);
  window.removeEventListener('click', resetInactivityTimer);
});
</script>