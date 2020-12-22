'use strict';

const _ = require('lodash');
const moment = require('moment');
const Estado = use('App/Models/Estado');
const Ruteo = use('App/Models/Ruteo');
const Equipo = use('App/Models/Equipo');
const JerarquiaRuteo = require('./JerarquiaRuteo');

var FiltroDatos = {
  async despreciarRuidosEstados(estados, equipo, tiempo, desde, hasta) {
    if (estados.length > 0) {
      // Filtra estados que se vuelve a registrar aunque el valor no cambie
      estados = await this.filtraDatosRepetidosConsecutivamente(estados);

      // Consulto ultimo estado y los agrego al array de estados
      let estadoPrevio = await this.buscaDatoPrevio('estado', equipo, desde);

      if (estadoPrevio) {
        estados.unshift({
          DateTime: estadoPrevio.fecha,
          TagName: estados.TagName,
          Value: estadoPrevio.estado
        });
      }

      // Filtra estados con duracion menor a la pedida
      estados = await this.filtraDatosConPocaDuracion(estados, tiempo, hasta);

      // Vuelve a filtrar estados que se vuelve a registrar aunque el valor no cambie
      estados = await this.filtraDatosRepetidosConsecutivamente(estados);

      return estados;
    }
    return [];
  },

  async despreciarRuidosRuteos(ruteos, equipo, tiempo, desde, hasta) {
    if (ruteos.length > 0) {
      const ruteosAgrupadoPorTag = _.groupBy(ruteos, 'TagName');
      let ruteosFiltradosAgrupadosPorTag = [];

      for (const key in ruteosAgrupadoPorTag) {
        // Filtra ruteos que se vuelve a registrar aunque el valor no cambien
        let ruteosPorTag = await this.filtraDatosRepetidosConsecutivamente(
          ruteosAgrupadoPorTag[key]
        );

        // Filtra ruteos con duracion menor a la pedida
        ruteosPorTag = await this.filtraDatosConPocaDuracion(ruteosPorTag, tiempo, hasta);

        // Vuelve a ruteos estados que se vuelve a registrar aunque el valor no cambien
        ruteosPorTag = await this.filtraDatosRepetidosConsecutivamente(ruteosPorTag);

        // Agrego datos a array
        ruteosFiltradosAgrupadosPorTag.push(ruteosPorTag);
      }
      // Cocateno todo en un unico array y ordeno
      ruteos = ruteosFiltradosAgrupadosPorTag
        .reduce((a, b) => a.concat(b))
        .sort((a, b) => {
          if (a.DateTime > b.DateTime) {
            return 1;
          }
          if (a.DateTime < b.DateTime) {
            return -1;
          }
          return 0;
        });
      ruteos = JerarquiaRuteo.agragaJerarquiaDeOrden(ruteos, equipo);

      // Agrupo array por fecha y calculo valor de ruteo
      let ruteosAgrupadosPorFecha = _.groupBy(ruteos, 'DateTime');
      let ruteoFormateado = [];

      for (const key in ruteosAgrupadosPorFecha) {
        ruteosAgrupadosPorFecha[key] = ruteosAgrupadosPorFecha[key].sort((a, b) => {
          if (a.orden > b.orden) {
            return 1;
          }
          if (a.orden < b.orden) {
            return -1;
          }
          return 0;
        });
        const valorRuteo = JerarquiaRuteo.defineValorRuteo(ruteosAgrupadosPorFecha[key]);
        ruteoFormateado.push({
          fecha: new Date(key),
          ruteo: valorRuteo,
          equipo_id: equipo.id
        });
      }

      return ruteoFormateado;
    }
    return [];
  },

  async filtraDatosRepetidosConsecutivamente(estados) {
    return estados.filter((estado, i) => {
      if (i > 0) {
        const estadoActual = estados[i].Value;
        const estadoAnterior = estados[i - 1].Value;

        if (estadoActual === estadoAnterior) {
          return false;
        }
      }
      return true;
    });
  },

  async filtraDatosConPocaDuracion(estados, tiempo, hasta) {
    estados.push({
      DateTime: hasta,
      TagName: estados[0].TagName,
      Value: -1
    });

    estados = estados.filter((estado, i) => {
      if (i < estados.length - 1) {
        const fechaActual = moment(estados[i].DateTime);
        const fechaProximo = moment(estados[i + 1].DateTime);

        const diff = fechaProximo.diff(fechaActual, 'seconds');
        if (diff > tiempo) {
          return true;
        }
      }
    });

    return estados;
  },

  async buscaDatoPrevio(tipo, equipo, fecha) {
    let estadoPrevio;

    if (tipo === 'estado') {
      estadoPrevio = await Estado.query()
        .where('fecha', '<', fecha)
        .where('equipo_id', equipo.id)
        .orderBy('fecha', 'DESC')
        .pickInverse();

      estadoPrevio = estadoPrevio.toJSON();
    }

    if (tipo === 'ruteo') {
      estadoPrevio = await Ruteo.query()
        .where('fecha', '<', fecha)
        .where('equipo_id', equipo.id)
        .orderBy('fecha', 'DESC')
        .pickInverse();

      estadoPrevio = estadoPrevio.toJSON();
    }

    if (estadoPrevio.length > 0) {
      return estadoPrevio[0];
    }

    return estadoPrevio;
  }
};

module.exports = FiltroDatos;
