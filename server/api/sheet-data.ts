export default defineEventHandler(async (event) => {
  // get google_sheets_csv from .env
  const { google_sheets_csv } = import.meta.env
  const csvUrl = google_sheets_csv
  const cacheKey = 'sheet-data'
  const cacheDuration = 60 * 60 * 4 // 4 horas

  const storage = useStorage()
  const query = getQuery(event)
  const useCache = 'cached' in query
  const now = Date.now()

  if (useCache) {
    const cached = await storage.getItem<{ timestamp: number, data: any }>(`cache:${cacheKey}`)
    if (cached && now - cached.timestamp < cacheDuration * 1000) {
      return {
        success: true,
        cached: true,
        updated: new Date(cached.timestamp).toISOString(),
        products: cached.data
      }
    }
  } else {
    // Si no se permite el caché, eliminar cualquier valor anterior
    await storage.removeItem(`cache:${cacheKey}`)
  }

  // Obtener CSV
  let csvText: string
  try {
    csvText = await $fetch<string>(csvUrl)
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Error al obtener datos del Google Sheet',
      data: error
    })
  }

  const lines = csvText.trim().split('\n').map(line => line.split(','))
  const headers = lines.shift()?.map(h => h.trim()) || []

  const numberFields = ['id', 'p_usd', 'p_bs', 'profit', 'sku']

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

  // Guardar en caché solo si el parámetro "cached" existe
  if (useCache) {
    await storage.setItem(`cache:${cacheKey}`, {
      timestamp: now,
      data
    })
  }

  return {
    success: true,
    cached: false,
    updated: new Date(now).toISOString(),
    products: data
  }
})
