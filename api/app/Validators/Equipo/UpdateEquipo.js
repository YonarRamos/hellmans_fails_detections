'use strict';

class UpdateEquipo {
  get rules() {
    const id = this.ctx.params.id;
    return {
      nombre: `unique:equipos,nombre,id,${id}`
    };
  }

  get messages() {
    return {
      'nombre.unique': 'El equipo ya se encuentra registrada.'
    };
  }
}

module.exports = UpdateEquipo;
