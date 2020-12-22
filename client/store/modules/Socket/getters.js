const getters = {
  datosSocket(state) {
    return state.datosSocket
  },
  alarmasNotificadas(state) {
    return state.alarmasNotificadas
  },
  alarmasSinReconocerSocket(state) {
    return state.alarmasSinReconocerSocket
  }
}

export default getters
