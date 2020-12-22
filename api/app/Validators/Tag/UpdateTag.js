'use strict';

class UpdateTag {
  get rules() {
    const id = this.ctx.params.id;
    return {
      nombre: `unique:tags,nombre,id,${id}`
    };
  }

  get messages() {
    return {
      'nombre.unique': 'El tag con nombre ya se encuentra registrada.'
    };
  }
}

module.exports = UpdateTag;
