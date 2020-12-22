'use strict';

const Tag = use('App/Models/Tag');

class TagController {
  async index({ request, response }) {
    let { page, sortBy, descending, perPage, search, searchField } = request.get();
    page = page || 1;
    sortBy = sortBy || 'tag';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    searchField = searchField || 'tag';
    search = search || '';

    const tags = await Tag.query()
      .orderBy(sortBy, descending)
      .where(searchField, 'like', `%${search}%`)
      .paginate(page, perPage);

    response.status(200).json(tags);
  }

  async store({ request, response }) {
    const data = request.only(['tag', 'tipo_tag_id']);
    const tag = await Tag.create(data);

    response.status(201).json(tag);
  }

  async show({ request, response, params: { id } }) {
    const tag = await Tag.findOrFail(id);

    if (!tag) {
      response.status(404).json({
        message: 'Tag no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(tag);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['tag', 'tipo_tag_id']);
    const tag = await Tag.find(id);

    if (!tag) {
      response.status(404).json({
        message: 'Tag no encontrada.',
        id
      });
      return;
    }
    tag.tag = data.tag || tag.tag;
    tag.tipo_tag_id = data.tipo_tag_id || tag.tipo_tag_id;
    await tag.save();

    response.status(200).json(tag);
  }

  async destroy({ request, response, params: { id } }) {
    const tag = await Tag.find(id);

    if (!tag) {
      response.status(404).json({
        message: 'Tag no encontrada.',
        id
      });
      return;
    }
    await tag.delete();

    response.status(200).json(tag);
  }
}

module.exports = TagController;
