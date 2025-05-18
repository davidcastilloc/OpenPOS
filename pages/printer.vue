<template>
  <div ref="reciboImprimir">
    <h1>{{ reciboData.empresa }}</h1>
    <p>{{ reciboData.direccion }}</p>
    <p>RIF: {{ reciboData.rif }}</p>
    <p>Teléfono: {{ reciboData.telefono }}</p>
    <hr>
    <h2>Cliente</h2>
    <p>Nombre: {{ reciboData.cliente.primer_nombre }} {{ reciboData.cliente.primer_apellido }}</p>
    <p>C.I./RIF: {{ reciboData.cliente.nacionalidad }}-{{ reciboData.cliente.cedula || reciboData.cliente.rif }}</p>
    <p>Fecha: {{ formatDate(reciboData.cliente.request_date) }}</p>
    <hr>
    <h2>Productos</h2>
    <table>
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Cant.</th>
          <th>Precio (Bs)</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in reciboData.items"
          :key="item.id"
        >
          <td>{{ item.description }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ formatPrice(item.p_bs) }}</td>
        </tr>
      </tbody>
    </table>
    <hr>
    <p style="text-align: right;">
      Subtotal (RED.): {{ formatPrice(reciboData.subtotalReduced) }}
    </p>
    <p style="text-align: right;">
      IVA (RED.): {{ formatPrice(reciboData.ivaReduced) }}
    </p>
    <hr>
    <h2 style="text-align: right;">
      Total: {{ formatPrice(reciboData.total) }}
    </h2>
    <p style="text-align: center;">
      ¡Gracias por su compra!
    </p>
  </div>
  <button @click="imprimirRecibo">
    Imprimir Recibo
  </button>
</template>

<script setup>
import { ref } from 'vue';

const reciboImprimir = ref(null);
const reciboData = ref({
  empresa: 'ABASTOS CENTRAL C.A.',
  direccion: 'Av. Principal de La Trinidad, Caracas',
  rif: 'J-12345678-9',
  telefono: '0212-5551122',
  cliente: {
    cedula: 24980047,
    fecha_nac: '1995-05-05',
    nacionalidad: 'V',
    primer_apellido: 'CASTILLO',
    primer_nombre: 'DAVID',
    request_date: '2025-05-17T10:10:48.916Z',
    rif: 'V249800471',
    segundo_apellido: 'CIRILO',
    segundo_nombre: 'JOSE',
  },
  items: [
    {
      category: 'ADEREZOS',
      description: 'FRITZ PREPARADO MAYONESA 1KG',
      id: 1,
      iva_rate: 'reduced',
      p_bs: 291.87,
      p_usd: 3.08,
      quantity: 3,
      sku: 7591902004348,
    },
    {
      category: 'ADEREZOS',
      description: 'FRITZ MOSTAZA DOYPACK 160GR',
      id: 2,
      iva_rate: 'reduced',
      p_bs: 74.86,
      p_usd: 0.79,
      quantity: 3,
      sku: 0,
    },
  ],
  ivaGeneral: 0,
  ivaReduced: 88.01520000000001,
  subtotalExempt: 0,
  subtotalGeneral: 0,
  subtotalReduced: 1100.19,
  total: 1188.2052,
  totalIva: 88.01520000000001,
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const formatPrice = (price) => {
  return price.toFixed(2);
};

const imprimirRecibo = () => {
  if (reciboImprimir.value) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Recibo</title><style>');
    // Estilos CSS básicos para la impresión (puedes ajustarlos)
    printWindow.document.write(`
      body { font-family: monospace; font-size: 10px; }
      h1, h2, h3, p { margin: 5px 0; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border-bottom: 1px solid #ccc; padding: 2px 5px; text-align: left; }
      th:nth-child(2), td:nth-child(2) { text-align: center; }
      th:nth-child(3), td:nth-child(3) { text-align: right; }
      hr { border: 1px dashed #ccc; margin: 10px 0; }
      .text-right { text-align: right; }
      .text-center { text-align: center; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(reciboImprimir.value.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};
</script>

<style scoped>
/* Estilos para la visualización en pantalla (opcional) */
.recibo-imprimir {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
}
h1 {
  text-align: center;
}
</style>
