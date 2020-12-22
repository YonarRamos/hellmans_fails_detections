'use strict';

const TipoEquipo = use('App/Models/TipoEquipo');

class TipoEquipoController {
  async index({ request, response }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'nombre';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'nombre';
    search = search || '';

    const tipoEquipos = await TipoEquipo.query()
      .with('mapa_estados')
      .with('mapa_ruteos')
      .orderBy(sortBy, descending)
      .where(searchField, 'like', `%${search}%`)
      .paginate(page, perPage);

    response.status(200).json(tipoEquipos);
  }

  async store({ request, response }) {
    const data = request.only(['nombre', 'jerarquia']);
    const tipoEquipo = await TipoEquipo.create(data);

    response.status(201).json(tipoEquipo);
  }

  async show({ request, response, params: { id } }) {
    const tipoEquipo = await TipoEquipo.findOrFail(id);

    if (!tipoEquipo) {
      response.status(404).json({
        message: 'TipoEquipo no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(tipoEquipo);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['nombre', 'jerarquia']);
    const tipoEquipo = await TipoEquipo.find(id);

    if (!tipoEquipo) {
      response.status(404).json({
        message: 'TipoEquipo no encontrada.',
        id
      });
      return;
    }
    tipoEquipo.nombre = data.nombre || tipoEquipo.nombre;
    tipoEquipo.jerarquia = data.jerarquia || tipoEquipo.jerarquia;
    await tipoEquipo.save();

    response.status(200).json(tipoEquipo);
  }

  async destroy({ request, response, params: { id } }) {
    const tipoEquipo = await TipoEquipo.find(id);

    if (!tipoEquipo) {
      response.status(404).json({
        message: 'TipoEquipo no encontrada.',
        id
      });
      return;
    }
    await tipoEquipo.delete();

    response.status(200).json(tipoEquipo);
  }
}

module.exports = TipoEquipoController;
