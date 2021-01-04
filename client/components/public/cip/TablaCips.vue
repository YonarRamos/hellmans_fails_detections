<template>
  <div>
    <v-card color="blue-grey lighten-5">
      <v-card-title>
        <v-layout row wrap>
          <v-flex xs4 text-xs-right>
            <v-select
              v-model="cipSeleccionado"
              multiple
              :items="itemsCIP"
              box
              label="Seleccione un equipo"
            ></v-select>
          </v-flex>
          <v-flex xs8 text-xs-right>
            <v-btn large icon color="blue-grey" dark @click="exportToCSV()">
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
              <strong> {{props.item.circuito}} </strong>
            </td>
            <td><!-- {{ props.item.inicio | formatearFecha }} --> {{props.item.fecha}}</td>
            <td>{{props.item.tiempo}}</td>
            <td>
              <strong>{{props.item.litros_drenaje}}</strong>
            </td>
            <td><v-text-field v-model="props.item.targe_litros" type="number" class="body-1"  flat solo hide-details placeholder="Indicar litros"></v-text-field></td>
            <!-- <td>targe/litros = targe/litros  - litros/drenaje el resultado</td> -->
            <td><v-text-field flat solo hide-details readonly class="body-1 red--text" style="color: #000 !important;" :value="props.item.targe_litros ? props.item.desvio = props.item.targe_litros - props.item.litros_drenaje : 'Esperando valor de target'" ></v-text-field></td>
            <td>{{ props.item.tipo_limpieza }}</td>
            <td>{{ props.item.c_final}}</td>
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
      { text: 'N° de Circuito', value: 'Nombre' },
      { text: 'Fecha', value: 'Inicio' },
      { text: 'Tiempo', value: 'Inicio' },
      { text: 'Litros/Drenaje', value: 'Fin' },
      { text: 'Targe Litros', value: 'Duracion' },
      { text: 'Desvio', value: 'desvio' },
      { text: 'Tipo de Limpieza', value: 'vol_sani' },
      { text: 'Cond. Final', value: 'vol_env' },
    ],
    itemsCIP: [
      {
        text: 'CIP L100',
        value: 'CIP1'
      },
      {
        text: 'CIP L200',
        value: 'CIP2'
      },
      {
        text: 'CIP L300',
        value: 'CIP3'
      },
      {
        text: 'CIP L400',
        value: 'CIP4'
      },
      {
        text: 'CIP L500',
        value: 'CIP5'
      },
      {
        text: 'CIP L600',
        value: 'CIP6'
      },
      {
        text: 'CIP L700',
        value: 'CIP7'
      },
      {
        text: 'CIP L1100',
        value: 'CIP11'
      },
      {
        text: 'CIP L1200',
        value: 'CIP12'
      }
    ],
    loading: false,
    cips: [{
        circuito:"1",
        fecha:"11-23-2002",
        tiempo:"11",
        litros_drenaje:10,
        targe_litros:null,
        desvio:null,
        tipo_limpieza:"Profunda",
        c_final:"Optima"
    },
    {
        circuito:"2",
        fecha:"11-23-2023",
        tiempo:"17",
        litros_drenaje:25,
        targe_litros:null,
        desvio:null,
        tipo_limpieza:"Superficial",
        c_final:"Regular"
    },
    {
        circuito:"3",
        fecha:"11-30-2023",
        tiempo:"15",
        litros_drenaje:60,
        targe_litros:null,
        desvio:null,
        tipo_limpieza:"Superficial",
        c_final:"Regular"
    }],
    equipos: [],
    cipSeleccionado: ['CIP11']
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
    calcularDesvio(){
      let desvio=0
     desvio = this.cipsItem.litros_drenaje - this.cipsItem.targe_litros
     return desvio
    },
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


<style>
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] { -moz-appearance:textfield; }
</style>  
