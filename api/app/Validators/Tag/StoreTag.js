'use strict';

class StoreTag {
  get rules() {
    return {
      nombre: 'required|unique:tags'
    };
  }

  get messages() {
    return {
      'nombre.required': 'El campo nombre es requerido.',
      'nombre.unique': 'El tag con nombre ya se encuentra registrada.'
    };
  }
}

module.exports = StoreTag;
