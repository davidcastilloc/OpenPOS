<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <h2 class="text-2xl font-bold text-center text-primary">Confirmar Detalles del Recibo</h2>

    <!-- Información del Cliente -->
    <div class="border border-default rounded-xl p-4 space-y-4 ">
      <h3 class="text-lg font-semibold text-muted">Información del Cliente</h3>

      <div class="flex flex-col gap-2">
        <label for="cedula" class="text-sm font-medium">Cédula o RIF</label>
        <BaseInput
          id="cedula"
          v-model="cedulaBusqueda"
          @input="buscarCliente"
          type="text"
          placeholder="Ej: V-12345678"
          class=" w-full"
        />

        <div v-if="clienteEncontrado" class="text-sm text-success">
          <span class="font-semibold">Nombre: </span>{{ clienteEncontrado.name }}
        </div>
        <div v-else-if="cedulaBusqueda.length > 0" class="text-sm text-destructive">
          {{ mensajeError }}
        </div>
      </div>
    </div>

    <!-- Detalles del Recibo -->
    <div class=" border border-default rounded-xl p-4 space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold">Recibo</h2>
      </div>
      <div class="space-y-2 max-h-72 overflow-y-auto">
        <!-- renderizar tabla con la lista de productos-->
        <!-- v-for="producto in order" :key="producto.sku" --> 
        <div class="border-b flex justify-between" v-for="producto in order" :key="producto.sku">
          <div>
            <div class="font-medium">{{ producto.description }}</div>
            <div class="text-sm text-gray-500">Bs {{ producto.price }} x {{ producto.quantity }}</div>
          </div>
          <div class="flex items-center pr-3">
            <span class="font-medium">Bs {{ (producto.price * producto.quantity).toFixed(2) }}</span>
          </div>
        </div>
      </div>
      <div>
        <UiPosOrderSummary
          :subtotalGeneral="subtotalGeneral"
          :ivaGeneral="ivaGeneral"
          :subtotalReduced="subtotalReduced"
          :ivaReduced="ivaReduced"
          :subtotalExempt="subtotalExempt"
          :totalIva="totalIva"
          :total="total"
        />
      </div>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-4">
      <BaseButton @click="cancelar" variant="destructive" >
        Cancelar
      </BaseButton>
      <BaseButton
        variant="primary" 
        :disabled="!clienteEncontrado"
        @click="confirmarYImprimir"
      >
        Confirmar e Imprimir.
      </BaseButton >
    </div>
  </div>
</template>

<script lang="ts" setup>

interface Producto {
  sku: string
  description: string
}

interface ProductoOrden extends Producto {
  price: number
  quantity: number
}

interface Cliente {
  id: string
  name: string
}

// Props
const props = withDefaults(defineProps<{
  order: ProductoOrden[]
  subtotalGeneral: number
  ivaGeneral: number
  subtotalReduced: number
  ivaReduced: number
  subtotalExempt: number
  totalIva: number
  total: number
}>(), {
  order: () => [],
  subtotalGeneral: 0,
  ivaGeneral: 0,
  subtotalReduced: 0,
  ivaReduced: 0,
  subtotalExempt: 0,
  totalIva: 0,
  total: 0,
})

// Emits
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm', payload: {
    cliente: Cliente
    items: ProductoOrden[]
    subtotal: number
    total: number
  }): void
}>()


// Base de datos simulada de clientes (contexto Venezuela)
const clientesSimulados = ref<Cliente[]>([
  { id: 'V-12345678', name: 'Carlos Pérez' },
  { id: 'J-87654321', name: 'Ferretería El Tornillo' },
  { id: 'V-11223344', name: 'Ana María Rodríguez' },
])

// Estado de búsqueda
const cedulaBusqueda = ref('')
const clienteEncontrado = ref<Cliente | null>(null)
const mensajeError = ref('')

// Métodos
const buscarCliente = () => {
  const cedula = cedulaBusqueda.value.trim().toUpperCase()
  const cliente = clientesSimulados.value.find(c => c.id === cedula)

  if (cliente) {
    clienteEncontrado.value = cliente
    mensajeError.value = ''
  } else {
    clienteEncontrado.value = null
    mensajeError.value = 'Cliente no encontrado'
  }
}

const cancelar = () => {
  emit('cancel')
}

const confirmarYImprimir = () => {
  if (clienteEncontrado.value) {
    emit('confirm', {
      cliente: clienteEncontrado.value,
      items: props.order,
      subtotal:
        props.subtotalGeneral + props.subtotalReduced + props.subtotalExempt,
      total: props.total
    })
  }
}
</script>
