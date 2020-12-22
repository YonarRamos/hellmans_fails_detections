'use strict';

/*
|--------------------------------------------------------------------------
| Websocket
|--------------------------------------------------------------------------
|
| This file is used to register websocket channels and start the Ws server.
| Learn more about same in the official documentation.
| https://adonisjs.com/docs/websocket
|
| For middleware, do check `wsKernel.js` file.
|
*/

const Ws = use('Ws');
const Socket = require('../app/Services/Socket');
const Alarma = use('App/Models/Alarma');
const Redis = use('Redis');

Ws.channel('socket', async ({ socket }) => {
  console.log('Se ha unido un usuario ID: %s', socket.id, 'Topic:', socket.topic);

  try {
    // Cuento cantidad de alarmas sin reconocer y emito
    // const cantidadAlarmSinReconocer = await Alarma.query()
    //   .where('reconocida', false)
    //   .getCount();
    // await Redis.set('cantidad_alarmas_sin_reconocer', cantidadAlarmSinReconocer);
    // socket.broadcastToAll('cantidad_alarmas_sin_reconocer', cantidadAlarmSinReconocer);

    // Emito ultimo valor del socket
    // const datosSocket = await Redis.get('datos_socket');
    const io = new Socket();
    const datosSocket = await io.socketEquipo();

    socket.broadcastToAll('notificacion_estados', JSON.stringify(datosSocket));
  } catch (error) {
    console.log(error);
  }
});
