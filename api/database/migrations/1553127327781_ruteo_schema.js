'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RuteoSchema extends Schema {
  up() {
    this.create('ruteos', table => {
      table.bigincrements();
      table.datetime('fecha');
      table.string('ruteo');
      table.integer('linea_id').unsigned();
      table.integer('colector_id').unsigned();
      table.integer('tolva_id').unsigned();
      table.integer('molino_id').unsigned();
      table.integer('premix_id').unsigned();
      table.integer('tk_pasta_id').unsigned();
      table.integer('aceite_id').unsigned();
      table.integer('fase_acida_id').unsigned();
      table.integer('esm_id').unsigned();
      table.integer('cooker_id').unsigned();
      table.integer('tk_slurry_id').unsigned();
      table.integer('ketchup_id').unsigned();
      table.integer('equipo_id').unsigned();
      table
        .foreign('equipo_id')
        .references('equipos.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('ruteos');
  }
}

module.exports = RuteoSchema;
