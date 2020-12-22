export const SET_EQUIPO_SELECCIONADO = 'SET_EQUIPO_SELECCIONADO'
export const SET_APLICAR_FILTRO = 'SET_APLICAR_FILTRO'
export const SET_DESDE = 'SET_DESDE'
export const SET_HASTA = 'SET_HASTA'
export const SET_FECHA = 'SET_FECHA'
export const SET_MODAL_EDITAR_CONFIGURACION_MIN_TIEMPO_ALARMA =
  'SET_MODAL_EDITAR_CONFIGURACION_MIN_TIEMPO_ALARMA'

const mutations = {
  [SET_EQUIPO_SELECCIONADO](state, equipoSeleccionado) {
    state.equipoSeleccionado = equipoSeleccionado
  },
  [SET_APLICAR_FILTRO](state) {
    state.aplicarFiltro = !state.aplicarFiltro
  },
  [SET_DESDE](state, desde) {
    state.desde = desde
  },
  [SET_HASTA](state, hasta) {
    state.hasta = hasta
  },
  [SET_FECHA](state, fecha) {
    state.fecha = fecha
  },
  [SET_MODAL_EDITAR_CONFIGURACION_MIN_TIEMPO_ALARMA](state, modal) {
    state.modalEditarConfiguracionMinTiempoAlarma = modal
  }
}

export default mutations
