import { useApiCedula } from "~/composables/useApiCedula"

export default defineEventHandler(async (event) => {
  const getRouteParam = getRouterParams(event)
  const cedula = getRouteParam.cedula as string
  console.log(cedula)
  if (!cedula) {
    throw createError({
      statusCode: 400,
      message: 'Cedula parameter is required'
    })
  }
  const { data, error, fetchCedula } = useApiCedula()
  console.log("Consultando data")
  await fetchCedula(cedula)
  if(error.value) throw createError({
    statusCode: 400,
    message: "Usuario no encontrado"  
  })
  return data.value.data
})
