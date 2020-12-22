'use strict';

class StoreMapaEstado {
  get rules() {
    return {
      nombre: 'required|unique:mapa_alarmas'
    };
  }

  get messages() {
    return {
      'nombre.required': 'El campo nombre es requerido.',
      'nombre.unique': 'El mapa de alarma ya se encuentra registrada.'
    };
  }
}

module.exports = StoreMapaEstado;
