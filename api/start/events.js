const User = use('App/Models/User');
const Adquisicion = require('../app/Jobs/Adquisicion');
const FiltroDatos = require('../app/Utils/FiltroDatos');
const FormateaDatos = require('../app/Utils/FormateaDatos');
const FechaAdquisicion = require('../app/Utils/FechaAdquisicion');
const Historico = require('../app/Services/Historico');
const Wonder = require('../app/Services/Wonder');
const Ruteo = use('App/Models/Ruteo');
const Estado = use('App/Models/Estado');
const Equipo = use('App/Models/Equipo');
const _ = require('lodash');
const moment = require('moment');

initialCreate();
cyclicEvent();
// test();

async function cyclicEvent() {
  try {
    // await Adquisicion.datos();

    setTimeout(async () => {
      cyclicEvent();
    }, 20000);

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

async function initialCreate() {
  let user = await User.query()
    .where('username', 'admin')
    .first();

  if (!user) {
    user = await User.create({
      username: 'admin',
      email: 'admin@unilever.com',
      password: 'admin',
      type: 'Administrador'
    });
    console.log('Usuario creado con exito!');
  }
  console.log('email:', user.email, 'username:', user.username);

  let userOperador = await User.query()
    .where('username', 'operador')
    .first();

  if (!userOperador) {
    userOperador = await User.create({
      username: 'operador',
      email: 'operador@unilever.com',
      password: 'operador',
      type: 'Operador'
    });
    console.log('Usuario operador creado con exito!');
  }
}

async function test() {
  const fechas = await FechaAdquisicion.fechaNotificacion();
  const desde = new Date(
    moment(fechas[0])
      .add(3, 'hours')
      .format('YYYY-MM-DD HH:mm:ss')
  );
  console.log(fechas[0], desde);
}
