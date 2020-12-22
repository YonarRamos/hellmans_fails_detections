'use strict';

class StoreTipoEquipo {
  get rules() {
    return {
      nombre: 'required|unique:tipo_equipos'
    };
  }

  get messages() {
    return {
      'nombre.required': 'El campo nombre es requerido.',
      'nombre.unique': 'El equipo ya se encuentra registrada.'
    };
  }
}

module.exports = StoreTipoEquipo;
