'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MapaEstadoSchema extends Schema {
  up() {
    this.create('mapa_estados', table => {
      table.increments();
      table.integer('estado');
      table.string('nombre');
      table.string('color_grafico');
      table.boolean('tiempo_parada').defaultTo(false);
      table.boolean('tiempo_considerado').defaultTo(true);
      table.boolean('falla_propia').defaultTo(false);
      table.boolean('falla_externa').defaultTo(false);
      table.integer('tipo_equipo_id').unsigned();
      table
        .foreign('tipo_equipo_id')
        .references('tipo_equipos.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('mapa_estados');
  }
}

module.exports = MapaEstadoSchema;
