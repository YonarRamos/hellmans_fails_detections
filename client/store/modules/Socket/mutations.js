export const SOCKET = 'SOCKET'

const mutations = {
  [SOCKET](state, ws) {
    ws.connect()
    const channel = ws.subscribe('socket')

    channel.on('notificacion_estados', datos => {
      if (datos) {
        const datosSocket = JSON.parse(datos)
        state.datosSocket = datosSocket

        const alarmas = datosSocket
          .map(dato => dato.alarmas)
          .reduce((a, b) => a.concat(b))
        state.alarmasNotificadas = alarmas
      }
    })

    channel.on('cantidad_alarmas_sin_reconocer', data => {
      state.alarmasSinReconocerSocket = data
    })
  }
}

export default mutations
