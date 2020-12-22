'use strict';

class UpdateMapaEstado {
  get rules() {
    const id = this.ctx.params.id;
    return {
      nombre: `unique:mapa_alarmas,nombre,id,${id}`
    };
  }

  get messages() {
    return {
      'nombre.unique': 'El mapa de alarma ya se encuentra registrada.'
    };
  }
}

module.exports = UpdateMapaEstado;
