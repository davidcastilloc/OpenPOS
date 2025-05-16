export default defineEventHandler(async (event) => {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFRtIyMqDBx-AjNGGXuamUcD-hguFU4ZSmUfSLBevxgr3JWxECCBiV6jc41pe1KBn4E8X821guf6Qp/pub?output=csv'
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
