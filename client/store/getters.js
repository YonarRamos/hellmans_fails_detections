const getters = {
  equipoSeleccionado(state) {
    return state.equipoSeleccionado
  },
  aplicarFiltro(state) {
    return state.aplicarFiltro
  },
  desde(state) {
    return state.desde
  },
  hasta(state) {
    return state.hasta
  },
  fecha(state) {
    return state.fecha
  },
  modalEditarConfiguracionMinTiempoAlarma(state) {
    return state.modalEditarConfiguracionMinTiempoAlarma
  }
}

export default getters
