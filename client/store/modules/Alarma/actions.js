import { SET_ALARMAS } from './mutations'
import axios from '@/plugins/axios'

const actions = {
  async getAllAlarmas(context, payload) {
    payload = payload ? payload : {}
    await axios
      .get('alarmas', { params: payload.params })
      .then(response => {
        context.commit(SET_ALARMAS, response.data)
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async createAlarma(context, payload) {
    await axios
      .post('alarmas', payload.content)
      .then(response => {
        context.dispatch('getAllAlarmas')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async updateAlarma(context, payload) {
    await axios
      .put(`alarmas/${payload.content.id}`, payload.content)
      .then(response => {
        context.dispatch('getAllAlarmas')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async deleteAlarma(context, payload) {
    await axios
      .delete(`alarmas/${payload.content.id}`)
      .then(response => {
        context.dispatch('getAllAlarmas')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

export default actions
