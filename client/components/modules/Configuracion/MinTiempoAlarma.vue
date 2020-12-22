<template>
  <v-layout row justify-center>
    <v-dialog v-model="modalEditarConfiguracionMinTiempoAlarma" width="500" persistent>
      <v-card class="modal elevation-0">
        <v-card-title class="elevation-0 py-0 px-2">
          <v-icon medium>account_circle</v-icon>
          <v-spacer></v-spacer>
          <span class="title blue-grey--text">MIN TIEMPO VISUALIZACION ALARMAS</span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            flat
            color="grey"
            @click="SET_MODAL_EDITAR_CONFIGURACION_MIN_TIEMPO_ALARMA(false)"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-layout justify-center>
              <v-flex xs10>
                <v-text-field
                  ref="Email"
                  v-model="ConfiguracionMinTiempoAlarmaEditar.valor"
                  :rules="rules.valor"
                  label="Min timepo en segundo para despreciar alarmas"
                  placeholder="10"
                  prepend-icon="format_list_numbered"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn block dark flat color="green" @click="editarConfiguracionMinTiempoAlarma()">Guardar</v-btn>
          <v-btn
            block
            dark
            flat
            color="blue"
            @click="SET_MODAL_EDITAR_CONFIGURACION_MIN_TIEMPO_ALARMA(false)"
          >cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<style scoped>
.modal {
  border-radius: 6px;
}
</style>


<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import notify from '@/mixins/notify'
import axios from '@/plugins/axios'

export default {
  data() {
    return {
      valid: false,
      ConfiguracionMinTiempoAlarmaEditar: {
        tag: 'MIN_TIEMPO_DECLARAR_ALARMAS',
        valor: null
      },
      rules: {
        valor: [v => !!v || 'El campo valor es requerido']
      },
      width: 0
    }
  },

  mixins: [notify],

  computed: {
    ...mapGetters(['modalEditarConfiguracionMinTiempoAlarma'])
  },

  async mounted() {
    await axios
      .get('configuraciones', {
        params: {
          search: 'MIN_TIEMPO_DECLARAR_ALARMAS',
          searchField: 'tag'
        }
      })
      .then(response => {
        this.ConfiguracionMinTiempoAlarmaEditar = response.data.data[0]
      })
  },

  methods: {
    ...mapMutations(['SET_MODAL_EDITAR_CONFIGURACION_MIN_TIEMPO_ALARMA']),
    async editarConfiguracionMinTiempoAlarma() {
      if (this.valid) {
        const payload = {
          content: this.ConfiguracionMinTiempoAlarmaEditar
        }
        await axios
          .put(`configuraciones/${payload.content.id}`, payload.content)
          .then(response => {
            this.alertSuccess()
            this.ConfiguracionMinTiempoAlarmaEditar = {
              tag: 'MIN_TIEMPO_DECLARAR_ALARMAS',
              valor: null
            }
            this.SET_MODAL_EDITAR_CONFIGURACION_MIN_TIEMPO_ALARMA(false)
          })
          .catch(error => {
            this.alertError(error)
          })
      }
    }
  }
}
</script>
