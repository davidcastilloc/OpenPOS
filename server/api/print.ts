// server/api/print.ts
import { defineEventHandler, readBody } from 'h3'
import { SerialPort } from 'serialport'

let printer: SerialPort

// Función lazy para inicializar el puerto solo una vez
function getPrinter() {
  if (!printer) {
    printer = new SerialPort({
      path: process.env.PRINTER_PORT || 'COM3',  // o usa .env
      baudRate: Number(process.env.PRINTER_BAUD || 9600),
    })
  }
  return printer
}

export default defineEventHandler(async (event) => {
  const { text } = await readBody<{ text: string }>(event)

  if (!text) {
    event.node.res.statusCode = 400
    return { error: 'No hay texto para imprimir' }
  }

  return new Promise((resolve) => {
    getPrinter().write(text + '\n', (err) => {
      if (err) {
        event.node.res.statusCode = 500
        resolve({ success: false, message: err.message })
      } else {
        resolve({ success: true })
      }
    })
  })
})
