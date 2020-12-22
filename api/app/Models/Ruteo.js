'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Ruteo extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  equipo() {
    return this.belongsTo('App/Models/Equipo');
  }

  linea() {
    return this.belongsTo('App/Models/MapaRuteo', 'linea_id');
  }

  colector() {
    return this.belongsTo('App/Models/MapaRuteo', 'colector_id');
  }

  tolva() {
    return this.belongsTo('App/Models/MapaRuteo', 'tolva_id');
  }

  molino() {
    return this.belongsTo('App/Models/MapaRuteo', 'molino_id');
  }

  premix() {
    return this.belongsTo('App/Models/MapaRuteo', 'premix_id');
  }

  tk_pasta() {
    return this.belongsTo('App/Models/MapaRuteo', 'tk_pasta_id');
  }

  aceite() {
    return this.belongsTo('App/Models/MapaRuteo', 'aceite_id');
  }

  fase_acida() {
    return this.belongsTo('App/Models/MapaRuteo', 'fase_acida_id');
  }

  esm() {
    return this.belongsTo('App/Models/MapaRuteo', 'esm_id');
  }

  cooker() {
    return this.belongsTo('App/Models/MapaRuteo', 'cooker_id');
  }

  tk_slurry() {
    return this.belongsTo('App/Models/MapaRuteo', 'tk_slurry_id');
  }

  ketchup() {
    return this.belongsTo('App/Models/MapaRuteo', 'ketchup_id');
  }
}

module.exports = Ruteo;
