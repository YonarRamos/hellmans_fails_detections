'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class MapaRuteo extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  tipo_equipo() {
    return this.belongsTo('App/Models/TipoEquipo');
  }

  tags() {
    return this.belongsToMany('App/Models/Tag').pivotTable('mapa_ruteo_tag');
  }
}

module.exports = MapaRuteo;
