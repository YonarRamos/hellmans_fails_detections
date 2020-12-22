'use strict';

class ReconocerAlarma {
  get rules() {
    return {
      detalle: 'required'
    };
  }

  get messages() {
    return {
      'detalle.required': 'El campo detalle es requerido.'
    };
  }
}

module.exports = ReconocerAlarma;
