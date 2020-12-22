'use strict';

class StoreEquipo {
  get rules() {
    return {
      tag: 'required|unique:configuraciones',
      nombre: 'required|unique:configuraciones',
      valor: 'required'
    };
  }

  get messages() {
    return {
      'nombre.required': 'El campo nombre es requerido.',
      'nombre.unique': 'El equipo ya se encuentra registrada.',
      'tag.required': 'El campo tag es requerido.',
      'tag.unique': 'El tag ya se encuentra registrada.',
      'valor.required': 'El campo tag es requerido.'
    };
  }
}

module.exports = StoreEquipo;
