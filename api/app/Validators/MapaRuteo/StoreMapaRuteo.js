'use strict';

class StoreMapaRuteo {
  get rules() {
    return {
      nombre: 'required',
      estado: 'required'
    };
  }

  get messages() {
    return {
      'nombre.required': 'El campo nombre es requerido.',
      'estado.required': 'El campo estado es requerido.'
    };
  }
}

module.exports = StoreMapaRuteo;
