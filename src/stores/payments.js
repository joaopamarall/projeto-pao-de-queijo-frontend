import { defineStore } from "pinia";

export const usePaymentStore = defineStore('payments', {
  state: () => ({
    transactions: [],
    dailyTotal: 0
  })
})
