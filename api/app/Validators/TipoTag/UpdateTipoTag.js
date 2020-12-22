'use strict';

class UpdateTipoEquipo {
  get rules() {
    const id = this.ctx.params.id;
    return {
      nombre: `unique:tipo_tags,nombre,id,${id}`
    };
  }

  get messages() {
    return {
      'nombre.unique': 'El tipo de tag ya se encuentra registrada.'
    };
  }
}

module.exports = UpdateTipoEquipo;
