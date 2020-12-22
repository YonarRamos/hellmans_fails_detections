'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TipoTagSchema extends Schema {
  up() {
    this.create('tipo_tags', table => {
      table.increments();
      table.string('nombre');
      table.string('descripcion');
    });
  }

  down() {
    this.drop('tipo_tags');
  }
}

module.exports = TipoTagSchema;
