'use strict';

const MapaAlarma = use('App/Models/MapaAlarma');

class MapaAlarmaController {
  async index({ request, response }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'nombre';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'nombre';
    search = search || '';

    const mapaAlarmas = await MapaAlarma.query()
      .orderBy(sortBy, descending)
      .where(searchField, 'like', `%${search}%`)
      .paginate(page, perPage);

    response.status(200).json(mapaAlarmas);
  }

  async store({ request, response }) {
    const data = request.only(['nombre', 'grupo', 'tag', 'cosiderada', 'silenciada']);
    const mapaAlarma = await MapaAlarma.create(data);

    response.status(201).json(mapaAlarma);
  }

  async show({ request, response, params: { id } }) {
    const mapaAlarma = await MapaAlarma.findOrFail(id);

    if (!mapaAlarma) {
      response.status(404).json({
        message: 'MapaAlarma no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(mapaAlarma);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['nombre', 'grupo', 'tag', 'cosiderada', 'silenciada']);
    const mapaAlarma = await MapaAlarma.find(id);

    if (!mapaAlarma) {
      response.status(404).json({
        message: 'MapaAlarma no encontrada.',
        id
      });
      return;
    }
    mapaAlarma.nombre = data.nombre || mapaAlarma.nombre;
    mapaAlarma.grupo = data.grupo || mapaAlarma.grupo;
    mapaAlarma.tag = data.tag || mapaAlarma.tag;
    mapaAlarma.cosiderada = data.cosiderada ? true : false;
    mapaAlarma.silenciada = data.silenciada ? true : false;
    await mapaAlarma.save();

    response.status(200).json(mapaAlarma);
  }

  async destroy({ request, response, params: { id } }) {
    const mapaAlarma = await MapaAlarma.find(id);

    if (!mapaAlarma) {
      response.status(404).json({
        message: 'MapaAlarma no encontrada.',
        id
      });
      return;
    }
    await mapaAlarma.delete();

    response.status(200).json(mapaAlarma);
  }
}

module.exports = MapaAlarmaController;
