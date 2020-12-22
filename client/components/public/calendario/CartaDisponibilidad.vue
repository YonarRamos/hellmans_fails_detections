<template>
  <div>
    <v-card color="blue-grey lighten-5">
      <v-card-title>
        <div v-if="!loading" class="layout row ma-0 justify-space-between pb-1">
          <div class="headline blue-grey--text">{{ titulo }}</div>
          <div class="icon">
            <v-icon :color="getColor(disponibilidad)">{{ getIcon(disponibilidad) }}</v-icon>
          </div>
        </div>
        <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
      </v-card-title>
      <v-card-text>
        <div class="justify-center row layout ma-0" @click="verAlarmas()" style="cursor: pointer;">
          <v-progress-circular
            :size="size"
            :width="width"
            :rotate="-90"
            :value="parseFloat(disponibilidad)"
            :color="getColor(disponibilidad)"
          >
            <h4>{{ disponibilidad }} %</h4>
          </v-progress-circular>
        </div>
      </v-card-text>
    </v-card>
    <v-dialog v-if="dialog" v-model="dialog" width="1000">
      <v-card color="blue-grey lighten-5">
        <v-card-title>
          <div class="layout row ma-0 justify-space-between pb-1">
            <div
              class="headline blue-grey--text"
            >{{ equipoSeleccionado ? equipoSeleccionado.Nombre : '' }}</div>
          </div>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="alarmas"
          :loading="loadingAlarmas"
          style="width: 100%"
          class="elevation-0 table-striped pl-1 pr-1 pb-1"
          no-data-text="No hay datos registrados en el sistema"
          rows-per-page-text="Por pagina"
          disable-initial-sort
          hide-actions
        >
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr>
              <td>{{ props.item.fecha | formatearFecha }}</td>
              <td>{{ props.item.nombre }}</td>
              <td>{{ props.item.duracion / 60 | redondear }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from '@/plugins/axios'
import targetDisponibilidad from '@/api/target'
import mixins from '@/mixins'
import moment from 'moment'
import mathjs from 'mathjs'
import _ from 'lodash'
export default {
  props: {
    fecha: String,
    titulo: String,
    desde: Date,
    hasta: Date,
    size: Number,
    width: Number,
    estados: Array
  },

  data: () => ({
    loading: false,
    loadingAlarmas: false,
    headers: [
      { text: 'Fecha', value: 'Fecha' },
      { text: 'Nombre', value: 'Nombre' },
      { text: 'Duracion', value: 'Duracion' }
    ],
    alarmas: [],
    mapaEstados: [],
    disponibilidad: 0,
    states: [],
    dialog: false,
    icon: null,
    iconState: null,
    colorState: null,
    value: null,
    color: null,
    target: targetDisponibilidad
  }),

  mixins: [mixins],

  computed: {
    ...mapGetters(['aplicarFiltro', 'equipoSeleccionado'])
  },

  watch: {
    estados() {
      this.formatearEstados()
    }
  },

  methods: {
    getColor(value) {
      if (value <= this.target.targetDisponibilidad.small) {
        return 'red'
      }
      if (value <= this.target.targetDisponibilidad.medium) {
        return 'orange'
      }
      return 'green'
    },
    getIcon(value) {
      if (value <= this.target.targetDisponibilidad.small) {
        return 'trhastaing_down'
      }
      if (value <= this.target.targetDisponibilidad.medium) {
        return 'trhastaing_flat'
      }
      return 'trhastaing_up'
    },
    getIconState(value) {
      if (value === 1) {
        return 'cancel'
      }
      if (value === 2) {
        return 'check_circle'
      }
      return 'warning'
    },
    getColorState(value) {
      if (value === 1) {
        return 'red'
      }
      if (value === 2) {
        return 'green'
      }
      return 'orange'
    },
    async verAlarmas() {
      this.dialog = true
      await this.getAlarmas()
    },
    getFechaFormateada(time) {
      return moment(time)
        .add(-3, 'hours')
        .format('YYYY-MM-DD HH:mm:ss')
    },
    async formatearEstados() {
      const arrayTiempoTotal = this.estados.filter(item => {
        if (item.tiempo_considerado) {
          return true
        }
      })

      const arrayTiempoParadasPlanificada = this.estados.filter(item => {
        if (!item.tiempo_parada && item.tiempo_considerado) {
          return true
        }
      })

      const arrayTiempoParadas = this.estados.filter(item => {
        if (item.tiempo_parada && item.tiempo_considerado) {
          return true
        }
      })

      const tiempoTotalTrabajo = _.sumBy(arrayTiempoTotal, 'duracion')
      const tiempoParadas = _.sumBy(arrayTiempoParadas, 'duracion')
      const disponibilidad =
        ((tiempoTotalTrabajo - tiempoParadas) / tiempoTotalTrabajo) * 100
      this.disponibilidad = mathjs.round(disponibilidad, 2)
    },
    async getDisponibilidad() {
      this.loading = true
      await this.getMapaEstados()
      await axios
        .get(`equipos/${this.equipoSeleccionado.id}/estados`, {
          params: {
            desde: this.desde,
            hasta: this.hasta,
            group: true
          }
        })
        .then(
          response => {
            let estados = response.data

            const arrayTiempoTotal = estados.filter(item => {
              if (item.tiempo_considerado) {
                return true
              }
            })

            const arrayTiempoParadasPlanificada = estados.filter(item => {
              if (!item.tiempo_parada && item.tiempo_considerado) {
                return true
              }
            })

            const arrayTiempoParadas = estados.filter(item => {
              if (item.tiempo_parada && item.tiempo_considerado) {
                return true
              }
            })

            const tiempoTotalTrabajo = _.sumBy(arrayTiempoTotal, 'duracion')
            const tiempoParadas = _.sumBy(arrayTiempoParadas, 'duracion')
            const disponibilidad =
              ((tiempoTotalTrabajo - tiempoParadas) / tiempoTotalTrabajo) * 100
            this.disponibilidad = mathjs.round(disponibilidad, 2)

            this.loading = false
          },
          error => {
            this.disponibilidad = 0
            this.loading = false
          }
        )
    },
    async getAlarmas() {
      this.loadingAlarmas = true
      axios
        .get(`equipos/${this.equipoSeleccionado.id}/alarmas`, {
          params: {
            desde: this.desde,
            hasta: this.hasta
          }
        })
        .then(
          response => {
            this.alarmas = response.data
            this.loadingAlarmas = false
          },
          error => {
            this.alarmas = []
            this.loadingAlarmas = false
          }
        )
    },
    async getMapaEstados() {
      await axios
        .get(`equipos/${this.equipoSeleccionado.id}/mapa_estados`)
        .then(
          response => {
            this.mapaEstados = response.data
          },
          error => {
            this.mapaEstados = []
          }
        )
    }
  }
}
</script>
