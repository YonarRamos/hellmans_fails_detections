'use strict';

const moment = require('moment');
const Redis = use('Redis');
const Configuracion = use('App/Models/Configuracion');

var FechaAdquisicion = {
  async arrayIteraciones(desde, hasta) {
    // Saco 3 minutos para compensar hora con la del servidor
    const salto = 'hours';
    desde = moment(desde);
    hasta = moment(hasta);

    let i = 0;
    let arrayIteraciones = [];
    const iteraciones = hasta.diff(desde, salto);

    if (iteraciones === 0) {
      arrayIteraciones.push({
        desde: desde.toDate(),
        hasta: hasta.toDate()
      });
    } else {
      let fechaInicial = moment(desde);

      for (i; i < iteraciones + 1; i++) {
        arrayIteraciones.push({
          desde: fechaInicial.toDate(),
          hasta: fechaInicial.add(1, salto).toDate()
        });
      }
      arrayIteraciones[arrayIteraciones.length - 1].hasta = hasta.toDate();

      arrayIteraciones = arrayIteraciones.filter(item => {
        if (item.desde !== item.hasta) {
          return true;
        }
      });
    }

    return arrayIteraciones;
  },
  async fechaNotificacion() {
    let tipoAdquisicion = await Configuracion.query()
      .where('tag', 'TIPO_ADQUISICION')
      .first();
    tipoAdquisicion = tipoAdquisicion.toJSON();

    let desde = null;
    let hasta = null;
    const fecha = moment();

    if (tipoAdquisicion.valor !== 'Dia') {
      desde = new Date(
        moment(fecha)
          .format('YYYY-MM-DD') + ' 06:00:00'
      );
      hasta = new Date(moment(fecha).format('YYYY-MM-DD') + ' 06:00:00');
    } else {
      const horaActual = moment(fecha).format('HH');

      // Turno mañana
      if (horaActual >= 6 && horaActual < 14) {
        desde = new Date(moment(fecha).format('YYYY-MM-DD') + ' 06:00:00');
        hasta = new Date(moment(fecha).format('YYYY-MM-DD') + ' 14:00:00');
      }

      // Turno tarde
      if (horaActual >= 14 && horaActual < 22) {
        desde = new Date(moment(fecha).format('YYYY-MM-DD') + ' 14:00:00');
        hasta = new Date(moment(fecha).format('YYYY-MM-DD') + ' 22:00:00');
      }

      // Turno tarde
      if (horaActual >= 22 && horaActual <= 23) {
        desde = new Date(moment(fecha).format('YYYY-MM-DD') + ' 22:00:00');
        hasta = new Date(
          moment(fecha)
            .add(1, 'days')
            .format('YYYY-MM-DD') + ' 06:00:00'
        );
      }
      if (horaActual >= 0 && horaActual < 6) {
        desde = new Date(moment(fecha).format('YYYY-MM-DD') + ' 22:00:00');
        hasta = new Date(
          moment(fecha)
            .add(1, 'days')
            .format('YYYY-MM-DD') + ' 06:00:00'
        );
      }
    }

    return [desde, new Date(moment().add(-3, 'hours').format('YYYY-MM-DD HH:mm:ss'))];
  }
};

module.exports = FechaAdquisicion;
