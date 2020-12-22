'use strict';

const MapaRuteo = use('App/Models/MapaRuteo');

class MapaRuteoController {
  async index({ request, response }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'nombre';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'nombre';
    search = search || '';

    const mapaRuteos = await MapaRuteo.query()
      .with('tipo_equipo')
      .with('tags')
      .orderBy(sortBy, descending)
      .where(searchField, 'like', `%${search}%`)
      .paginate(page, perPage);

    response.status(200).json(mapaRuteos);
  }

  async store({ request, response }) {
    const data = request.only(['numeracion', 'tipo_equipo_id']);
    const mapaRuteo = await MapaRuteo.create(data);

    response.status(201).json(mapaRuteo);
  }

  async show({ request, response, params: { id } }) {
    const mapaRuteo = await MapaRuteo.findOrFail(id);

    if (!mapaRuteo) {
      response.status(404).json({
        message: 'MapaRuteo no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(mapaRuteo);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['numeracion', 'tipo_equipo_id']);
    const mapaRuteo = await MapaRuteo.find(id);

    if (!mapaRuteo) {
      response.status(404).json({
        message: 'MapaRuteo no encontrada.',
        id
      });
      return;
    }
    mapaRuteo.numeracion = data.numeracion || mapaRuteo.numeracion;
    mapaRuteo.tipo_equipo_id = data.tipo_equipo_id || mapaRuteo.tipo_equipo_id;
    await mapaRuteo.save();

    response.status(200).json(mapaRuteo);
  }

  async destroy({ request, response, params: { id } }) {
    const mapaRuteo = await MapaRuteo.find(id);

    if (!mapaRuteo) {
      response.status(404).json({
        message: 'MapaRuteo no encontrada.',
        id
      });
      return;
    }
    await mapaRuteo.delete();

    response.status(200).json(mapaRuteo);
  }
}

module.exports = MapaRuteoController;
