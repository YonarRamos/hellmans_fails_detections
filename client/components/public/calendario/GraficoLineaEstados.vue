<template>
  <div class="chart px-0">
    <div class="layout row ml-1 mr-1 justify-space-between">
      <div class="headline blue-grey--text">{{ titulo }}</div>
    </div>
    <v-layout row wrap>
      <v-flex xs12 d-flex pb-0>
        <template v-for="(item, i) in items">
          <div
            class="line-chart zoom"
            :key="i + 1"
            :style="getStyleDiv(item)"
            :title="getMessageToolTip(item)"
          ></div>
        </template>
      </v-flex>
      <v-flex xs12 pt-0 d-flex class="grey--text">
        <template v-for="(item, i) in itemsFechas">
          {{ item }}
          <v-spacer :key="i"></v-spacer>
        </template>
      </v-flex>
    </v-layout>
  </div>
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
  transform: scale(1.015);
  opacity: 0.6;
  border-width: 5px;
}
</style>

<script>
import { mapGetters } from 'vuex'
import axios from '@/plugins/axios'
import moment from 'moment'
import mathjs from 'mathjs'
import _ from 'lodash'
export default {
  props: {
    fecha: String,
    titulo: String,
    desde: Date,
    hasta: Date,
    itemsFechas: Array,
    estados: Array
  },

  data: () => ({
    items: []
  }),

  computed: {
    ...mapGetters(['equipoSeleccionado', 'aplicarFiltro'])
  },

  watch: {
    estados() {
      this.formatearEstados()
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
    formatearEstados() {
      const estados = this.estados
        .map((item, i) => {
          if (i === this.estados.length - 1) {
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
