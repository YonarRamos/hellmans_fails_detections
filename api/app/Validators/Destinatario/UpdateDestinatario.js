'use strict';

class UpdateDestinatario {
  get rules() {
    const id = this.ctx.params.id;
    return {
      email: `unique:destinatarios,email,id,${id}`
    };
  }

  get messages() {
    return {
      'email.unique': 'El email ya se encuentra registrado.'
    };
  }
}

module.exports = UpdateDestinatario;
