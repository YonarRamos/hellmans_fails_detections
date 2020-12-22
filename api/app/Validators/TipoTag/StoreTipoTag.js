'use strict';

class StoreTipoTag {
  get rules() {
    return {
      nombre: 'required|unique:tipo_equipos'
    };
  }

  get messages() {
    return {
      'nombre.required': 'El campo nombre es requerido.',
      'nombre.unique': 'El tipo de tag ya se encuentra registrada.'
    };
  }
}

module.exports = StoreTipoTag;
