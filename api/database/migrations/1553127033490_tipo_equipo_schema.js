'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TipoEquipoSchema extends Schema {
  up() {
    this.create('tipo_equipos', table => {
      table.increments();
      table
        .string('nombre')
        .notNullable()
        .unique();
      table.integer('jerarquia');
    });
  }

  down() {
    this.drop('tipo_equipos');
  }
}

module.exports = TipoEquipoSchema;
