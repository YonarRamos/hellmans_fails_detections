'use strict';

const Equipo = use('App/Models/Equipo');
const Wonder = require('../Services/Wonder');
const FechaAdquisicion = require('../Utils/FechaAdquisicion');
const FormateaDatos = require('../Utils/FormateaDatos');
const FiltroDatos = require('../Utils/FiltroDatos');
const Configuracion = use('App/Models/Configuracion');
const Historico = require('../Services/Historico');
const _ = require('lodash');
const moment = require('moment');
const Database = use('Database');
const Ws = use('Ws');
const MapaRuteo = use('App/Models/MapaRuteo');
const Estado = use('App/Models/Estado');
const Ruteo = use('App/Models/Ruteo');
const Alarma = use('App/Models/Alarma');

module.exports = {
  async datos() {
    try {
      console.time('Adquiriendo datos de WONDER');

      // Consulto todos los equipos
      let equipos = await Equipo.query()
        .with('tipo_equipo', builder => {
          builder.with('mapa_estados');
        })
        .with('tags')
        .fetch();
      equipos = equipos.toJSON();

      // Consulto tiempo a despreciar en configuraciones
      let configuraciones = await Configuracion.all();
      configuraciones = configuraciones.toJSON();

      const tiempoDepreciarRuido = configuraciones.find(item => {
        if (item.tag === 'TIEMPO_DESPRECIAR_RUIDO') {
          return true;
        }
      });

      let desde;
      let hasta = moment()
        .add(-3, 'hours')
        .toDate();

      for (const equipo of equipos) {
        // Instanceo los servicios para consulta de Wonder
        const wonder = new Wonder();

        // Intanceo los servicios de historicos
        const historico = new Historico();

        // Traigo fecha actual y la ultima en que se ejecuto la actualizacion
        desde = equipo.ultima_actualizacion;
        const arrayIteraciones = await FechaAdquisicion.arrayIteraciones(desde, hasta);

        // Filtro tag de alarmas
        const tagAlarma = equipo.tags.find(item => {
          if (item.tipo_tag_id === 1) {
            return true;
          }
        });

        // Filtro tag de estado
        let tagEstado = equipo.tags.find(item => {
          if (item.tipo_tag_id === 2) {
            return true;
          }
        });

        // Filtro tag de ruteos
        const tagRuteo = equipo.tags.find(item => {
          if (item.tipo_tag_id === 3) {
            return true;
          }
        });

        for (let fecha of arrayIteraciones) {
          console.log('Adquiriendo datos de', equipo.nombre, fecha.desde, fecha.hasta);
          // Consulto historicos de estados, filtro, formatero y guardo en DB
          if (tagEstado) {
            const estados = await wonder.getEstados(tagEstado.tag, fecha.desde, fecha.hasta);
            const estadosFiltrados = await FiltroDatos.despreciarRuidosEstados(
              estados,
              equipo,
              tiempoDepreciarRuido.valor,
              fecha.desde,
              fecha.hasta
            );
            const estadosFormateados = await FormateaDatos.estados(estadosFiltrados, equipo);
            await historico.guardaEstadosPorEquipo(estadosFormateados);
          }

          if (tagRuteo) {
            const ruteos = await wonder.getRuteos(tagRuteo.tag, fecha.desde, fecha.hasta);
            const ruteosFiltrados = await FiltroDatos.despreciarRuidosRuteos(
              ruteos,
              equipo,
              tiempoDepreciarRuido.valor,
              fecha.desde,
              fecha.hasta
            );
            const ruteosFormateados = await FormateaDatos.ruteos(ruteosFiltrados, equipo);
            await historico.guardaRuteosPorEquipo(ruteosFormateados);
          }

          if (tagAlarma) {
            const estadosFallas = equipo.tipo_equipo.mapa_estados
              .filter(item => {
                if (item.falla_propia || item.falla_extera) {
                  return true;
                }
              })
              .map(item => item.estado);

            let fallas = await Estado.query()
              .where('equipo_id', equipo.id)
              .where('duracion', '<>', -1)
              .whereBetween('fecha', [fecha.desde, fecha.hasta])
              .whereIn('estado', estadosFallas)
              .fetch();
            fallas = fallas.toJSON();

            for (const falla of fallas) {
              const desdeAlarma = new Date(
                moment(falla.fecha)
                  .add(-2, 'minute')
                  .format('YYYY-MM-DD HH:mm:ss')
              );
              const hastaAlarma = new Date(
                moment(falla.fecha)
                  .add(2, 'minute')
                  .format('YYYY-MM-DD HH:mm:ss')
              );
              const alarmas = await wonder.getAlarmas(tagAlarma.tag, desdeAlarma, hastaAlarma);
              const alarma = alarmas.find(alarma => {
                if (alarma.considerada) {
                  return true;
                }
              });

              // En caso de existir creo alarma con duracion de falla y guardo alarma en base de datos
              if (alarma && alarma.considerada) {
                await Alarma.create({
                  fecha: falla.fecha,
                  nombre: alarma.descripcion,
                  grupo: alarma.area,
                  tag: alarma.tag,
                  duracion: falla.duracion,
                  equipo_id: equipo.id
                });
              } else {
                // Al no encontar alarma o esta no se considera busco ruteo anterior
                let ruteoPrevio = await historico.getRuteoPrevio(equipo, falla.fecha);
                let alarmaRuteo = null;

                // Recorro ruteo aguas abajo
                for (const key in ruteoPrevio) {
                  if (typeof ruteoPrevio[key] === 'object' && key !== 'fecha') {
                    if (ruteoPrevio[key]) {
                      if (ruteoPrevio[key].tipo_equipo.jerarquia > equipo.tipo_equipo.jerarquia) {
                        // Verifico si el elemento de ruteo tiene tags asociados
                        if (ruteoPrevio[key].tags.length > 1) {
                          if (!alarmaRuteo) {
                            // Busco tag de alarmas
                            const tagsAlarmaFallaPrevioRuteo = ruteoPrevio[key].tags.find(item => {
                              if (item.tipo_tag_id === 1) {
                                return true;
                              }
                            });

                            // Busco tag de estados
                            const tagsEstadoFallaPrevioRuteo = ruteoPrevio[key].tags.find(item => {
                              if (item.tipo_tag_id === 2) {
                                return true;
                              }
                            });

                            // El ruteo tiene que tener los tags de estados y alarmas
                            if (tagsAlarmaFallaPrevioRuteo && tagsEstadoFallaPrevioRuteo) {
                              let estadoFallaPrevioRuteo = await wonder.getEstadoFallaPrevio(
                                tagsEstadoFallaPrevioRuteo.tag,
                                [8],
                                falla.fecha
                              );

                              if (estadoFallaPrevioRuteo) {
                                const desdeAlarma = new Date(
                                  moment(estadoFallaPrevioRuteo.DateTime)
                                    .add(-2, 'minute')
                                    .format('YYYY-MM-DD HH:mm:ss')
                                );
                                const hastaAlarma = new Date(
                                  moment(estadoFallaPrevioRuteo.DateTime)
                                    .add(2, 'minute')
                                    .format('YYYY-MM-DD HH:mm:ss')
                                );
                                const alarmas = await wonder.getAlarmas(
                                  tagsAlarmaFallaPrevioRuteo.tag,
                                  desdeAlarma,
                                  hastaAlarma
                                );
                                alarmaRuteo = alarmas.find(alarma => {
                                  if (alarma.considerada) {
                                    return true;
                                  }
                                });

                                if (alarmaRuteo) {
                                  await Alarma.create({
                                    fecha: falla.fecha,
                                    nombre: alarmaRuteo.descripcion,
                                    grupo: alarmaRuteo.area,
                                    tag: alarmaRuteo.tag,
                                    duracion: falla.duracion,
                                    equipo_id: equipo.id
                                  });
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          // Actualizacion ultima_fecha de actualizacion a la actual
          await Database.table('equipos')
            .where('id', equipo.id)
            .update('ultima_actualizacion', fecha.hasta);
        }

        // Emito por socket a todos los usuarios
        try {
          Ws.getChannel('socket')
            .topic('socket')
            .broadcastToAll('variables', JSON.stringify([]));
        } catch (error) {}
      }

      console.timeEnd('Adquiriendo datos de WONDER');

      return Promise.resolve(hasta);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
