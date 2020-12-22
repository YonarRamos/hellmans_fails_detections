'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EquipoSchema extends Schema {
  up() {
    this.create('equipos', table => {
      table.increments();
      table.string('nombre');
      table.string('descripcion');
      table.string('categoria').defaultTo('equipo');
      table.string('grupo');
      table.string('sub_grupo');
      table.boolean('notificar_estado').defaultTo(false);
      table.boolean('notificar_alarma').defaultTo(false);
      table.datetime('ultima_actualizacion').defaultTo(this.fn.now());
      table.integer('tipo_equipo_id').unsigned();
      table
        .foreign('tipo_equipo_id')
        .references('tipo_equipos.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('equipos');
  }
}

module.exports = EquipoSchema;
