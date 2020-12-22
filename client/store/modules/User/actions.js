import { SET_USERS, SET_AUTH, SET_ACCESS_TOKEN } from './mutations'
import axios from '@/plugins/axios'
import Cookie from 'js-cookie'
const cookieparser = process.server ? require('cookieparser') : undefined

const actions = {
  nuxtServerInit({ commit }, { req }) {
    let accessToken = null
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        accessToken = parsed.accessToken
        auth = JSON.parse(parsed.auth)
      } catch (err) {}
    }
    if (accessToken) {
      commit('SET_ACCESS_TOKEN', accessToken)
      commit('SET_AUTH', auth)
    } else {
      commit('SET_ACCESS_TOKEN', null)
      commit('SET_AUTH', {
        type: ''
      })
    }
  },

  async getAllUsers(context, payload) {
    payload = payload ? payload : {}
    await axios
      .get('users', { params: payload.params })
      .then(response => {
        context.commit(SET_USERS, response.data)
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async whoIsAccount(context, payload) {
    await axios
      .get('who_is', {
        headers: { Authorization: `Bearer ${this.state.User.accessToken}` }
      })
      .then(response => {
        context.commit(SET_AUTH, response.data)
        Cookie.set('auth', response.data)
      })
      .catch(error => {
        console.log(error)
      })
  },

  async loginAccount(context, payload) {
    await axios
      .post('login', payload.content)
      .then(async response => {
        context.commit(SET_ACCESS_TOKEN, response.data.token)
        await context.dispatch('whoIsAccount')
        Cookie.set('accessToken', response.data.token)
        window.location.reload()
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async changePasswordAccount(context, payload) {
    await axios
      .put('users/cambiar_password', payload.content)
      .then(response => {})
      .catch(error => {
        console.log(error)
      })
  },

  async logoutAccount(context) {
    Cookie.remove('accessToken')
    Cookie.remove('auth')
    context.commit(SET_AUTH, {
      type: ''
    })
    context.commit(SET_ACCESS_TOKEN, null)
    window.location.reload()
    return Promise.resolve(true)
  },

  async createUser(context, payload) {
    await axios
      .post('users', payload.content)
      .then(response => {
        context.dispatch('getAllUsers')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async updateUser(context, payload) {
    await axios
      .put(`users/${payload.content.id}`, payload.content)
      .then(response => {
        context.dispatch('getAllUsers')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async deleteUser(context, payload) {
    await axios
      .delete(`users/${payload.content.id}`)
      .then(response => {
        context.dispatch('getAllUsers')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

export default actions
