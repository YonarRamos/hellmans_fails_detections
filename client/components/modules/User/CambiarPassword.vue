<template>
  <v-layout row justify-center>
    <v-dialog v-model="modalCambiarPassword" width="400" persistent>
      <v-card class="modal elevation-0">
        <v-card-title class="elevation-0 py-0 px-2">
          <v-icon medium>account_circle</v-icon>
          <v-spacer></v-spacer>
          <span class="title blue-grey--text">CAMBIAR PASSWORD</span>
          <v-spacer></v-spacer>
          <v-btn icon flat color="grey" @click="SET_MODAL_CAMBIAR_PASSWORD(false)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-layout justify-center>
              <v-flex xs10>
                <v-text-field
                  ref="Password"
                  type="password"
                  v-model="password"
                  :rules="rules.password"
                  label="Password"
                  placeholder
                  prepend-icon="lock"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn block dark flat color="green" @click="cambiarPassword()">Guardar</v-btn>
          <v-btn block dark flat color="blue" @click="SET_MODAL_CAMBIAR_PASSWORD(false)">cancelar</v-btn>
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
      password: null,
      rules: {
        email: [
          v => !!v || 'El email es requerido',
          v => /.+@.+/.test(v) || 'Formato de email no valido'
        ],
        username: [v => !!v || 'El campo username es requerido'],
        password: [v => !!v || 'El campo username es requerido']
      },
      width: 0
    }
  },

  mixins: [notify],

  computed: {
    ...mapGetters(['auth', 'modalCambiarPassword'])
  },

  methods: {
    ...mapMutations(['SET_MODAL_CAMBIAR_PASSWORD']),
    async cambiarPassword() {
      if (this.valid) {
        await axios
          .post(`cambiar_password`, {
            password: this.password
          })
          .then(response => {
            this.alertSuccess()
            this.SET_MODAL_CAMBIAR_PASSWORD(false)
          })
          .catch(error => {
            this.alertError(error)
          })
      }
    }
  }
}
</script>
