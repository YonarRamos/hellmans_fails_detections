'use strict';

class UpdateTipoEquipo {
  get rules() {
    const id = this.ctx.params.id;
    return {
      nombre: `unique:tipo_equipos,nombre,id,${id}`
    };
  }

  get messages() {
    return {
      'nombre.unique': 'El equipo ya se encuentra registrada.'
    };
  }
}

module.exports = UpdateTipoEquipo;
