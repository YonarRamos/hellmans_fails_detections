'use strict';

class StoreMapaAlarma {
  get rules() {
    return {
      nombre: 'required|unique:mapa_alarmas',
      grupo: 'required|unique:mapa_alarmas',
      tag: 'required|unique:mapa_alarmas'
    };
  }

  get messages() {
    return {
      'nombre.required': 'El campo nombre es requerido.',
      'nombre.unique': 'El mapa de alarma ya se encuentra registrada.',
      'grupo.required': 'El grupo nombre es requerido.',
      'grupo.unique': 'El mapa de alarma ya se encuentra registrada.',
      'tag.required': 'El tag nombre es requerido.',
      'tag.unique': 'El mapa de alarma ya se encuentra registrada.'
    };
  }
}

module.exports = StoreMapaAlarma;
