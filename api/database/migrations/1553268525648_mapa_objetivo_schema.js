'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MapaObjetivoSchema extends Schema {
  up () {
    this.create('mapa_objetivos', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('mapa_objetivos')
  }
}

module.exports = MapaObjetivoSchema
