'use strict';

const _ = require('lodash');
const moment = require('moment');
const MapaRuteo = use('App/Models/MapaRuteo');

var FormateaDatos = {
  async estados(estados, equipo) {
    // Formatea para adaptar a modelo Estado
    estados = estados.map((estado, i) => {
      if (i < estados.length - 1) {
        const fechaActual = moment(estados[i].DateTime);
        const fechaProximo = moment(estados[i + 1].DateTime);

        const duracion = fechaProximo.diff(fechaActual, 'seconds');

        return {
          fecha: estado.DateTime,
          estado: estado.Value,
          duracion: duracion,
          equipo_id: equipo.id
        };
      } else {
        return {
          fecha: estado.DateTime,
          estado: estado.Value,
          duracion: -1,
          equipo_id: equipo.id
        };
      }
    });
    return estados;
  },

  async ruteos(ruteos, equipo) {
    let mapaRuteos = await MapaRuteo.query()
      .with('tipo_equipo')
      .fetch();
    mapaRuteos = mapaRuteos.toJSON();

    ruteos = ruteos.map(item => {
      // Extraigo numeracion del cada equipo a partir de valor de ruteo
      const numeracionLinea = parseInt(item.ruteo.substr(0, 2));
      const numeracionColector = parseInt(item.ruteo.substr(2, 2));
      const numeracionTolva = parseInt(item.ruteo.substr(4, 2));
      const numeracionMolino = parseInt(item.ruteo.substr(6, 2));
      const numeracionPremix = parseInt(item.ruteo.substr(8, 2));
      const numeracionPasta = parseInt(item.ruteo.substr(10, 2));
      const numeracionAceite = parseInt(item.ruteo.substr(12, 2));
      const numeracionFaseAcida = parseInt(item.ruteo.substr(14, 2));
      const numeracionESM = parseInt(item.ruteo.substr(16, 2));
      const numeracionCooker = parseInt(item.ruteo.substr(18, 2));
      const numeracionSlurry = parseInt(item.ruteo.substr(20, 2));
      const numeracionKetchup = parseInt(item.ruteo.substr(22, 2));

      // Busco mapa de ruteo asociado a la numeracion
      //  Mapa de linea
      const mapaRuteoLinea = mapaRuteos.find(mapa => {
        if (mapa.tipo_equipo.jerarquia === 1 && mapa.numeracion === numeracionLinea) {
          return true;
        }
      });
      item.linea_id = mapaRuteoLinea ? mapaRuteoLinea.id : 0;

      //  Mapa de colector
      const mapaRuteoColector = mapaRuteos.find(mapa => {
        if (mapa.tipo_equipo.jerarquia === 2 && mapa.numeracion === numeracionColector) {
          return true;
        }
      });
      item.colector_id = mapaRuteoColector ? mapaRuteoColector.id : 0;

      //  Mapa de tolva
      const mapaRuteoTolva = mapaRuteos.find(mapa => {
        if (mapa.tipo_equipo.jerarquia === 3 && mapa.numeracion === numeracionTolva) {
          return true;
        }
      });
      item.tolva_id = mapaRuteoTolva ? mapaRuteoTolva.id : 0;

      //  Mapa de molino
      const mapaRuteoMolino = mapaRuteos.find(mapa => {
        if (mapa.tipo_equipo.jerarquia === 4 && mapa.numeracion === numeracionMolino) {
          return true;
        }
      });
      item.molino_id = mapaRuteoMolino ? mapaRuteoMolino.id : 0;

      //  Mapa de premix
      const mapaRuteoPremix = mapaRuteos.find(mapa => {
        if (mapa.tipo_equipo.jerarquia === 5 && mapa.numeracion === numeracionPremix) {
          return true;
        }
      });
      item.premix_id = mapaRuteoPremix ? mapaRuteoPremix.id : 0;

      //  Mapa de pasta
      const mapaRuteoPasta = mapaRuteos.find(mapa => {
        if (mapa.tipo_equipo.jerarquia === 6 && mapa.numeracion === numeracionPasta) {
          return true;
        }
      });
      item.tk_pasta_id = mapaRuteoPasta ? mapaRuteoPasta.id : 0;

      //  Mapa de aceite
      const mapaRuteoAceite = mapaRuteos.find(mapa => {
        if (mapa.tipo_equipo.jerarquia === 7 && mapa.numeracion === numeracionAceite) {
          return true;
        }
      });
      item.aceite_id = mapaRuteoAceite ? mapaRuteoAceite.id : 0;

      //  Mapa de Fase Acida
      const mapaRuteoFaseAcida = mapaRuteos.find(mapa => {
        if (mapa.tipo_equipo.jerarquia === 8 && mapa.numeracion === numeracionFaseAcida) {
          return true;
        }
      });
      item.fase_acida_id = mapaRuteoFaseAcida ? mapaRuteoFaseAcida.id : 0;

      //  Mapa de ESM
      const mapaRuteoESM = mapaRuteos.find(mapa => {
        if (mapa.tipo_equipo.jerarquia === 9 && mapa.numeracion === numeracionESM) {
          return true;
        }
      });
      item.esm_id = mapaRuteoESM.id;

      //  Mapa de cooker
      const mapaRuteoCooker = mapaRuteos.find(mapa => {
        if (mapa.tipo_equipo.jerarquia === 10 && mapa.numeracion === numeracionCooker) {
          return true;
        }
      });
      item.cooker_id = mapaRuteoCooker ? mapaRuteoCooker.id : 0;

      //  Mapa de slurry
      const mapaRuteoSlurry = mapaRuteos.find(mapa => {
        if (mapa.tipo_equipo.jerarquia === 11 && mapa.numeracion === numeracionSlurry) {
          return true;
        }
      });
      item.tk_slurry_id = mapaRuteoSlurry ? mapaRuteoSlurry.id : 0;

      //  Mapa de ketchup
      const mapaRuteoKetchup = mapaRuteos.find(mapa => {
        if (mapa.tipo_equipo.jerarquia === 12 && mapa.numeracion === numeracionKetchup) {
          return true;
        }
      });
      item.ketchup_id = mapaRuteoKetchup ? mapaRuteoKetchup.id : 0;

      return item;
    });

    return ruteos;
  }
};

module.exports = FormateaDatos;
