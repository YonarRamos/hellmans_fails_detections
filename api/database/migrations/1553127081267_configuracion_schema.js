'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ConfiguracionSchema extends Schema {
  up() {
    this.create('configuraciones', table => {
      table.increments();
      table.string('tag');
      table.string('descripcion');
      table.string('valor');
    });
  }

  down() {
    this.drop('configuraciones');
  }
}

module.exports = ConfiguracionSchema;
