'use strict';

const Configuracion = use('App/Models/Configuracion');
const Ws = use('Ws');
const Socket = require('../../Services/Socket');

class ConfiguracionController {
  async index({ request, response }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'tag';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'tag';
    search = search || '';

    const configuraciones = await Configuracion.query()
      .orderBy(sortBy, descending)
      .where(searchField, 'like', `%${search}%`)
      .paginate(page, perPage);

    response.status(200).json(configuraciones);
  }

  async store({ request, response }) {
    const data = request.only(['tag', 'nombre', 'descripcion', 'valor']);
    const configuracion = await Configuracion.create(data);

    response.status(201).json(configuracion);
  }

  async show({ request, response, params: { id } }) {
    const configuracion = await Configuracion.findOrFail(id);

    if (!configuracion) {
      response.status(404).json({
        message: 'Configuracion no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(configuracion);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['tag', 'nombre', 'descripcion', 'valor']);
    const configuracion = await Configuracion.find(id);

    if (!configuracion) {
      response.status(404).json({
        message: 'Configuracion no encontrada.',
        id
      });
      return;
    }
    configuracion.tag = data.tag || configuracion.tag;
    configuracion.nombre = data.nombre || configuracion.nombre;
    configuracion.descripcion = data.descripcion || configuracion.descripcion;
    configuracion.valor = data.valor || configuracion.valor;
    await configuracion.save();

    try {
      const io = new Socket();
      const datosSocket = await io.socketEquipo();

      Ws.getChannel('socket')
        .topic('socket')
        .socket.broadcastToAll('notificacion_estados', JSON.stringify(datosSocket));
    } catch (error) {
      console.log('No hay usuarios subcriptos al socket');
    }

    response.status(200).json(configuracion);
  }

  async destroy({ request, response, params: { id } }) {
    const configuracion = await Configuracion.find(id);

    if (!configuracion) {
      response.status(404).json({
        message: 'Configuracion no encontrada.',
        id
      });
      return;
    }
    await configuracion.delete();

    response.status(200).json(configuracion);
  }
}

module.exports = ConfiguracionController;
