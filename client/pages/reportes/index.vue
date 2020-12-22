<template>
  <div>
    <v-layout row wrap mb-5>
      <v-flex xs12>
        <div class="blue-grey lighten-5 elevation-1 panel-filtro">
          <v-layout row wrap>
            <v-flex xs5 text-xs-left pl-3 style="margin-top: 4px;">
              <!-- <date-ranger-picker></date-ranger-picker> -->
              <h2 class="blue-grey--text">
                <strong>{{ 'Reporte de equipos y/o lineas' }}</strong>
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
            <v-flex xs7 text-xs-right style="margin-top: -16px;">
              <filtro/>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <v-flex xs12 mt-3>
        <tabla-reportes/>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Filtro from '@/components/public/reporte/Filtro'
import TablaReportes from '@/components/public/reporte/TablaReportes'
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import math from 'mathjs'
export default {
  middleware: 'authenticated',
  layout: 'custom',
  components: {
    TablaReportes,
    Filtro
  },
  data: () => ({}),
  created() {
    this.SET_EQUIPO_SELECCIONADO(null)
  },
  computed: {
    ...mapGetters(['equipo', 'desde', 'hasta'])
  },
  methods: {
    ...mapMutations([
      'SET_DESDE',
      'SET_HASTA',
      'SET_APLICAR_FILTRO',
      'SET_EQUIPO_SELECCIONADO'
    ]),
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
