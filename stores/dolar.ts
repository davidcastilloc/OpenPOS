import { defineStore } from 'pinia'

export const useMyDolarStore = defineStore('myDolarStore', 
  {
    state: () => ({
      dolar: 0,
    }),
    getters: {
      getDolar: state => state.dolar,
    },
    actions: {
      setDolar(dolar: number) {
        this.dolar = dolar;
      },
      fetchDolar() {
        const dolar = ref(0)
        const url = 'https://pydolarve.org/api/v2/dollar?page=bcv&format_date=default&rounded_price=true%27'
        fetch(url)
          .then(response => response.json())
          .then(data => {
            this.dolar = data['monitors'].usd.price
          })
          .catch(error => {
            console.error('Error:', error)
          })
        return dolar
      }
    },
  }
)
