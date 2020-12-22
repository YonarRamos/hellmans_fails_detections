'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MapaCausaSchema extends Schema {
  up() {
    this.create('mapa_causas', table => {
      table.increments();
      table.string('nombre');
      table.string('descripcion');
      table.integer('tipo_equipo_id').unsigned();
      table
        .foreign('tipo_equipo_id')
        .references('tipo_equipos.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('mapa_causas');
  }
}

module.exports = MapaCausaSchema;
