import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    activeOrders: [],
    orderHistory: [],
    orderStats: {
      waiting: 0,
      inProgress: 0,
      ready: 0,
      totalToday: 0
    }
  }),

  getters: {
    getOrderById: (state) => (id) => {
      return state.activeOrders.find(order => order.id === id)
    },

    getTotalOrders: (state) => state.activeOrders.length,

    getOrdersByStatus: (state) => (status) => {
      return state.activeOrders.filter(order => order.status === status)
    }
  },

  actions: {
    async fetchActiveOrders() {
      try {
        // Aqui você faria a chamada real para sua API
        const response = await fetch('api/orders/active')
        if (!response.ok) throw new Error('Failed to fetch orders')

        const data = await response.json()
        this.activeOrders = data
        return data
      } catch (error) {
        console.error('Fetch orders error:', error)
        throw error
      }
    },

    async fetchOrderStats() {
      try {
        // Aqui você faria a chamada real para sua API
        const response = await fetch('api/orders/stats')
        if (!response.ok) throw new Error('Failed to fetch stats')

        const data = await response.json()
        this.orderStats = data
        return data
      } catch (error) {
        console.error('Fetch stats error:', error)
        throw error
      }
    },

    async createOrder(orderData) {
      try {
        const response = await fetch('api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(orderData)
        })

        if (!response.ok) throw new Error('Failed to create order')

        const data = await response.json()
        this.activeOrders.push(data)
        return data
      } catch (error) {
        console.error('Create order error:', error)
        throw error
      }
    },

    async updateOrderStatus(orderId, newStatus) {
      try {
        const response = await fetch(`api/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status: newStatus })
        })

        if (!response.ok) throw new Error('Failed to update order status')

        const data = await response.json()

        // Atualiza o pedido na lista de pedidos ativos
        const index = this.activeOrders.findIndex(order => order.id === orderId)
        if (index !== -1) {
          this.activeOrders[index] = data
        }

        // Atualiza as estatísticas
        await this.fetchOrderStats()

        return data
      } catch (error) {
        console.error('Update order status error:', error)
        throw error
      }
    },

    async finalizeOrder(orderId, paymentData) {
      try {
        const response = await fetch(`api/orders/${orderId}/finalize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(paymentData)
        })

        if (!response.ok) throw new Error('Failed to finalize order')

        const data = await response.json()

        // Remove o pedido da lista de pedidos ativos
        this.activeOrders = this.activeOrders.filter(order => order.id !== orderId)

        // Atualiza as estatísticas
        await this.fetchOrderStats()

        return data
      } catch (error) {
        console.error('Finalize order error:', error)
        throw error
      }
    }
  }
})
