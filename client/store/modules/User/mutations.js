export const SET_USER = 'SET_USER'
export const SET_AUTH = 'SET_AUTH'
export const SET_USERS = 'SET_USERS'
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
export const SET_MODAL_AGREGAR_USER = 'SET_MODAL_AGREGAR_USER'
export const SET_MODAL_EDITAR_USER = 'SET_MODAL_EDITAR_USER'
export const SET_MODAL_ELIMINAR_USER = 'SET_MODAL_ELIMINAR_USER'
export const SET_MODAL_CAMBIAR_PASSWORD = 'SET_MODAL_CAMBIAR_PASSWORD'

const mutations = {
  [SET_USER](state, user) {
    state.user = user
  },
  [SET_AUTH](state, auth) {
    state.auth = auth
  },
  [SET_ACCESS_TOKEN](state, accessToken) {
    state.accessToken = accessToken
  },
  [SET_USERS](state, users) {
    state.users = users
  },
  [SET_MODAL_AGREGAR_USER](state, modal) {
    state.modalAgregarUser = modal
  },
  [SET_MODAL_EDITAR_USER](state, modal) {
    state.modalEditarUser = modal
  },
  [SET_MODAL_ELIMINAR_USER](state, modal) {
    state.modalEliminarUser = modal
  },
  [SET_MODAL_CAMBIAR_PASSWORD](state, modal) {
    state.modalCambiarPassword = modal
  }
}

export default mutations
