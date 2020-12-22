'use strict';

const Database = use('Database');
const moment = require('moment');
const _ = require('lodash');

class CipController {
  async index({ request, response, view }) {
    let { page, sortBy, descending, perPage, cip, desde, hasta } = request.get();
    page = page || 1;
    sortBy = sortBy || 'fecha';
    descending = descending || 'ASC';
    perPage = perPage || 10;
    cip = cip || 'CIP1';

    desde = new Date(
      moment(desde)
        .add(-3, 'hours')
        .format('YYYY-MM-DD HH:mm:ss')
    );
    hasta = new Date(
      moment(hasta)
        .add(-3, 'hours')
        .format('YYYY-MM-DD HH:mm:ss')
    );

    let cips = await Database.connection('a2alm')
      .table('v_EventHistory')
      .select('EventStamp', 'TagName', 'Description', 'Area', 'Value')
      .whereBetween('EventStamp', [desde, hasta])
      .whereIn('Area', cip)
      .where('Type', 'LGC ')
      .orderBy('EventStamp', 'DESC');

    let flatDespuesResumem = false;
    cips = cips.filter(cip => {
      if (cip.TagName.includes('Resumen')) {
        flatDespuesResumem = true;
      }
      if (flatDespuesResumem) {
        return true;
      }
    });

    let i = 0;
    cips = cips.map(cip => {
      if (cip.TagName.includes('Resumen')) {
        i = i + 1;
      }
      cip.Index = i;

      return cip;
    });

    const cipsAgrupados = _.groupBy(cips, 'Index');
    let cipsAgrupadosResumen = [];
    for (const key in cipsAgrupados) {
      if (cipsAgrupados[key].length > 0) {
        let operaciones = cipsAgrupados[key];
        const cadena = operaciones[0].Description;
        const indexTiempoNeto = cadena.indexOf('Tiempo neto');
        const indexSeg = cadena.indexOf('seg');
        const indexVolEnv = cadena.indexOf('Vol_env');
        const indexPrimerM3 = cadena.indexOf('m3');
        const indexVolSani = cadena.indexOf('Vol_Sani');
        const indexSegundoM3 = cadena.indexOf('m3', indexPrimerM3 + 1);

        let resumen = {
          descripcion: cadena.substring(0, indexTiempoNeto),
          inicio: operaciones[operaciones.length - 1].EventStamp,
          fin: operaciones[0].EventStamp,
          duracion: cadena.substring(indexTiempoNeto + 13, indexSeg - 1),
          vol_env: cadena.substring(indexVolEnv + 9, indexPrimerM3 + 2),
          vol_sani: cadena.substring(indexVolSani + 10, indexSegundoM3 + 2)
        };

        operaciones = operaciones
          .filter((item, i) => {
            if (i > 0) {
              return true;
            }
          })
          .map(item => {
            const fecha = item.EventStamp;
            const estado = item.Value;
            let modo = '';
            let descripcion = '';

            const indexModo = item.Description.indexOf('Modo:');
            const indexGuionMedio = item.Description.indexOf(' - ');
            modo = item.Description.substring(indexModo + 6, item.Description.length);
            descripcion = item.Description.substring(0, indexGuionMedio);

            return {
              fecha,
              estado,
              modo,
              descripcion
            };
          })
          .sort((a, b) => {
            if (a.fecha > b.fecha) {
              return 1;
            }
            if (a.fecha < b.fecha) {
              return -1;
            }
            return 0;
          });
        resumen.operaciones = operaciones;
        cipsAgrupadosResumen.push(resumen);
      }
    }

    response.status(200).json(cipsAgrupadosResumen);
  }
}

module.exports = CipController;
