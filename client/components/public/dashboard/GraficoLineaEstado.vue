<template>
  <v-card color="blue-grey lighten-5">
    <div class="chart">
      <v-layout row wrap>
        <v-flex xs12 d-flex pa-1>
          <template v-for="(item, i) in items">
            <div
              class="line-chart zoom"
              :key="i + 1"
              :style="getStyleDiv(item)"
              :title="getMessageToolTip(item)"
            ></div>
          </template>
        </v-flex>
      </v-layout>
    </div>
  </v-card>
</template>

<style scoped>
.line-chart {
  height: 30px;
}
.zoom {
  transition: transform 0.2s;
  margin: 0 auto;
}
.zoom:hover {
  transform: scale(1);
  opacity: 0.6;
  border-width: 5px;
}
</style>

<script>
import { mapGetters } from 'vuex'
import axios from '@/plugins/axios'
import moment from 'moment'
import mathjs from 'mathjs'
export default {
  props: {
    equipo: Object
  },

  data: () => ({
    duracionTotal: 0,
    items: []
  }),

  mounted() {
    this.duracionTotal = this.equipo.duracion_total
    this.items = this.equipo.estados.map(item => {
      const porc = item.duracion / this.duracionTotal
      item.porc = porc * 100
      return item
    })
  },

  methods: {
    getStyleDiv(item) {
      const color = item.color_grafico
      return 'width:' + item.porc + '% ; background-color: ' + color
    },
    getMessageToolTip(item) {
      let state = item.nombre
      return (
        'Tipo: ' +
        state +
        ' \n' +
        'Desde: ' +
        moment(item.fecha)
          .add(3, 'hours')
          .format('YYYY-MM-DD HH:mm') +
        ' \nDuracion: ' +
        mathjs.round(item.duracion / 60, 2)
      )
    }
  }
}
</script>
