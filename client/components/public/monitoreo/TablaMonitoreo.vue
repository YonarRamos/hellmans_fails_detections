<template>
  <div>
    <v-card color="blue-grey lighten-5">
      <v-card-title>
        <v-layout row wrap >
          <v-flex xs8 text-xs-right style="margin-left:70%">
            <v-btn large icon color="green" dark @click="exportToCSV()">
              <v-icon>get_app</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="cips"
        style="width: 100%"
        class="elevation-0"
        no-data-text="No hay datos registrados en el sistema"
        rows-per-page-text="Por pagina"
        :rows-per-page-items="[100]"
        disable-initial-sort
        item-key="inicio"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr
            @click="props.expanded = !props.expanded"
            class="text-xs-left"
            style="cursor: pointer;"
          >
            <td>
              <strong class="blue-grey--text">{{ props.item.descripcion }}</strong>
            </td>
            <td>{{ props.item.inicio | formatearFecha }}</td>
            <td>{{ props.item.fin | formatearFecha }}</td>
            <td>
              <strong>{{ props.item.duracion / 60 | redondear }}</strong> min
            </td>
            <td>{{ props.item.vol_env }}</td>
            <td>{{ props.item.vol_sani }}</td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <v-timeline align-top dense>
                <template v-for="(item, i) in props.item.operaciones">
                  <v-timeline-item :key="i" color="pink" small>
                    <v-layout pt-3>
                      <v-flex xs3>
                        <strong>{{item.fecha | formatearFecha}}</strong>
                      </v-flex>
                      <v-flex>
                        <strong>{{item.descripcion}}</strong>
                        <div class="caption">Estado: {{item.estado}}</div>
                        <div class="caption">Modo: {{item.modo}}</div>
                      </v-flex>
                    </v-layout>
                  </v-timeline-item>
                </template>
              </v-timeline>
            </v-card-text>
          </v-card>
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
      { text: 'Fecha', value: 'Fecha' },
      { text: 'TagName', value: 'Tagname' },
      { text: 'Area', value: 'area' },
      { text: 'Value', value: 'vaule' },
      { text: 'Descripcion', value: 'description' },
      { text: 'Operador', value: 'operator' },
    ],
  
    loading: false,
    cips: [],
    equipos: [],
  }),

  mixins: [mixins],

  computed: {
    ...mapGetters(['aplicarFiltro', 'desde', 'hasta'])
  },

  watch: {
    aplicarFiltro() {
      this.getAlarmas()
    }
  },

  methods: {
    ...mapMutations(['SET_APLICAR_FILTRO']),
    async getAlarmas() {
      this.loading = true

      await axios
        .get('cips', {
          params: {
            desde: this.desde,
            hasta: this.hasta,
            cip: this.cipSeleccionado
          }
        })
        .then(response => {
          this.cips = response.data
          this.loading = false
        })
    },
    exportToCSV() {
      const fileName = 'reportes_cips'
      const exportType = 'csv'
      const data = []
      this.cips.map(alarma => {
        data.push({
          Descripcion: alarma.descripcion,
          Inicio: alarma.inicio,
          Fin: alarma.fin,
          Duracion_min: mathjs.round(alarma.duracion / 60, 2),
          Vol_env: alarma.vol_env,
          Vol_sani: alarma.vol_sani
        })

        if (alarma.operaciones.length > 0) {
          alarma.operaciones.map(item => {
            data.push({
              Descripcion: '    ' + item.descripcion,
              Inicio: item.fecha,
              Fin: '',
              Duracion: '',
              Vol_env: item.modo,
              Vol_sani: item.estado
            })
          })
        }
      })
      exportFromJSON({ data, fileName, exportType })
    }
  }
}
</script>
