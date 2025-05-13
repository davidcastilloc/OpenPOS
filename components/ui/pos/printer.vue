<template>
  <div>
    <div ref="ticketRef">
      <h3>¡Gracias por tu compra!</h3>
      <p>Producto: Arepa Flame</p>
      <p>Total: $5.99</p>
    </div>
    <button @click="imprimir">Imprimir Ticket</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const ticketRef = ref<HTMLElement>()

async function imprimir() {
  if (!ticketRef.value) return

  // Extrae el texto
  const contenido = ticketRef.value.innerText

  // try {
  //   const res = await $fetch('/api/print', {
  //     method: 'POST',
  //     body: { text: contenido }
  //   })
  //   if ((res as any).success) {
  //     alert('Ticket enviado a la impresora ✔️')
  //   } else {
  //     alert('Error: ' + (res as any).message)
  //   }
  // } catch (e: any) {
  //   alert('Fallo en la petición: ' + e.message)
  // }
  const port = await (navigator as any).serial.requestPort()
  await port.open({ baudRate: 9600 })
  const writer = port.writable.getWriter()
  const data = new TextEncoder().encode(ticketRef.value.innerText + '\n')
  await writer.write(data)
  writer.releaseLock()
  await port.close()
}
</script>
