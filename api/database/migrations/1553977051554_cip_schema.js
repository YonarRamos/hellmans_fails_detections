'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CipSchema extends Schema {
  up() {
    this.create('cips', table => {
      table.increments();
      table.string('modo');
      table.string('estado');
      table.timestamps();
    });
  }

  down() {
    this.drop('cips');
  }
}

module.exports = CipSchema;
