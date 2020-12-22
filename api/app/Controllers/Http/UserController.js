'use strict';

const User = use('App/Models/User');

class UserController {
  async cambiarPassword({ request, auth }) {
    const data = request.only(['password']);
    // const usuario = await User.find(id);
    const usuario = await auth.getUser();

    if (!usuario) {
      response.status(404).json({
        message: 'Usuario no encontrada.',
        id
      });
      return;
    }

    usuario.password = data.password;
    return await usuario.save();
  }

  async login({ request, auth }) {
    const { email, password } = request.all();
    const token = await auth.attempt(email, password);

    return token;
  }

  async show({ request, auth }) {
    try {
      const user = await auth.getUser();
      return {
        email: user.email,
        type: user.type,
        id: user.id
      };
    } catch (error) {
      response.send('You are not logged in');
    }
  }
}

module.exports = UserController;
