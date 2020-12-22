<template>
  <v-layout row>
    <v-flex style="margin-top: -10px;" xs3 text-xs-left>
      <span class="title grey--text">Ultimas de alarmas registradas</span>
    </v-flex>
    <v-flex xs9>
      <v-layout row>
        <v-flex xs8></v-flex>
        <v-flex xs4 class="selector">
          <v-layout row>
            <v-combobox
              v-model="tipo"
              :items="['Turno', 'Dia']"
              label="Seleccione el tipo de adquisicion:"
              style="margin-top: -25px;"
            ></v-combobox>
            <v-btn
              :disabled="auth.type !== 'Administrador'"
              flat
              icon
              @click="cambiarTipoAdquisicion()"
              color="blue"
              style="margin-top: -10px;"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import axios from '@/plugins/axios'
export default {
  data: () => ({
    tipo: '',
    tipoAdquisicion: ''
  }),
  created() {
    this.getTipoAdquisicion()
  },

  computed: {
    ...mapGetters(['auth'])
  },

  methods: {
    getTipoAdquisicion() {
      axios
        .get('configuraciones', {
          params: {
            search: 'TIPO_ADQUISICION'
          }
        })
        .then(response => {
          this.tipoAdquisicion = response.data.data[0]
          this.tipo = response.data.data[0].valor
        })
    },
    cambiarTipoAdquisicion() {
      axios
        .put(`configuraciones/${this.tipoAdquisicion.id}`, {
          valor: this.tipo
        })
        .then(response => {
          this.tipoAdquisicion = response.data
          this.tipo = response.data.valor
        })
    }
  }
}
</script>
