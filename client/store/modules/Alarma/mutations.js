export const SET_ALARMA = 'SET_ALARMA'
export const SET_ALARMAS = 'SET_ALARMAS'
export const SET_MODAL_RECONOCER_ALARMA = 'SET_MODAL_RECONOCER_ALARMA'
export const SET_MODAL_AGREGAR_ALARMA = 'SET_MODAL_AGREGAR_ALARMA'
export const SET_MODAL_EDITAR_ALARMA = 'SET_MODAL_EDITAR_ALARMA'
export const SET_MODAL_ELIMINAR_ALARMA = 'SET_MODAL_ELIMINAR_ALARMA'

const mutations = {
  [SET_ALARMA](state, alarma) {
    state.alarma = alarma
  },
  [SET_ALARMAS](state, alarmas) {
    state.alarmas = alarmas
  },
  [SET_MODAL_RECONOCER_ALARMA](state, modal) {
    state.modalReconocerAlarma = modal
  },
  [SET_MODAL_AGREGAR_ALARMA](state, modal) {
    state.modalAgregarAlarma = modal
  },
  [SET_MODAL_EDITAR_ALARMA](state, modal) {
    state.modalEditarAlarma = modal
  },
  [SET_MODAL_ELIMINAR_ALARMA](state, modal) {
    state.modalEliminarAlarma = modal
  }
}

export default mutations
