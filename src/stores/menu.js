// Utilities
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    products: [],
    categories: []
  })
})
