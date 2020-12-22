'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MapaRuteoTagSchema extends Schema {
  up() {
    this.create('mapa_ruteo_tag', table => {
      table.increments();
      table.integer('mapa_ruteo_id').unsigned();
      table
        .foreign('mapa_ruteo_id')
        .references('mapa_ruteos.id')
        .onDelete('cascade');
      table.integer('tag_id').unsigned();
      table
        .foreign('tag_id')
        .references('tags.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('mapa_ruteo_tag');
  }
}

module.exports = MapaRuteoTagSchema;
