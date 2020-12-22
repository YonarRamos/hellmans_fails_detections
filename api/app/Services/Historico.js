'use strict';

const Database = use('Database');
const Ruteo = use('App/Models/Ruteo');

class Historico {
  async guardaEstadosPorEquipo(estados) {
    try {
      // Busco en estados a que equipo pertenece
      if (estados.length > 0) {
        const equipoId = estados[0].equipo_id;

        // Transaccion elimina ultimo estado de equipo con -1 y guarda nuevo
        const trx = await Database.beginTransaction();

        await trx
          .table('estados')
          .where('equipo_id', equipoId)
          .where('duracion', -1)
          .delete();
        await trx.from('estados').insert(estados);

        await trx.commit();
        await trx.rollback();
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async guardaRuteosPorEquipo(ruteos) {
    try {
      // Busco en ruteos a que equipo pertenece
      if (ruteos.length > 0) {
        const trx = await Database.beginTransaction();

        await trx.from('ruteos').insert(ruteos);

        await trx.commit();
        await trx.rollback();
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getRuteoPrevio(equipo, fecha) {
    let ruteoPrevio = await Ruteo.query()
      .with('linea', builder => {
        builder.with('tipo_equipo').with('tags');
      })
      .with('colector', builder => {
        builder.with('tipo_equipo').with('tags');
      })
      .with('tolva', builder => {
        builder.with('tipo_equipo').with('tags');
      })
      .with('molino', builder => {
        builder.with('tipo_equipo').with('tags');
      })
      .with('premix', builder => {
        builder.with('tipo_equipo').with('tags');
      })
      .with('tk_pasta', builder => {
        builder.with('tipo_equipo').with('tags');
      })
      .with('aceite', builder => {
        builder.with('tipo_equipo').with('tags');
      })
      .with('fase_acida', builder => {
        builder.with('tipo_equipo').with('tags');
      })
      .with('esm', builder => {
        builder.with('tipo_equipo').with('tags');
      })
      .with('cooker', builder => {
        builder.with('tipo_equipo').with('tags');
      })
      .with('tk_slurry', builder => {
        builder.with('tipo_equipo').with('tags');
      })
      .with('ketchup', builder => {
        builder.with('tipo_equipo').with('tags');
      })
      .where('fecha', '<=', fecha)
      .where('equipo_id', equipo.id)
      .orderBy('fecha', 'DESC')
      .first();
    ruteoPrevio = ruteoPrevio ? ruteoPrevio.toJSON() : null;
    return ruteoPrevio;
  }
}

module.exports = Historico;
