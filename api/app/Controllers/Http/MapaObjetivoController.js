'use strict';

const MapaCausa = use('App/Models/MapaCausa');

class MapaCausaController {
  async index({ request, response }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'nombre';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'nombre';
    search = search || '';

    const mapaCausas = await MapaCausa.query()
      .orderBy(sortBy, descending)
      .where(searchField, 'like', `%${search}%`)
      .paginate(page, perPage);

    response.status(200).json(mapaCausas);
  }

  async store({ request, response }) {
    const data = request.only(['nombre', 'descripcion', 'tipo_equipo_id']);
    const mapaCausa = await MapaCausa.create(data);

    response.status(201).json(mapaCausa);
  }

  async show({ request, response, params: { id } }) {
    const mapaCausa = await MapaCausa.findOrFail(id);

    if (!mapaCausa) {
      response.status(404).json({
        message: 'MapaCausa no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(mapaCausa);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['nombre', 'descripcion', 'tipo_equipo_id']);
    const mapaCausa = await MapaCausa.find(id);

    if (!mapaCausa) {
      response.status(404).json({
        message: 'MapaCausa no encontrada.',
        id
      });
      return;
    }
    mapaCausa.nombre = data.nombre || mapaCausa.nombre;
    mapaCausa.descripcion = data.descripcion || mapaCausa.descripcion;
    mapaCausa.tipo_equipo_id = data.tipo_equipo_id || mapaCausa.tipo_equipo_id;
    await mapaCausa.save();

    response.status(200).json(mapaCausa);
  }

  async destroy({ request, response, params: { id } }) {
    const mapaCausa = await MapaCausa.find(id);

    if (!mapaCausa) {
      response.status(404).json({
        message: 'MapaCausa no encontrada.',
        id
      });
      return;
    }
    await mapaCausa.delete();

    response.status(200).json(mapaCausa);
  }
}

module.exports = MapaCausaController;
