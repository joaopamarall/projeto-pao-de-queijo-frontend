// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    isAuthenticated: false,
    token: null,
  }),

  getters: {
    isAdmin: (state) => state.currentUser?.role === 'admin',
    getUserName: (state) => state.currentUser?.name || '',
  },

  actions: {
    async login(username, password) {
      try {
        // Aqui você faria a chamada real para sua API
        const response = await fetch('api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        })

        if (!response.ok) {
          throw new Error('Login failed')
        }

        const data = await response.json()

        this.currentUser = data.user
        this.token = data.token
        this.isAuthenticated = true

        // Salvar token no localStorage se necessário
        localStorage.setItem('token', data.token)

        return true
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async logout() {
      try {
        // Aqui você faria a chamada real para sua API de logout se necessário
        this.currentUser = null
        this.token = null
        this.isAuthenticated = false
        localStorage.removeItem('token')
        return true
      } catch (error) {
        console.error('Logout error:', error)
        throw error
      }
    },

    async checkAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Aqui você faria uma chamada para validar o token com sua API
          const response = await fetch('api/auth/validate', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            this.currentUser = data.user
            this.token = token
            this.isAuthenticated = true
          } else {
            this.logout()
          }
        } catch (error) {
          console.error('Auth check error:', error)
          this.logout()
        }
      }
    }
  }
})
