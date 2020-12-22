'use strict';

class StoreMapaCausa {
  get rules() {
    return {
      nombre: 'required',
      tipo_equipo_id: 'required'
    };
  }

  get messages() {
    return {
      'nombre.required': 'El campo nombre es requerido.',
      'tipo_equipo_id.required': 'La relacion debe estar referenciada con un tipo de equipo.'
    };
  }
}

module.exports = StoreMapaCausa;
