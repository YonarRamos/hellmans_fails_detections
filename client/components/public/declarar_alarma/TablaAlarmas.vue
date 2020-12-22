<template>
  <div>
    <v-card color="blue-grey lighten-5">
      <v-card-title>
        <h3 class="blue-grey--text">
          <strong>LISTADO DE ALARMAS</strong>
        </h3>
        <v-spacer></v-spacer>
        <v-progress-circular indeterminate color="blue-grey" v-if="loading"></v-progress-circular>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="alarmas.data"
        style="width: 100%"
        class="elevation-0 pl-1 pr-1 pb-1"
        no-data-text="No hay datos registrados en el sistema"
        rows-per-page-text="Por pagina"
        :rows-per-page-items="[10]"
        disable-initial-sort
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr class="text-xs-left">
            <td>{{ props.item.fecha | formatearFecha }}</td>
            <td>
              <strong>{{ props.item.equipo.nombre }}</strong>
            </td>
            <td>{{ props.item.nombre }}</td>
            <td>{{ props.item.duracion / 60 | redondear }} min</td>
            <td>
              <v-btn
                :disabled="auth.type !== 'Administrador'"
                v-if="!props.item.reconocida"
                icon
                flat
                @click="reconocerAlarma(props.item)"
              >
                <v-icon color="pink">present_to_all</v-icon>
              </v-btn>
              <v-btn v-if="props.item.reconocida" icon flat>
                <v-icon color="blue">done_all</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogSilenciarAlarma" width="500">
      <v-card>
        <v-card-title class="headline" primary-title>
          Silenciar alarma
          <v-spacer/>
          <v-icon large color="orange">warning</v-icon>
        </v-card-title>

        <v-card-text>
          <span>Al silenciar esta alarma! ya no se notificaran mensajes de la misma</span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="submitSilenciarAlarma()">Silenciar</v-btn>
          <v-btn color="secondary" flat @click="dialogSilenciarAlarma = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogReconocerFalla" width="500">
      <v-card>
        <v-card-title class="headline" primary-title>
          Reconocer falla
          <v-spacer/>
          <v-icon large color="blue">event_available</v-icon>
        </v-card-title>

        <v-card-text>
          <span>Seleccione una causa del menu. en caso de no encontrar una falla que coinsida con lo sucedido, tilde otra causa y agrega una personalizada</span>
          <v-combobox
            :disabled="tipoCausa"
            v-model="causaSeleccionada"
            :items="itemsCausasFallas"
            chips
            label="Causa de falla"
          ></v-combobox>
          <v-checkbox label="Otra causa" v-model="tipoCausa"></v-checkbox>
          <v-text-field
            :disabled="!tipoCausa"
            label="Causa personalizada"
            v-model="causaPersonalizada"
          ></v-text-field>
          <v-textarea label="Descripcion adicional" v-model="decripcionCausa"></v-textarea>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="decripcionCausa.length == 0 ? true : false"
            color="primary"
            flat
            @click="submitReconocerAlarma()"
          >Reconocer</v-btn>
          <v-btn color="blue" flat @click="dialogReconocerFalla = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import moment from 'moment'
import axios from '@/plugins/axios'
import mixins from '@/mixins'

export default {
  data: () => ({
    dialogSilenciarAlarma: false,
    dialogReconocerFalla: false,
    alarmas: [],
    headers: [
      { text: 'Fecha y hora', value: 'fecha' },
      { text: 'Equipo', value: 'equipo' },
      { text: 'Descripcion', value: 'nombre' },
      { text: 'Duracion', value: 'duracion' },
      { text: '', value: '' }
    ],
    alarmaSeleccionada: null,
    loading: false,
    causasFallas: [],
    itemsCausasFallas: [],
    causaSeleccionada: null,
    tipoCausa: false,
    causaPersonalizada: '',
    decripcionCausa: ''
  }),

  mixins: [mixins],

  computed: {
    ...mapGetters(['aplicarFiltro', 'desde', 'hasta', 'auth'])
  },

  async mounted() {
    await this.getCausasFalla()
    this.loading = true
    await axios
      .get(`alarmas_sin_reconocer?perPage=1000000`, {
        params: {
          desde: new Date(moment().format('YYYY-MM-DD') + ' 03:00:00'),
          hasta: new Date(
            moment()
              .add(-3, 'hours')
              .format('YYYY-MM-DD HH:mm:ss')
          )
        }
      })
      .then(response => {
        this.alarmas = response.data
        this.loading = false
      })
  },

  watch: {
    async aplicarFiltro() {
      await this.getAlarmas()
    }
  },

  methods: {
    ...mapMutations(['SET_APLICAR_FILTRO']),
    ...mapActions(['getAllAlamasPorEquipo']),
    async getAlarmas() {
      this.loading = true
      await axios
        .get(`alarmas_sin_reconocer?perPage=1000000`, {
          params: {
            desde: this.desde,
            hasta: this.hasta
          }
        })
        .then(response => {
          this.alarmas = response.data
          this.loading = false
        })
    },
    async getCausasFalla() {
      await axios.get(`mapa_causas?perPage=1000000`).then(response => {
        this.causasFallas = response.data.data
      })
    },
    silenciarAlarma(item) {
      this.alarmaSeleccionada = item
      this.dialogSilenciarAlarma = true
    },
    reconocerAlarma(item) {
      this.alarmaSeleccionada = item
      this.causaSeleccionada = null
      this.tipoCausa = false
      this.causaPersonalizada = ''
      this.decripcionCausa = ''

      this.itemsCausasFallas = this.causasFallas
        .map(causa => {
          causa.text = causa.nombre
          return causa
        })
        .filter(causa => {
          if (causa.tipo_equipo_id === item.equipo.tipo_equipo_id) {
            return true
          }
        })

      if (!item.Reconocida) {
        this.dialogReconocerFalla = true
      }
    },
    async submitReconocerAlarma() {
      let alarma = {
        reconocida: true,
        detalle: this.decripcionCausa,
        mapa_causa_id: this.causaSeleccionada
          ? this.causaSeleccionada.id
          : null,
        causa_personalizada: this.causaPersonalizada,
        tipo_equipo_id: this.alarmaSeleccionada.equipo.tipo_equipo_id
      }
      await axios
        .post(`alarmas/${this.alarmaSeleccionada.id}/reconocer`, alarma)
        .then(async response => {
          await this.getAlarmas()
          this.dialogReconocerFalla = false
          this.alertSuccess()
        })
        .catch(error => {
          this.alertError(error)
        })
    },
    async submitSilenciarAlarma() {
      await axios
        .post(`alarmas/${this.alarmaSeleccionada.id}/silenciar`)
        .then(async response => {
          await this.getAlarmas()
          this.dialogSilenciarAlarma = false
          this.alertSuccess()
        })
    }
  }
}
</script>
