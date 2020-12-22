'use strict';

class StoreEquipo {
  get rules() {
    return {
      nombre: 'required|unique:equipos'
    };
  }

  get messages() {
    return {
      'nombre.required': 'El campo nombre es requerido.',
      'nombre.unique': 'El equipo ya se encuentra registrada.'
    };
  }
}

module.exports = StoreEquipo;
