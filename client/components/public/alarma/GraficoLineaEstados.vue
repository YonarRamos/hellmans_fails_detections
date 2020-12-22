<template>
  <v-card color="blue-grey lighten-5 pa-1 carta-grafico">
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
.carta-grafico {
  height: 40px;
}
</style>

<script>
import { mapGetters } from 'vuex'
import axios from '@/plugins/axios'
import moment from 'moment'
import mathjs from 'mathjs'
import _ from 'lodash'
export default {
  data: () => ({
    duracionTotal: 0,
    items: []
  }),

  computed: {
    ...mapGetters(['equipoSeleccionado', 'desde', 'hasta', 'aplicarFiltro'])
  },

  watch: {
    async aplicarFiltro() {
      if (this.equipoSeleccionado) {
        await this.getEstados()
      }
    }
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
        mathjs.round(item.duracion / 60, 2) +
        ' min'
      )
    },
    async getEstados() {
      await axios
        .get(`equipos/${this.equipoSeleccionado.id}/estados`, {
          params: {
            desde: this.desde,
            hasta: this.hasta
          }
        })
        .then(response => {
          const estados = response.data
            .map((item, i) => {
              if (i === response.data.length - 1) {
                const duracion = moment(this.hasta).diff(item.fecha, 'seconds')
                item.duracion = duracion
              }
              return item
            })
            .sort((a, b) => {
              if (a.fecha > b.fecha) {
                return 1
              }
              if (a.fecha < b.fecha) {
                return -1
              }
              return 0
            })

          const duracionTotal = _.sumBy(estados, 'duracion')
          this.items = estados.map((item, i) => {
            const porc = item.duracion / duracionTotal
            item.porc = porc * 100
            return item
          })
        })
    }
  }
}
</script>
