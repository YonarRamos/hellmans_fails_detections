'use strict';

const TipoTag = use('App/Models/TipoTag');

class TipoTagController {
  async index({ request, response }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'nombre';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'nombre';
    search = search || '';

    const tipoTags = await TipoTag.query()
      .orderBy(sortBy, descending)
      .where(searchField, 'like', `%${search}%`)
      .paginate(page, perPage);

    response.status(200).json(tipoTags);
  }

  async store({ request, response }) {
    const data = request.only(['nombre', 'descripcion']);
    const tipoTag = await TipoTag.create(data);

    response.status(201).json(tipoTag);
  }

  async show({ request, response, params: { id } }) {
    const tipoTag = await TipoTag.findOrFail(id);

    if (!tipoTag) {
      response.status(404).json({
        message: 'TipoTag no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(tipoTag);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['nombre', 'descripcion']);
    const tipoTag = await TipoTag.find(id);

    if (!tipoTag) {
      response.status(404).json({
        message: 'TipoTag no encontrada.',
        id
      });
      return;
    }
    tipoTag.nombre = data.nombre || tipoTag.nombre;
    tipoTag.descripcion = data.descripcion || tipoTag.descripcion;
    await tipoTag.save();

    response.status(200).json(tipoTag);
  }

  async destroy({ request, response, params: { id } }) {
    const tipoTag = await TipoTag.find(id);

    if (!tipoTag) {
      response.status(404).json({
        message: 'TipoTag no encontrada.',
        id
      });
      return;
    }
    await tipoTag.delete();

    response.status(200).json(tipoTag);
  }
}

module.exports = TipoTagController;
