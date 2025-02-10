// Utilities
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [],
    activeOrders: [],
    completedOrders: []
  })
})
