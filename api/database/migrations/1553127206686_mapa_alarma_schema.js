'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MapaAlarmaSchema extends Schema {
  up() {
    this.create('mapa_alarmas', table => {
      table.increments();
      table.string('nombre');
      table.string('grupo');
      table.string('tag');
      table.boolean('cosiderada').defaultTo(false);
      table.boolean('silenciada').defaultTo(false);
    });
  }

  down() {
    this.drop('mapa_alarmas');
  }
}

module.exports = MapaAlarmaSchema;
