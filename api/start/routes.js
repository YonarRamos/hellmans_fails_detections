'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('/', () => {
  return { greeting: 'API REST Reporte fallas Hellmanns - Systelec S.A' };
});

// Equipos
Route.get('api/v1/equipos', 'EquipoController.index');
Route.get('api/v1/equipos/:id', 'EquipoController.show');
Route.post('api/v1/equipos', 'EquipoController.store').validator('Equipo/StoreEquipo');
Route.put('api/v1/equipos/:id', 'EquipoController.update').validator('Equipo/UpdateEquipo');
Route.delete('api/v1/equipos/:id', 'EquipoController.destroy');
Route.get('api/v1/equipos/:id/estados', 'EquipoController.indexEstados');
Route.get('api/v1/equipos/:id/alarmas', 'EquipoController.indexAlarmas');
Route.get('api/v1/equipos/:id/ruteos', 'EquipoController.indexRuteos');
Route.get('api/v1/equipos/:id/mapa_causas', 'EquipoController.indexMapaCausas');
Route.get('api/v1/equipos/:id/mapa_estados', 'EquipoController.indexMapaEstados');

// Alarmas
Route.get('api/v1/alarmas', 'AlarmaController.index');
Route.get('api/v1/alarmas_sin_reconocer', 'AlarmaController.indexSinReconocer');
Route.get('api/v1/grupos_alarmas', 'AlarmaController.indexGrupoAlarmas');
Route.get('api/v1/alarmas/reportes', 'AlarmaController.reportes');
Route.post('api/v1/alarmas/:id/reconocer', 'AlarmaController.reconocer').validator(
  'Alarma/ReconocerAlarma'
);

// Configuracions
Route.get('api/v1/configuraciones', 'ConfiguracionController.index');
Route.get('api/v1/configuraciones/:id', 'ConfiguracionController.show');
Route.post('api/v1/configuraciones', 'ConfiguracionController.store').validator(
  'Configuracion/StoreConfiguracion'
);
Route.put('api/v1/configuraciones/:id', 'ConfiguracionController.update').validator(
  'Configuracion/UpdateConfiguracion'
);
Route.delete('api/v1/configuraciones/:id', 'ConfiguracionController.destroy');

// Estados
Route.get('api/v1/estados', 'EstadoController.index');
Route.get('api/v1/estados/:id', 'EstadoController.show');

// Ruteos
Route.get('api/v1/ruteos', 'RuteoController.index');
Route.get('api/v1/ruteos/:id', 'RuteoController.show');

// MapaAlarmas
Route.get('api/v1/mapa_alarmas', 'MapaAlarmaController.index');
Route.get('api/v1/mapa_alarmas/:id', 'MapaAlarmaController.show');
Route.post('api/v1/mapa_alarmas', 'MapaAlarmaController.store').validator(
  'MapaAlarma/StoreMapaAlarma'
);
Route.put('api/v1/mapa_alarmas/:id', 'MapaAlarmaController.update').validator(
  'MapaAlarma/UpdateMapaAlarma'
);
Route.delete('api/v1/mapa_alarmas/:id', 'MapaAlarmaController.destroy');

// MapaCausas
Route.get('api/v1/mapa_causas', 'MapaCausaController.index');
Route.get('api/v1/mapa_causas/:id', 'MapaCausaController.show');
Route.post('api/v1/mapa_causas', 'MapaCausaController.store').validator('MapaCausa/StoreMapaCausa');
Route.put('api/v1/mapa_causas/:id', 'MapaCausaController.update');
Route.delete('api/v1/mapa_causas/:id', 'MapaCausaController.destroy');

// MapaEstados
Route.get('api/v1/mapa_estados', 'MapaEstadoController.index');
Route.get('api/v1/mapa_estados/:id', 'MapaEstadoController.show');
Route.post('api/v1/mapa_estados', 'MapaEstadoController.store').validator(
  'MapaEstado/StoreMapaEstado'
);
Route.put('api/v1/mapa_estados/:id', 'MapaEstadoController.update').validator(
  'MapaEstado/UpdateMapaEstado'
);
Route.delete('api/v1/mapa_estados/:id', 'MapaEstadoController.destroy');

// MapaRuteos
Route.get('api/v1/mapa_ruteos', 'MapaRuteoController.index');
Route.get('api/v1/mapa_ruteos/:id', 'MapaRuteoController.show');
Route.post('api/v1/mapa_ruteos', 'MapaRuteoController.store').validator('MapaRuteo/StoreMapaRuteo');
Route.put('api/v1/mapa_ruteos/:id', 'MapaRuteoController.update').validator(
  'MapaRuteo/UpdateMapaRuteo'
);
Route.delete('api/v1/mapa_ruteos/:id', 'MapaRuteoController.destroy');

// Tags
Route.get('api/v1/tags', 'TagController.index');
Route.get('api/v1/tags/:id', 'TagController.show');
Route.post('api/v1/tags', 'TagController.store').validator('Tag/StoreTag');
Route.put('api/v1/tags/:id', 'TagController.update').validator('Tag/UpdateTag');
Route.delete('api/v1/tags/:id', 'TagController.destroy');

// TipoEquipos
Route.get('api/v1/tipo_equipos', 'TipoEquipoController.index');
Route.get('api/v1/tipo_equipos/:id', 'TipoEquipoController.show');
Route.post('api/v1/tipo_equipos', 'TipoEquipoController.store').validator(
  'TipoEquipo/StoreTipoEquipo'
);
Route.put('api/v1/tipo_equipos/:id', 'TipoEquipoController.update').validator(
  'TipoEquipo/UpdateTipoEquipo'
);
Route.delete('api/v1/tipo_equipos/:id', 'TipoEquipoController.destroy');

// TipoTags
Route.get('api/v1/tipo_tags', 'TipoTagController.index');
Route.get('api/v1/tipo_tags/:id', 'TipoTagController.show');
Route.post('api/v1/tipo_tags', 'TipoTagController.store').validator('TipoTag/StoreTipoTag');
Route.put('api/v1/tipo_tags/:id', 'TipoTagController.update').validator('TipoTag/UpdateTipoTag');
Route.delete('api/v1/tipo_tags/:id', 'TipoTagController.destroy');

// Cips
Route.get('api/v1/cips', 'CipController.index');

// Usarios
Route.post('api/v1/cambiar_password', 'UserController.cambiarPassword');
Route.post('api/v1/login', 'UserController.login');
Route.get('api/v1/who_is', 'UserController.show');
