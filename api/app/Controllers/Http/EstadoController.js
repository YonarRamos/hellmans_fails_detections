'use strict';

const Estado = use('App/Models/Estado');

class EstadoController {
  async index({ request, response }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'fecha';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'estado';
    search = search || '';

    const estados = await Estado.query()
      .orderBy(sortBy, descending)
      .where(searchField, 'like', `%${search}%`)
      .paginate(page, perPage);

    response.status(200).json(estados);
  }

  async show({ request, response, params: { id } }) {
    const estado = await Estado.findOrFail(id);

    if (!estado) {
      response.status(404).json({
        message: 'Estado no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(estado);
  }
}

module.exports = EstadoController;
