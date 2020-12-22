'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EstadoSchema extends Schema {
  up() {
    this.create('estados', table => {
      table.bigincrements();
      table.datetime('fecha');
      table.integer('estado');
      table.integer('duracion');
      table.integer('equipo_id').unsigned();
      table
        .foreign('equipo_id')
        .references('equipos.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('estados');
  }
}

module.exports = EstadoSchema;
