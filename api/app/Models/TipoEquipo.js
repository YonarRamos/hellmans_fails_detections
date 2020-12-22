'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TipoEquipo extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  mapa_ruteos() {
    return this.hasMany('App/Models/MapaRuteo');
  }

  mapa_estados() {
    return this.hasMany('App/Models/MapaEstado');
  }

  mapa_objetivos() {
    return this.hasMany('App/Models/MapaObjetivo');
  }

  mapa_causas() {
    return this.hasMany('App/Models/MapaCausa');
  }
}

module.exports = TipoEquipo;
