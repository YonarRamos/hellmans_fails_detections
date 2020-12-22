'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EquipoTagSchema extends Schema {
  up() {
    this.create('equipo_tag', table => {
      table.increments();
      table.integer('equipo_id').unsigned();
      table
        .foreign('equipo_id')
        .references('equipos.id')
        .onDelete('cascade');
      table.integer('tag_id').unsigned();
      table
        .foreign('tag_id')
        .references('tags.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('equipo_tag');
  }
}

module.exports = EquipoTagSchema;
