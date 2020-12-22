'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class MapaCausa extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  tipo_equipo() {
    return this.belongsTo('App/Models/TipoEquipo');
  }
}

module.exports = MapaCausa;
