'use strict';

const Database = use('Database');
const User = use('App/Models/User');
const Adquisicion = require('../Jobs/Adquisicion');
const FiltroDatos = require('../Utils/FiltroDatos');
const FormateaDatos = require('../Utils/FormateaDatos');
const FechaAdquisicion = require('../Utils/FechaAdquisicion');
const Historico = require('../Services/Historico');
const Wonder = require('../Services/Wonder');
const Ruteo = use('App/Models/Ruteo');
const Estado = use('App/Models/Estado');
const Equipo = use('App/Models/Equipo');
const _ = require('lodash');
const mathjs = require('mathjs');
const moment = require('moment');

class Socket {
  async socketEquipo() {
    const fechas = await FechaAdquisicion.fechaNotificacion();
    const desde = fechas[0];
    const hasta = fechas[1];
    console.log(fechas);

    const duracionTotal = moment(hasta).diff(moment(desde), 'seconds');

    let equipos = await Equipo.query()
      .where('notificar_estado', true)
      .with('tags')
      .with('tipo_equipo', builder => {
        builder.with('mapa_estados');
      })
      .with('estados', builder => {
        builder.whereBetween('fecha', [desde, hasta]);
      })
      .with('ruteos', builder => {
        builder.whereBetween('fecha', [desde, hasta]);
      })
      .with('alarmas', builder => {
        builder.whereBetween('fecha', [desde, hasta]);
      })
      .fetch();
    equipos = equipos.toJSON();

    // Consultos estados actuales de los equipos
    const tagsEquipos = equipos
      .map(equipo => {
        return equipo.tags.find(tag => {
          if (tag.tipo_tag_id === 2) {
            return true;
          }
        });
      })
      .filter(tag => {
        if (tag) {
          return true;
        }
      })
      .map(tag => tag.tag);

    const wonder = new Wonder();
    const lives = await wonder.getLive(tagsEquipos);

    for (const equipo of equipos) {
      const estadoPrevio = await Estado.query()
        .where('equipo_id', equipo.id)
        .where('fecha', '<=', desde)
        .orderBy('fecha', 'DESC')
        .first();

      let duracion = 0;
      if (equipo.estados.length > 0) {
        duracion = moment(equipo.estados[0].fecha).diff(moment(desde), 'seconds');
      }

      if (estadoPrevio) {
        equipo.estados.unshift({
          fecha: desde,
          estado: estadoPrevio.estado,
          duracion: duracion,
          equipo_id: equipo.id
        });
      } else {
        equipo.estados.unshift({
          fecha: desde,
          estado: 0,
          duracion: duracion,
          equipo_id: equipo.id
        });
      }
    }

    // Agrego propiedades y valores necesarios para mostrar
    equipos = equipos.map(equipo => {
      // Logica para disponibilidad

      // Agrupo estados
      const estadosAgrupados = _.groupBy(equipo.estados, 'estado');
      let duracionEstados = [];

      // Recorro, sumo su duracion y concateno con detalle de mapa_estados
      for (const key in estadosAgrupados) {
        if (estadosAgrupados[key].length > 0) {
          const duracion = _.sumBy(estadosAgrupados[key], 'duracion');
          const mapa_estado = equipo.tipo_equipo.mapa_estados.find(item => {
            if (item.estado === parseInt(key)) {
              return true;
            }
          });
          if (mapa_estado) {
            duracionEstados.push({
              estado: key,
              nombre: mapa_estado.nombre,
              color_grafico: mapa_estado.color_grafico,
              tiempo_parada: mapa_estado.tiempo_parada,
              tiempo_considerado: mapa_estado.tiempo_considerado,
              duracion: duracion
            });
          } else {
            duracionEstados.push({
              estado: key,
              nombre: 'No definido',
              color_grafico: '#fff',
              tiempo_parada: false,
              tiempo_considerado: true,
              duracion: duracion
            });
          }
        }
      }
      equipo.estados_agrupados = duracionEstados;
      equipo.duracion_total = duracionTotal;
      const arrayTiempoTotal = duracionEstados.filter(item => {
        if (item.tiempo_considerado) {
          return true;
        }
      });

      const arrayTiempoParadasPlanificada = duracionEstados.filter(item => {
        if (!item.tiempo_parada && item.tiempo_considerado) {
          return true;
        }
      });

      const arrayTiempoParadas = duracionEstados.filter(item => {
        if (item.tiempo_parada && item.tiempo_considerado) {
          return true;
        }
      });

      const tiempoTotalTrabajo = _.sumBy(arrayTiempoTotal, 'duracion');
      const tiempoParadas = _.sumBy(arrayTiempoParadas, 'duracion');
      const disponibilidad = ((tiempoTotalTrabajo - tiempoParadas) / tiempoTotalTrabajo) * 100;
      equipo.disponibilidad = mathjs.round(disponibilidad, 2);

      // Logica para estados
      // Recorro y concateno con detalle de mapa_estados
      equipo.estados = equipo.estados.map(estado => {
        const mapa_estado = equipo.tipo_equipo.mapa_estados.find(item => {
          if (item.estado === estado.estado) {
            return true;
          }
        });

        if (mapa_estado) {
          estado.nombre = mapa_estado.nombre;
          estado.color_grafico = mapa_estado.color_grafico;
          estado.tiempo_parada = mapa_estado.tiempo_parada;
          estado.tiempo_planificado = mapa_estado.tiempo_planificado;
        } else {
          estado.nombre = 'No definido';
          estado.color_grafico = '#fff';
          estado.tiempo_parada = false;
          estado.tiempo_planificado = false;
        }

        return estado;
      });

      // Logica agrega estado actual
      const tag = equipo.tags.find(tag => {
        if (tag.tipo_tag_id === 2) {
          return true;
        }
      });

      const estadoActual = lives.find(live => {
        if (tag) {
          if (live.TagName === tag.tag) {
            return true;
          }
        }
      });
      if (estadoActual) {
        const mapa_estado_actual = equipo.tipo_equipo.mapa_estados.find(item => {
          if (item.estado === estadoActual.Value) {
            return true;
          }
        });

        equipo.estado_actual = {
          fecha: estadoActual.DateTime,
          nombre: mapa_estado_actual.nombre,
          estado: estadoActual.Value,
          color_grafico: mapa_estado_actual.color_grafico
        };
      } else {
        equipo.estado_actual = {
          fecha: new Date(),
          nombre: 'Sin definir',
          estado: 0,
          color_grafico: '#fff'
        };
      }

      return equipo;
    });
    return equipos;
  }
}

module.exports = Socket;
