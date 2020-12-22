'use strict';

const MapaEstado = use('App/Models/MapaEstado');

class MapaEstadoController {
  async index({ request, response }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'nombre';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'nombre';
    search = search || '';

    const mapaEstados = await MapaEstado.query()
      .orderBy(sortBy, descending)
      .where(searchField, 'like', `%${search}%`)
      .paginate(page, perPage);

    response.status(200).json(mapaEstados);
  }

  async store({ request, response }) {
    const data = request.only([
      'nombre',
      'estado',
      'color_grafico',
      'tiempo_planificado',
      'tiempo_parada',
      'tipo_equipo_id'
    ]);
    const mapaEstado = await MapaEstado.create(data);

    response.status(201).json(mapaEstado);
  }

  async show({ request, response, params: { id } }) {
    const mapaEstado = await MapaEstado.findOrFail(id);

    if (!mapaEstado) {
      response.status(404).json({
        message: 'MapaEstado no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(mapaEstado);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only([
      'nombre',
      'estado',
      'color_grafico',
      'tiempo_planificado',
      'tiempo_parada',
      'tipo_equipo_id'
    ]);
    const mapaEstado = await MapaEstado.find(id);

    if (!mapaEstado) {
      response.status(404).json({
        message: 'MapaEstado no encontrada.',
        id
      });
      return;
    }
    mapaEstado.nombre = data.nombre || mapaEstado.nombre;
    mapaEstado.estado = data.estado || mapaEstado.estado;
    mapaEstado.color_grafico = data.color_grafico || mapaEstado.color_grafico;
    mapaEstado.tiempo_planificado = data.tiempo_planificado ? true : false;
    mapaEstado.tiempo_parada = data.tiempo_parada ? true : false;
    mapaEstado.tipo_equipo_id = data.tipo_equipo_id || mapaEstado.tipo_equipo_id;
    await mapaEstado.save();

    response.status(200).json(mapaEstado);
  }

  async destroy({ request, response, params: { id } }) {
    const mapaEstado = await MapaEstado.find(id);

    if (!mapaEstado) {
      response.status(404).json({
        message: 'MapaEstado no encontrada.',
        id
      });
      return;
    }
    await mapaEstado.delete();

    response.status(200).json(mapaEstado);
  }
}

module.exports = MapaEstadoController;
