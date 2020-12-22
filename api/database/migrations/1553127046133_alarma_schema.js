'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AlarmaSchema extends Schema {
  up() {
    this.create('alarmas', table => {
      table.bigincrements();
      table.datetime('fecha');
      table.string('nombre');
      table.string('grupo');
      table.string('tag');
      table.integer('duracion');
      table.boolean('reconocida').defaultTo(false);
      table.string('detalle');
      table.datetime('fecha_reconocida');
      table.integer('mapa_causa_id');
      table.integer('equipo_id').unsigned();
      table
        .foreign('equipo_id')
        .references('equipos.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('alarmas');
  }
}

module.exports = AlarmaSchema;
