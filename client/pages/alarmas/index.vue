<template>
  <div>
    <v-layout row wrap mb-5>
      <v-flex xs12>
        <div class="blue-grey lighten-5 elevation-1 panel-filtro">
          <v-layout row wrap>
            <v-flex xs4 text-xs-left pl-3 style="margin-top: 4px;">
              <!-- <date-ranger-picker></date-ranger-picker> -->
              <h2 class="blue-grey--text">
                <strong>{{ equipoSeleccionado ? equipoSeleccionado.nombre : 'SELECIONE UN EQUIPO' }}</strong>
                &nbsp;&nbsp;
              </h2>
              <div class="blue-grey--text">
                <span>Desde:</span>
                <span class="grey--text">{{ formatDate(desde) }}</span>
                -
                <span>Hasta:</span>
                <span class="grey--text">{{ formatDate(hasta) }}</span>
              </div>
            </v-flex>
            <v-flex xs8 text-xs-right style="margin-top: -16px;">
              <filtro/>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <v-flex xs12 pa-1 mt-3>
        <grafico-linea-estados/>
      </v-flex>
      <v-flex xs12 pa-1 mt-3>
        <referencia-estados/>
      </v-flex>
      <v-flex xs12 pa-1 mt-3>
        <grafico-top-alarmas/>
      </v-flex>
      <v-flex xs12 pa-1>
        <v-layout row wrap class="mt-3">
          <v-flex xs12 pa-1>
            <tabla-alarmas/>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <menu-seleccion-equipo/>
  </div>
</template>

<script>
import DateRangerPicker from '@/components/common/widgets/DateRangerPicker'
import MenuSeleccionEquipo from '@/components/public/alarma/MenuSeleccionEquipo'
import GraficoTopAlarmas from '@/components/public/alarma/GraficoTopAlarmas'
import GraficoLineaEstados from '@/components/public/alarma/GraficoLineaEstados'
import TablaAlarmas from '@/components/public/alarma/TablaAlarmas'
import ReferenciaEstados from '@/components/public/calendario/ReferenciaEstados'
import Filtro from '@/components/public/alarma/Filtro'
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import math from 'mathjs'
export default {
  middleware: 'authenticated',
  layout: 'custom',
  components: {
    DateRangerPicker,
    MenuSeleccionEquipo,
    GraficoTopAlarmas,
    TablaAlarmas,
    GraficoLineaEstados,
    Filtro,
    ReferenciaEstados
  },
  data: () => ({}),
  computed: {
    ...mapGetters(['equipoSeleccionado', 'desde', 'hasta'])
  },
  methods: {
    ...mapMutations([]),
    formatDate(date) {
      return moment(date)
        .add(3, 'hours')
        .format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style scoped>
.panel-filtro {
  height: 80px;
  border-radius: 4px;
}
</style>

