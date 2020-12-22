const getters = {
  alarma(state) {
    return state.alarma
  },
  alarmas(state) {
    return state.alarmas
  },
  modalReconocerAlarma(state) {
    return state.modalReconocerAlarma
  },
  modalAgregarAlarma(state) {
    return state.modalAgregarAlarma
  },
  modalEditarAlarma(state) {
    return state.modalEditarAlarma
  },
  modalEliminarAlarma(state) {
    return state.modalEliminarAlarma
  }
}

export default getters
