'use strict';

class UpdateMapaAlarma {
  get rules() {
    const id = this.ctx.params.id;
    return {
      nombre: `unique:mapa_alarmas,nombre,id,${id}`,
      grupo: `unique:mapa_alarmas,nombre,id,${id}`,
      tag: `unique:mapa_alarmas,nombre,id,${id}`
    };
  }

  get messages() {
    return {
      'nombre.unique': 'El mapa de alarma ya se encuentra registrada.',
      'grupo.unique': 'El mapa de alarma ya se encuentra registrada.',
      'tag.unique': 'El mapa de alarma ya se encuentra registrada.'
    };
  }
}

module.exports = UpdateMapaAlarma;
