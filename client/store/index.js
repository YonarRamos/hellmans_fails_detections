import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import Alarma from './modules/Alarma/module'
import User from './modules/User/module'
import Socket from './modules/Socket/module'

Vue.use(Vuex)

const createStore = () => {
  return new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules: {
      Alarma,
      User,
      Socket
    }
  })
}

export default createStore
