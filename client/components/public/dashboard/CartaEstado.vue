<template>
  <div>
    <v-card color="blue-grey lighten-5">
      <v-card-title>
        <div class="layout row ma-0 justify-space-between pb-1">
          <div class="headline blue-grey--text">{{ equipo.nombre }}</div>
          <div class="icon">
            <v-icon :color="getColor(equipo.disponibilidad)">{{ getIcon(equipo.disponibilidad) }}</v-icon>
          </div>
        </div>
      </v-card-title>
      <v-card-text>
        <div
          class="justify-center row layout ma-0"
          style="cursor: pointer;"
          @click="viewAvailability()"
        >
          <v-progress-circular
            :size="150"
            :width="15"
            :rotate="-90"
            :value="equipo.disponibilidad"
            :color="getColor(equipo.disponibilidad)"
          >
            <h4>{{ equipo.disponibilidad }} %</h4>
          </v-progress-circular>
        </div>
      </v-card-text>
      <v-divider/>
      <v-card-actions style="height: 50px;">
        <v-chip
          :color="equipo.estado_actual.color_grafico"
          text-color="white"
          style="width: 98%; margin-left: 2%;"
        >
          <v-avatar class="grey lighten-1">
            <v-icon
              :color="equipo.estado_actual.color_grafico"
            >{{ getIconState(equipo.estado_actual.estado) }}</v-icon>
          </v-avatar>
          <strong>{{ equipo.estado_actual.nombre }}</strong>
        </v-chip>
      </v-card-actions>
    </v-card>
    <v-dialog v-if="dialog" v-model="dialog" width="1200">
      <v-card color="blue-grey lighten-5">
        <v-card-title>
          <div class="layout row ma-0 justify-space-between pb-1">
            <div class="headline blue-grey--text">{{ equipo.nombre }}</div>
          </div>
        </v-card-title>
        <v-card-text>
          <grafico-linea-estado :equipo="equipo"/>
        </v-card-text>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="equipo.alarmas"
            :loading="loading"
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
                <td>{{ getFormatDate(props.item.fecha) }}</td>
                <td>
                  <strong>{{ props.item.nombre }}</strong>
                </td>
                <td>{{ props.item.duracion / 60 | redondear }} min</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import GraficoLineaEstado from '@/components/public/dashboard/GraficoLineaEstado'
import targetDisponibilidad from '@/api/target'
import states from '@/api/states'
import mixins from '@/mixins'
import axios from '@/plugins/axios'
import moment from 'moment'
import mathjs from 'mathjs'

export default {
  components: {
    GraficoLineaEstado
  },

  props: {
    equipo: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    dialog: false,
    headers: [
      { text: 'Fecha', value: 'Fecha' },
      { text: 'Descripcion', value: 'Descripcion' },
      { text: 'Duracion', value: 'Duracion' }
    ],
    loading: false,
    target: targetDisponibilidad,
    listStates: states
  }),

  mixins: [mixins],

  methods: {
    getColor(disponibilidad) {
      if (disponibilidad <= this.target.targetDisponibilidad.small) {
        return 'red'
      }
      if (disponibilidad <= this.target.targetDisponibilidad.medium) {
        return 'orange'
      }
      return 'green'
    },
    getIcon(disponibilidad) {
      if (disponibilidad <= this.target.targetDisponibilidad.small) {
        return 'trending_down'
      }
      if (disponibilidad <= this.target.targetDisponibilidad.medium) {
        return 'trending_flat'
      }
      return 'trending_up'
    },
    getIconState(estado) {
      if (estado === 8 && estado === 1) {
        return 'cancel'
      }
      if (estado === 2) {
        return 'check_circle'
      }
      return 'warning'
    },
    getColorState() {
      return this.equipo ? this.equipo.ColorEstado : '#ffffff'
    },
    getValueAvailability() {
      if (this.equipo) {
        return this.equipo.Disponibilidad
      }
      return 0
    },
    viewAvailability() {
      this.dialog = true
    },
    getFormatDate(time) {
      return moment(time)
        .add(3, 'hours')
        .format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
