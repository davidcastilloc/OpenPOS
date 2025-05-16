// server/api/sheet-data.ts
export default defineEventHandler(async () => {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFRtIyMqDBx-AjNGGXuamUcD-hguFU4ZSmUfSLBevxgr3JWxECCBiV6jc41pe1KBn4E8X821guf6Qp/pub?output=csv'

  // Fetch CSV
  const csvText = await $fetch<string>(csvUrl)

  // Convert CSV to JSON
  const lines = csvText.trim().split('\n').map(line => line.split(','))
  const headers = lines.shift() || []

  const data = lines.map(row =>
    Object.fromEntries(row.map((value, index) => [headers[index], value]))
  )

  return {
    success: true,
    items: data
  }
})
