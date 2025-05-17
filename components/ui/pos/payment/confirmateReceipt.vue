<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <h2 class="text-2xl font-bold text-center text-primary">Confirmar Detalles del Recibo</h2>

    <!-- Información del Cliente -->
    <div class="border border-default rounded-xl p-4 space-y-4 ">
      <h3 class="text-lg font-semibold text-muted">Información del Cliente</h3>

      <div class="flex flex-col gap-2">
        <label for="cedula" class="text-sm font-medium">Cédula o RIF</label>
        <BaseInput id="cedula" v-model="cedulaBusqueda" @keyup.enter="buscarCliente" type="text"
          placeholder="Ej: V-12345678" class=" w-full" />

        <div v-if="clienteEncontrado" class="text-sm text-success">
          <div class="grid grid-cols-2 gap-2">
            <span class="text-sm"><strong>Nacionalidad:</strong> {{ clienteEncontrado.nacionalidad }}</span>
            <span class="text-sm"><strong>Cédula:</strong> {{ clienteEncontrado.cedula }}</span>
            <span class="text-sm"><strong>RIF:</strong> {{ clienteEncontrado.rif }}</span>
            <span class="text-sm"><strong>Fecha Nac.:</strong> {{ clienteEncontrado.fecha_nac }}</span>
            <span class="text-sm"><strong>Primer Nombre:</strong> {{ clienteEncontrado.primer_nombre }}</span>
            <span class="text-sm"><strong>Segundo Nombre:</strong> {{ clienteEncontrado.segundo_nombre }}</span>
            <span class="text-sm"><strong>Primer Apellido:</strong> {{ clienteEncontrado.primer_apellido }}</span>
            <span class="text-sm"><strong>Segundo Apellido:</strong> {{ clienteEncontrado.segundo_apellido }}</span>
          </div>
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
        <div class="border-b flex justify-between" v-for="producto in order" :key="producto.sku">
          <div>
            <div class="font-medium">{{ producto.description }}</div>
            <div class="text-sm text-gray-500">Bs {{ producto.p_bs }} x {{ producto.quantity }}</div>
          </div>
          <div class="flex items-center pr-3">
            <span class="font-medium">Bs {{ (producto.p_bs * producto.quantity).toFixed(2) }}</span>
          </div>
        </div>
      </div>
      <div>
        <UiPosOrderSummary :subtotalGeneral="subtotalGeneral" :ivaGeneral="ivaGeneral"
          :subtotalReduced="subtotalReduced" :ivaReduced="ivaReduced" :subtotalExempt="subtotalExempt"
          :totalIva="totalIva" :total="total" />
      </div>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-4">
      <BaseButton @click="cancelar" variant="destructive">
        Cancelar
      </BaseButton>
      <BaseButton variant="primary" :disabled="!clienteEncontrado" @click="confirmarYImprimir">
        Confirmar e Imprimir.
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ProductOrder, Cliente } from '~/types/pos'

// Props
const props = withDefaults(defineProps<{
  order: ProductOrder[]
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
    items: ProductOrder[]
    subtotalGeneral: number
    ivaGeneral: number
    subtotalReduced: number
    ivaReduced: number
    subtotalExempt: number
    totalIva: number
    total: number
  }): void
}>()

// Estado de búsqueda
const cedulaBusqueda = ref('')
const clienteEncontrado = ref<Cliente | null>(null)
const mensajeError = ref('')

// Métodos
const buscarCliente = async () => {
  console.log('Buscando cliente...')
  const cedula = cedulaBusqueda.value.trim().toUpperCase()
  const { data } = await useFetch<Cliente | null>(`/api/client/${cedula}`)

  if (data) {
    clienteEncontrado.value = data.value
    mensajeError.value = ''
  } else {
    clienteEncontrado.value = null
    mensajeError.value = 'Cliente no encontrado'
  }
}

const cancelar = () => {
  emit('cancel')
}

const resetAllTemporalData = () => {
  cedulaBusqueda.value = ''
  clienteEncontrado.value = null
  mensajeError.value = ''
}

const confirmarYImprimir = () => {
  if (!clienteEncontrado.value) {
    console.log('No se encontró el cliente', clienteEncontrado.value)
    return
  }
  emit('confirm', {
    cliente: clienteEncontrado.value,
    items: props.order,
    subtotalGeneral: props.subtotalGeneral,
    ivaGeneral: props.ivaGeneral,
    subtotalReduced: props.subtotalReduced,
    ivaReduced: props.ivaReduced,
    subtotalExempt: props.subtotalExempt,
    totalIva: props.totalIva,
    total: props.total
  })
  resetAllTemporalData()
}
</script>
