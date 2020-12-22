const getters = {
  accessToken(state) {
    return state.accessToken
  },
  auth(state) {
    return state.auth
  },
  user(state) {
    return state.user
  },
  users(state) {
    return state.users
  },
  modalAgregarUser(state) {
    return state.modalAgregarUser
  },
  modalEditarUser(state) {
    return state.modalEditarUser
  },
  modalEliminarUser(state) {
    return state.modalEliminarUser
  },
  modalCambiarPassword(state) {
    return state.modalCambiarPassword
  }
}

export default getters
