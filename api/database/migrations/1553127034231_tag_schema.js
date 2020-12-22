'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TagSchema extends Schema {
  up() {
    this.create('tags', table => {
      table.increments();
      table
        .string('tag')
        .notNullable()
        .unique();
      table.integer('tipo_tag_id').unsigned();
      table
        .foreign('tipo_tag_id')
        .references('tipo_tags.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('tags');
  }
}

module.exports = TagSchema;
