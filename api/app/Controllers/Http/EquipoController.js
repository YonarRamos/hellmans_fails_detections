'use strict';

const Equipo = use('App/Models/Equipo');
const Estado = use('App/Models/Estado');
const Ruteo = use('App/Models/Ruteo');
const Alarma = use('App/Models/Alarma');
const MapaCausa = use('App/Models/MapaCausa');
const MapaEstado = use('App/Models/MapaEstado');
const Database = use('Database');
const moment = use('moment');
const _ = require('lodash');
const Ws = use('Ws');
const Socket = require('../../Services/Socket');

class EquipoController {
  async index({ request, response }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'nombre';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'nombre';
    search = search || '';

    const equipos = await Equipo.query()
      .with('tipo_equipo')
      .with('tags')
      .orderBy(sortBy, descending)
      .where(searchField, 'like', `%${search}%`)
      .paginate(page, perPage);

    response.status(200).json(equipos);
  }

  async store({ request, response }) {
    const data = request.only([
      'nombre',
      'descripcion',
      'categoria',
      'grupo',
      'sub_grupo',
      'notificar_estado',
      'notificar_alarma',
      'tipo_equipo_id'
    ]);
    const equipo = await Equipo.create(data);

    response.status(201).json(equipo);
  }

  async show({ request, response, params: { id } }) {
    const equipo = await Equipo.findOrFail(id);

    if (!equipo) {
      response.status(404).json({
        message: 'Equipo no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(equipo);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only([
      'nombre',
      'descripcion',
      'categoria',
      'grupo',
      'sub_grupo',
      'notificar_estado',
      'notificar_alarma',
      'ultima_actualizacion',
      'tipo_equipo_id'
    ]);
    const equipo = await Equipo.find(id);

    if (!equipo) {
      response.status(404).json({
        message: 'Equipo no encontrada.',
        id
      });
      return;
    }
    equipo.nombre = data.nombre || equipo.nombre;
    equipo.descripcion = data.descripcion || equipo.descripcion;
    equipo.categoria = data.categoria || equipo.categoria;
    equipo.grupo = data.grupo || equipo.grupo;
    equipo.sub_grupo = data.sub_grupo || equipo.sub_grupo;
    equipo.notificar_estado = data.notificar_estado ? true : false;
    equipo.notificar_alarma = data.notificar_alarma ? true : false;
    equipo.ultima_actualizacion = data.ultima_actualizacion || equipo.ultima_actualizacion;
    equipo.tipo_equipo_id = data.tipo_equipo_id || equipo.tipo_equipo_id;
    await equipo.save();

    try {
      const io = new Socket();
      const datosSocket = await io.socketEquipo();

      Ws.getChannel('socket')
        .topic('socket')
        .socket.broadcastToAll('notificacion_estados', JSON.stringify(datosSocket));
    } catch (error) {
      console.log('No hay usuarios subcriptos al socket');
    }

    response.status(200).json(equipo);
  }

  async destroy({ request, response, params: { id } }) {
    const equipo = await Equipo.find(id);

    if (!equipo) {
      response.status(404).json({
        message: 'Equipo no encontrada.',
        id
      });
      return;
    }
    await equipo.delete();

    response.status(200).json(equipo);
  }

  async indexEstados({ request, response, params: { id } }) {
    let { sortBy, descending, group, desde, hasta } = request.get();
    sortBy = sortBy || 'fecha';
    descending = descending || 'ASC';
    group = group || false;
    desde =
      desde ||
      new Date(
        moment()
          .add(-1, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
      );
    hasta = hasta || new Date(moment().format('YYYY-MM-DD HH:mm:ss'));

    let estados = [];
    estados = await Database.raw(
      'SELECT * FROM (SELECT [id], [fecha], [estado], [duracion], [equipo_id] FROM [dbo].[estados] WHERE fecha BETWEEN ? AND ? AND equipo_id = ? and duracion <> -1 UNION SELECT [id], [fecha], [estado], DATEDIFF (s, fecha, ?) as duracion, [equipo_id] FROM [dbo].[estados] WHERE fecha BETWEEN ? AND ? AND equipo_id = ? and duracion = -1) ESTADOS',
      [desde, hasta, id, hasta, desde, hasta, id]
    );

    const equipo = await Equipo.find(id);
    let mapaEstados = await MapaEstado.query()
      .where('tipo_equipo_id', equipo.tipo_equipo_id)
      .fetch();
    mapaEstados = mapaEstados.toJSON();

    const estadoPrevio = await Estado.query()
      .where('equipo_id', equipo.id)
      .where('fecha', '<=', desde)
      .orderBy('fecha', 'DESC')
      .first();

    let duracion = 0;
    if (estados.length === 0) {
      duracion = moment(hasta).diff(moment(desde), 'seconds');
    } else {
      duracion = moment(estados[0].fecha).diff(moment(desde), 'seconds');
    }

    if (estadoPrevio) {
      estados.unshift({
        fecha: desde,
        estado: estadoPrevio.estado,
        duracion: duracion,
        equipo_id: equipo.id
      });
    } else {
      estados.unshift({
        fecha: desde,
        estado: 0,
        duracion: duracion,
        equipo_id: equipo.id
      });
    }

    estados = estados.map(estado => {
      const mapa_estado = mapaEstados.find(item => {
        if (item.estado === estado.estado) {
          return true;
        }
      });

      if (mapa_estado) {
        estado.nombre = mapa_estado.nombre;
        estado.color_grafico = mapa_estado.color_grafico;
        estado.tiempo_parada = mapa_estado.tiempo_parada;
        estado.tiempo_considerado = mapa_estado.tiempo_considerado;
      } else {
        estado.nombre = 'No definido';
        estado.color_grafico = '#fff';
        estado.tiempo_parada = false;
        estado.tiempo_considerado = false;
      }

      return estado;
    });

    if (!group || group === 'false') {
      response.status(200).json(estados);
    } else {
      let estasAgrupadosFormateados = [];
      const estadosAgrupados = _.groupBy(estados, 'nombre');

      for (const key in estadosAgrupados) {
        const sumaDuracion = _.sumBy(estadosAgrupados[key], 'duracion');

        if (estadosAgrupados[key].length > 0) {
          estasAgrupadosFormateados.push({
            nombre: estadosAgrupados[key][0].nombre,
            estado: estadosAgrupados[key][0].estado,
            duracion: estadosAgrupados[key][0].duracion,
            color_grafico: estadosAgrupados[key][0].color_grafico,
            tiempo_parada: estadosAgrupados[key][0].tiempo_parada,
            tiempo_considerado: estadosAgrupados[key][0].tiempo_considerado
          });
        }
      }
      estasAgrupadosFormateados = estasAgrupadosFormateados.sort((a, b) => {
        if (a.duracion < b.duracion) {
          return 1;
        }
        if (a.duracion > b.duracion) {
          return -1;
        }
        return 0;
      });
      response.status(200).json(estasAgrupadosFormateados);
    }
  }

  async indexAlarmas({ request, response, params: { id } }) {
    let { sortBy, descending, group, reconocidas, desde, hasta } = request.get();
    sortBy = sortBy || 'fecha';
    descending = descending || 'ASC';
    group = group || false;
    reconocidas = reconocidas || false;
    desde =
      desde ||
      new Date(
        moment()
          .add(-1, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
      );
    hasta = hasta || new Date(moment().format('YYYY-MM-DD HH:mm:ss'));

    let alarmas = [];
    if (!group || group === 'false') {
      alarmas = await Alarma.query()
        .with('causa')
        .where('equipo_id', id)
        .whereBetween('fecha', [desde, hasta])
        .orderBy(sortBy, descending)
        .fetch();
    } else {
      if (!reconocidas || reconocidas === 'false') {
        alarmas = await Database.raw(
          'SELECT nombre, sum(duracion) as duracion, count(id) as cantidad, grupo, tag, equipo_id FROM [dbo].[alarmas] WHERE fecha BETWEEN ? AND ? AND equipo_id = ? GROUP BY nombre, equipo_id, tag, grupo ORDER BY duracion DESC',
          [desde, hasta, id]
        );
      } else {
        alarmas = await Database.raw(
          'SELECT [mapa_causas].nombre as nombre, sum(duracion) as duracion, count([mapa_causas].id) as cantidad, grupo, equipo_id FROM [dbo].[alarmas] INNER JOIN [dbo].[mapa_causas] ON [dbo].[alarmas].[mapa_causa_id] = [dbo].[mapa_causas].[id] WHERE fecha BETWEEN ? AND ? AND equipo_id = ? AND reconocida = 1 GROUP BY [mapa_causas].nombre, mapa_causa_id, equipo_id, grupo ORDER BY duracion DESC',
          [desde, hasta, id]
        );
      }
    }

    response.status(200).json(alarmas);
  }

  async indexRuteos({ request, response, params: { id } }) {
    let { sortBy, descending, group, desde, hasta } = request.get();
    sortBy = sortBy || 'fecha';
    descending = descending || 'ASC';
    group = group || false;
    desde =
      desde ||
      new Date(
        moment()
          .add(-1, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
      );
    hasta = hasta || new Date(moment().format('YYYY-MM-DD HH:mm:ss'));

    const ruteos = await Ruteo.query()
      .with('linea')
      .with('colector')
      .with('tolva')
      .with('molino')
      .with('premix')
      .with('tk_pasta')
      .with('aceite')
      .with('fase_acida')
      .with('esm')
      .with('cooker')
      .with('tk_slurry')
      .with('ketchup')
      .where('equipo_id', id)
      .whereBetween('fecha', [desde, hasta])
      .orderBy(sortBy, descending)
      .fetch();

    response.status(200).json(ruteos);
  }

  async indexMapaCausas({ request, response, params: { id } }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'nombre';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'nombre';
    search = search || '';

    const equipo = await Equipo.find(id);

    const mapaCausas = await MapaCausa.query()
      .where('tipo_equipo_id', equipo.tipo_equipo_id)
      .orderBy(sortBy, descending)
      .fetch();

    response.status(200).json(mapaCausas);
  }

  async indexMapaEstados({ request, response, params: { id } }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'nombre';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'nombre';
    search = search || '';

    const equipo = await Equipo.find(id);

    const mapaEstados = await MapaEstado.query()
      .where('tipo_equipo_id', equipo.tipo_equipo_id)
      .fetch();

    response.status(200).json(mapaEstados);
  }

  async indexDisponibilidad({ request, response, params: { id } }) {}
}

module.exports = EquipoController;
