// server/api/sheet-data.ts
export default defineEventHandler(async () => {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFRtIyMqDBx-AjNGGXuamUcD-hguFU4ZSmUfSLBevxgr3JWxECCBiV6jc41pe1KBn4E8X821guf6Qp/pub?output=csv'
  const cacheKey = 'sheet-data'
  const cacheDuration = 60 * 60 * 4 // 4 horas en segundos

  const storage = useStorage()

  // Verifica si hay datos en caché
  const cached = await storage.getItem<{ timestamp: number, data: any }>(`cache:${cacheKey}`)
  const now = Date.now()

  if (cached && now - cached.timestamp < cacheDuration * 1000) {
    return {
      success: true,
      cached: true,
      updated: new Date(cached.timestamp).toISOString(),
      rows: cached.data
    }
  }

  // Si no hay datos en caché o expiraron, consulta de nuevo
  const csvText = await $fetch<string>(csvUrl)

  const lines = csvText.trim().split('\n').map(line => line.split(','))
  const headers = lines.shift()?.map(h => h.trim()) || []

  const numberFields = ['id', 'p_divisa', 'p_bs', 'iva']

  const data = lines.map(row => {
    return Object.fromEntries(
      row.map((value, index) => {
        const key = headers[index]
        const trimmed = value.trim()
        const parsed = numberFields.includes(key) ? Number(trimmed) || 0 : trimmed
        return [key, parsed]
      })
    )
  })

  // Guarda en caché
  await storage.setItem(`cache:${cacheKey}`, {
    timestamp: now,
    data
  })

  return {
    success: true,
    cached: false,
    updated: new Date(now).toISOString(),
    rows: data
  }
})
