<template>
  <div>
    <v-checkbox v-model="total_alarmas" label="Mostrar todas las alarmas"></v-checkbox>
    <v-switch
      :disabled="total_alarmas"
      class="ml-1"
      v-model="reconocida"
      label="Considerar solo causas"
    ></v-switch>
    <v-card color="blue-grey lighten-5">
      <v-card-title>
        <v-layout row wrap>
          <v-flex xs12 text-xs-right>
            <v-layout row>
              <template v-for="(item, i) in itemsTipos">
                <v-checkbox
                  color="blue"
                  :key="i"
                  v-model="tiposSeleccionados"
                  :label="item.nombre"
                  :value="item.id"
                ></v-checkbox>
              </template>
            </v-layout>
          </v-flex>
          <v-flex xs12 text-xs-right>
            <v-btn small color="blue-grey" dark @click="exportToCSV()">
              <v-icon>get_app</v-icon>Descargar csv
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-data-table
        v-if="!total_alarmas"
        :headers="headers"
        :items="alarmas"
        style="width: 100%"
        class="elevation-0"
        no-data-text="No hay datos registrados en el sistema"
        rows-per-page-text="Por pagina"
        :rows-per-page-items="[100]"
        disable-initial-sort
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr class="text-xs-left">
            <td>{{ !props.item.equipo ? props.item.equipo.nombre : props.item.equipo }}</td>
            <td>
              <strong class="blue-grey--text">{{ props.item.nombre }}</strong>
            </td>
            <td>
              <strong>{{ props.item.duracion / 60 | redondear }}</strong> min
            </td>
            <td>{{ props.item.cantidad }}</td>
          </tr>
        </template>
      </v-data-table>
      <v-data-table
        v-if="total_alarmas"
        :headers="headersTotalAlarmas"
        :items="alarmas"
        style="width: 100%"
        class="elevation-0"
        no-data-text="No hay datos registrados en el sistema"
        rows-per-page-text="Por pagina"
        :rows-per-page-items="[100]"
        disable-initial-sort
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr class="text-xs-left">
            <td>{{ props.item.fecha | formatearFecha }}</td>
            <td>{{ props.item.equipo ? props.item.equipo.nombre : '' }}</td>
            <td>
              <strong class="blue-grey--text">{{ props.item.nombre }}</strong>
            </td>
            <td>{{ props.item.causa ? props.item.causa.nombre : ''}}</td>
            <td>{{ props.item.detalle }}</td>
            <td>{{ props.item.fecha_reconocida | formatearFecha }}</td>
            <td>
              <strong>{{ props.item.duracion / 60 | redondear }}</strong> min
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import moment from 'moment'
import mathjs from 'mathjs'
import axios from '@/plugins/axios'
import mixins from '@/mixins'
import exportFromJSON from 'export-from-json'
import _ from 'lodash'
export default {
  data: () => ({
    headers: [
      { text: 'Equipo', value: 'equipo' },
      { text: 'Descripcion', value: 'nombre' },
      { text: 'Duracion', value: 'duracion' },
      { text: 'Recurrencia', value: 'recurrencia' }
    ],
    headersTotalAlarmas: [
      { text: 'Fecha', value: 'fecha' },
      { text: 'Equipo', value: 'equipo' },
      { text: 'Descripcion', value: 'nombre' },
      { text: 'Causa', value: 'causa' },
      { text: 'Detalle de causa', value: 'detalle' },
      { text: 'Fecha reconocida', value: 'fecha_reconocida' },
      { text: 'Duracion', value: 'duracion' }
    ],
    loading: false,
    alarmas: [],
    equipos: [],
    tipos: null,
    itemsTipos: [],
    tiposSeleccionados: [],
    tiposFiltroQuery: [],
    reconocida: false,
    total_alarmas: false
  }),

  mixins: [mixins],

  computed: {
    ...mapGetters(['aplicarFiltro', 'desde', 'hasta'])
  },

  watch: {
    aplicarFiltro() {
      this.getAlarmas()
    },
    reconocida() {
      this.getAlarmas()
    },
    total_alarmas() {
      this.getAlarmas()
    }
  },
  created() {
    this.getEquipos()
  },

  methods: {
    ...mapMutations(['SET_APLICAR_FILTRO']),
    async getAlarmas() {
      this.loading = true

      const tags = this.tiposSeleccionados.join(',')
      await axios
        .get('alarmas/reportes', {
          params: {
            desde: this.desde,
            hasta: this.hasta,
            tags: `(${tags})`,
            tags_array: this.tiposSeleccionados,
            reconocidas: this.reconocida,
            total_alarmas: this.total_alarmas
          }
        })
        .then(response => {
          this.alarmas = response.data
          this.loading = false
        })
    },
    async getEquipos() {
      await axios.get('tipo_equipos?perPage=200').then(response => {
        this.itemsTipos = response.data.data
      })
    },
    exportToCSV() {
      const fileName = 'reportes_fallas'
      const exportType = 'csv'
      let data = []
      if (this.total_alarmas) {
        data = this.alarmas.map(alarma => {
          return {
            Equipo: alarma.equipo.nombre,
            Fecha: alarma.fecha,
            Descripcion: alarma.nombre,
            Duracion_min: mathjs.round(alarma.duracion / 60, 2),
            Causa: alarma.causa.nombre,
            Detalle: alarma.detalle,
            Reconocida: alarma.fecha_reconocida
          }
        })
      } else {
        data = this.alarmas.map(alarma => {
          return {
            Equipo: alarma.equipo,
            Descripcion: alarma.nombre,
            Duracion_min: mathjs.round(alarma.duracion / 60, 2),
            Recurrencia: alarma.cantidad
          }
        })
      }
      if (data.length > 0) {
        exportFromJSON({ data, fileName, exportType })
      }
    }
  }
}
</script>
