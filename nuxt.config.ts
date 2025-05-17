// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  nitro: {
    preset: 'node',   // para que se ejecute en un proceso Node.js normal
    routeRules: {
      '/api/pocketbase/**': {
        proxy: { to: 'http://localhost:8090/**' }
      },
      '/api/printer/**': {
        // ROUTE TO PRINTER SERVER FLASK
        proxy: { to: 'http://localhost:5000/**' }
      }
    }
  },
  devtools: { enabled: true },
  modules: [
    '@shuriken-ui/nuxt',
    '@pinia/nuxt'
  ],
  css: [
    '~/assets/css/main.css',
  ],
})
