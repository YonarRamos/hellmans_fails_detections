'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Equipo extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  tipo_equipo() {
    return this.belongsTo('App/Models/TipoEquipo');
  }

  alarmas() {
    return this.hasMany('App/Models/Alarma');
  }

  estados() {
    return this.hasMany('App/Models/Estado');
  }

  ruteos() {
    return this.hasMany('App/Models/Ruteo');
  }

  tags() {
    return this.belongsToMany('App/Models/Tag').pivotTable('equipo_tag');
  }
}

module.exports = Equipo;
