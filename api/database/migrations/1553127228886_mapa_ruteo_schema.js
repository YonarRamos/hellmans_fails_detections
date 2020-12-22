'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MapaRuteoSchema extends Schema {
  up() {
    this.create('mapa_ruteos', table => {
      table.increments();
      table.integer('numeracion');
      table.string('nombre');
      table.integer('tipo_equipo_id').unsigned();
      table
        .foreign('tipo_equipo_id')
        .references('tipo_equipos.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('mapa_ruteos');
  }
}

module.exports = MapaRuteoSchema;
