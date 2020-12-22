'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Alarma extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  equipo() {
    return this.belongsTo('App/Models/Equipo');
  }

  causa() {
    return this.belongsTo('App/Models/MapaCausa');
  }
}

module.exports = Alarma;
