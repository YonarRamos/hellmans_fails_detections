<template>
  <div>
    <v-container grid-list-xl fluid mb-5 style="margin-top: -30px">
      <!-- <h2 class="blue-grey--text">{{ equipoSeleccionado ? equipoSeleccionado.nombre : '' }}</h2> -->
      <v-layout row wrap>
        <v-flex xs6>
          <v-layout row wrap>
            <v-flex xs6>
              <v-date-picker
                class="elevation-3"
                color="green lighten-1"
                v-model="date"
                full-width
                locale="es-es"
                :allowed-dates="allowedDates"
              ></v-date-picker>
            </v-flex>
            <v-flex xs6>
              <carta-disponibilidad
                :fecha="(date) ? date.toString() : ''"
                titulo="Global"
                :desde="getDateTime(date, 3)"
                :hasta="getDateTime(date, 27)"
                :size="270"
                :width="25"
                :estados="estadosTurnoGeneral"
              />
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs4>
                  <carta-disponibilidad
                    :fecha="(date) ? date.toString() : ''"
                    titulo="Mañana"
                    :desde="getDateTime(date, 3)"
                    :hasta="getDateTime(date, 11)"
                    :size="100"
                    :width="10"
                    :estados="estadosTurnoManana"
                  />
                </v-flex>
                <v-flex xs4>
                  <carta-disponibilidad
                    :fecha="(date) ? date.toString() : ''"
                    titulo="Tarde"
                    :desde="getDateTime(date, 11)"
                    :hasta="getDateTime(date, 19)"
                    :size="100"
                    :width="10"
                    :estados="estadosTurnoTarde"
                  />
                </v-flex>
                <v-flex xs4>
                  <carta-disponibilidad
                    :fecha="(date) ? date.toString() : ''"
                    titulo="Noche"
                    :desde="getDateTime(date, 19)"
                    :hasta="getDateTime(date, 27)"
                    :size="100"
                    :width="10"
                    :estados="estadosTurnoNoche"
                  />
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs6>
          <v-card color="blue-grey lighten-5 mt-2 px-3" height="600">
            <grafico-linea-estados
              :fecha="(date) ? date.toString() : ''"
              titulo="Mañana"
              :desde="getDateTime(date, 6)"
              :hasta="getDateTime(date, 14)"
              :estados="estadosTurnoManana"
              :itemsFechas="['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00']"
            />
            <div style="height: 80px;"></div>
            <grafico-linea-estados
              :fecha="(date) ? date.toString() : ''"
              titulo="Tarde"
              :desde="getDateTime(date, 14)"
              :hasta="getDateTime(date, 22)"
              :estados="estadosTurnoTarde"
              :itemsFechas="['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']"
            />
            <div style="height: 80px;"></div>
            <grafico-linea-estados
              :fecha="(date) ? date.toString() : ''"
              titulo="Noche"
              :desde="getDateTime(date, 22)"
              :hasta="getDateTime(date, 30)"
              :estados="estadosTurnoNoche"
              :itemsFechas="['22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00']"
            />
            <div style="height: 80px;"></div>
            <referencia-estados/>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <tabla-ruteos :ruteos="ruteos"></tabla-ruteos>
        </v-flex>
      </v-layout>
    </v-container>
    <menu-seleccion-equipo/>
  </div>
</template>

<style scoped>
</style>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import axios from '@/plugins/axios'
import MenuSeleccionEquipo from '@/components/public/calendario/MenuSeleccionEquipo'
import CartaDisponibilidad from '@/components/public/calendario/CartaDisponibilidad'
import GraficoLineaEstados from '@/components/public/calendario/GraficoLineaEstados'
import ReferenciaEstados from '@/components/public/calendario/ReferenciaEstados'
import TablaRuteos from '@/components/public/calendario/TablaRuteos'
export default {
  middleware: 'authenticated',
  layout: 'custom',
  components: {
    MenuSeleccionEquipo,
    CartaDisponibilidad,
    GraficoLineaEstados,
    ReferenciaEstados,
    TablaRuteos
  },
  data: () => ({
    date: moment().format('YYYY-MM-DD'),
    estadosTurnoGeneral: [],
    estadosTurnoManana: [],
    estadosTurnoTarde: [],
    estadosTurnoNoche: [],
    ruteos: []
  }),
  computed: {
    ...mapGetters(['equipoSeleccionado', 'aplicarFiltro'])
  },
  watch: {
    async date() {
      this.SET_FECHA(this.date)

      if (this.equipoSeleccionado) {
        await this.getEstados()
        await this.getRuteos()
      }
    },
    async aplicarFiltro() {
      if (this.equipoSeleccionado) {
        await this.getEstados()
        await this.getRuteos()
      }
    }
  },
  created() {
    this.SET_EQUIPO_SELECCIONADO(null)
  },
  methods: {
    ...mapMutations(['SET_EQUIPO_SELECCIONADO', 'SET_FECHA']),
    allowedDates(val) {
      if (parseInt(val.split('-')[1]) < parseInt(moment().format('MM'))) {
        return true
      }

      if (parseInt(val.split('-')[0]) < parseInt(moment().format('YYYY'))) {
        return true
      }

      if (
        parseInt(val.split('-')[2]) < moment().format('DD') &&
        parseInt(val.split('-')[1]) <= parseInt(moment().format('MM'))
      ) {
        return true
      }
      return false
    },
    getDateTime(date, time) {
      let dateTime = moment(this.date)
        .add(time, 'hours')
        .format('YYYY-MM-DD HH:mm:ss')
      return new Date(dateTime)
    },
    async getEstados() {
      await axios
        .get(`equipos/${this.equipoSeleccionado.id}/estados`, {
          params: {
            desde: this.getDateTime(this.date, 3),
            hasta: this.getDateTime(this.date, 27)
          }
        })
        .then(response => {
          this.estadosTurnoGeneral = response.data
        })

      await axios
        .get(`equipos/${this.equipoSeleccionado.id}/estados`, {
          params: {
            desde: this.getDateTime(this.date, 3),
            hasta: this.getDateTime(this.date, 11)
          }
        })
        .then(response => {
          this.estadosTurnoManana = response.data
        })

      await axios
        .get(`equipos/${this.equipoSeleccionado.id}/estados`, {
          params: {
            desde: this.getDateTime(this.date, 11),
            hasta: this.getDateTime(this.date, 19)
          }
        })
        .then(response => {
          this.estadosTurnoTarde = response.data
        })

      await axios
        .get(`equipos/${this.equipoSeleccionado.id}/estados`, {
          params: {
            desde: this.getDateTime(this.date, 19),
            hasta: this.getDateTime(this.date, 27)
          }
        })
        .then(response => {
          this.estadosTurnoNoche = response.data
        })
    },
    async getRuteos() {
      await axios
        .get(`equipos/${this.equipoSeleccionado.id}/ruteos`, {
          params: {
            desde: this.getDateTime(this.date, 3),
            hasta: this.getDateTime(this.date, 27)
          }
        })
        .then(response => {
          this.ruteos = response.data
        })
    }
  }
}
</script>
