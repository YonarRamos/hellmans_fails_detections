'use strict'

const moment = require('moment')

module.exports = {
  getDesdeTurno() {
    let horaActual = moment().format('H')
    let start = moment().format('YYYY-MM-DD')
    let turnoNoche = 22
    let turnoTarde = 14
    let turnoManana = 6

    if (horaActual >= turnoNoche) {
      start = moment(start).add(22, 'hours')
    }
    if (horaActual == 0) {
      start = moment(start).add(22, 'hours')
    } else if (horaActual >= turnoTarde) {
      start = moment(start).add(14, 'hours')
    } else if (horaActual >= turnoManana) {
      start = moment(start).add(6, 'hours')
    } else {
      start = moment(start).add(22, 'hours')
      start = moment(start).add(-1, 'days')
    }

    return start
  },

  getDesdeDia() {
    let horaActual = moment().format('H')
    let start = moment().format('YYYY-MM-DD')

    if (horaActual >= 6) {
      start = moment(start).add(6, 'hours')
    } else if (horaActual === 0) {
      start = moment(start).add(6, 'hours')
    } else if (horaActual <= 6) {
      start = moment(start).add(-1, 'day')
      start = moment(start).add(6, 'hours')
    }

    return start
  }
}
