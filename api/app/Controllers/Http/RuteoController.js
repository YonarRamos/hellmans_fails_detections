'use strict';

const Ruteo = use('App/Models/Ruteo');

class RuteoController {
  async index({ request, response }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'fecha';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'fecha';
    search = search || '';

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
      .orderBy(sortBy, descending)
      .where(searchField, 'like', `%${search}%`)
      .paginate(page, perPage);

    response.status(200).json(ruteos);
  }

  async show({ request, response, params: { id } }) {
    const ruteo = await Ruteo.findOrFail(id);

    if (!ruteo) {
      response.status(404).json({
        message: 'Ruteo no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(ruteo);
  }
}

module.exports = RuteoController;
