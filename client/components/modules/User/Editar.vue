<template>
  <v-layout row justify-center>
    <v-dialog v-model="modalEditarUser" width="600" persistent>
      <v-card class="modal elevation-0">
        <v-card-title class="elevation-0 py-0 px-2">
          <v-icon medium>account_circle</v-icon>
          <v-spacer></v-spacer>
          <span class="title blue-grey--text">NUEVO USUARIO</span>
          <v-spacer></v-spacer>
          <v-btn icon flat color="grey" @click="SET_MODAL_EDITAR_USER(false)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-layout justify-center>
              <v-flex xs12>
                <v-text-field
                  ref="Email"
                  v-model="userEditar.email"
                  :rules="rules.email"
                  label="Email"
                  placeholder="juan@unilever.com"
                  prepend-icon="email"
                  required
                ></v-text-field>
                <v-text-field
                  ref="Username"
                  v-model="userEditar.username"
                  :rules="rules.username"
                  label="Username"
                  placeholder="juan"
                  prepend-icon="account_circle"
                  required
                ></v-text-field>
                <v-text-field
                  ref="Password"
                  type="password"
                  v-model="userEditar.password"
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
          <v-btn block dark flat color="green" @click="editarUser()">Guardar</v-btn>
          <v-btn block dark flat color="blue" @click="SET_MODAL_EDITAR_USER(false)">cancelar</v-btn>
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
export default {
  data() {
    return {
      valid: false,
      userEditar: {
        email: null,
        username: null,
        password: null
      },
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
    ...mapGetters(['user', 'modalEditarUser'])
  },

  mounted() {
    this.userEditar = this.user
  },

  methods: {
    ...mapMutations(['SET_MODAL_EDITAR_USER', 'SET_ACTUALIZAR_USERS']),
    ...mapActions(['updateUser']),
    editarUser() {
      if (this.valid) {
        const payload = {
          content: this.userEditar
        }
        this.updateUser(payload)
          .then(response => {
            this.alertSuccess()
            this.userEditar = {
              nombre: null,
              descripcion: null
            }
            this.SET_MODAL_EDITAR_USER(false)
          })
          .catch(error => {
            this.alertError(
              error
            )
          })
      }
    }
  }
}
</script>
