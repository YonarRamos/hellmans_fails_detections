'use strict';

const Database = use('Database');
const moment = require('moment');

class Wonder {
  async getEstados(variable, desde, hasta) {
    try {
      const estados = await Database.connection('wonder')
        .table('History')
        .select('DateTime', 'TagName', 'Value')
        .where('OPCQuality', 192)
        .where('TagName', variable)
        .where('DateTime', '>', desde)
        .where('DateTime', '<', hasta)
        .orderBy('DateTime', 'ASC');

      return estados;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getRuteos(variable, desde, hasta) {
    try {
      const ruteos = await Database.connection('wonder')
        .table('History')
        .select('DateTime', 'TagName', 'Value')
        .where('OPCQuality', 192)
        .where('TagName', 'like', `%${variable}%`)
        .where('DateTime', '>', desde)
        .where('DateTime', '<', hasta)
        .orderBy('DateTime', 'ASC');

      return ruteos;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getAlarmas(variable, desde, hasta) {
    try {
      desde = new Date(
        moment(desde)
          .add(3, 'hours')
          .format('YYYY-MM-DD HH:mm:ss')
      );
      hasta = new Date(
        moment(hasta)
          .add(3, 'hours')
          .format('YYYY-MM-DD HH:mm:ss')
      );

      const alarmas = await Database.connection('mssql')
        .table('v_AlarmHistory')
        .select('fecha', 'descripcion', 'area', 'tag', 'considerada', 'silenciada')
        .where('area', 'like', `%${variable}%`)
        .where('silenciada', false)
        .whereBetween('fecha', [desde, hasta])
        .orderBy('fecha', 'DESC');

      return alarmas;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getEstadoFallaPrevio(variable, estadosFalla, fecha) {
    try {
      const estado = await Database.connection('wonder')
        .table('History')
        .select('DateTime', 'TagName', 'Value')
        .where('OPCQuality', 192)
        .where('TagName', variable)
        .where('DateTime', '<=', fecha)
        .whereIn('Value', estadosFalla)
        .orderBy('DateTime', 'ASC')
        .first();

      return estado;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getLive(variables) {
    try {
      const historicos = await Database.connection('wonder')
        .table('Live')
        .select('DateTime', 'TagName', 'Value')
        .where('OPCQuality', 192)
        .whereIn('TagName', variables);

      return historicos;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = Wonder;
