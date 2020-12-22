<template>
  <v-app class="blue darken-2 login">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4 xl3>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center mb-4">
                  <h2 class="flex blue-grey--text">REPORTES FALLAS HELLMANNS</h2>
                </div>
                <div class="layout column align-center">
                  <img src="../static/logo.png" alt="Vue Material Admin" width="120" height="120">
                </div>
                <v-form v-model="valid" ref="form" lazy-validation>
                  <v-text-field
                    append-icon="person"
                    name="email"
                    label="Email"
                    type="text"
                    v-model="usuario.email"
                    :rules="emailRules"
                  ></v-text-field>
                  <v-text-field
                    append-icon="lock"
                    name="password"
                    label="Password"
                    id="password"
                    type="password"
                    v-model="usuario.password"
                    :rules="passwordRules"
                    @keyup.enter.native="login()"
                  ></v-text-field>
                </v-form>
                <div class="layout column align-center">
                  <span class="red--text">{{ errorLogin }}</span>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn dark block color="blue" @click="login()">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from '@/plugins/axios'
import notify from '@/mixins/notify'
export default {
  middleware: 'notAuthenticated',
  layout: 'default',
  data: () => ({
    usuario: {
      email: null,
      password: null
    },
    payload: { content: null },
    valid: false,
    emailRules: [
      v => !!v || 'Campo requerido',
      v =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        'Formato de email invalido'
    ],
    passwordRules: [v => !!v || 'La contraseña no puede ser vacia'],
    errorLogin: ''
  }),

  mixins: [notify],

  computed: {
    ...mapGetters(['auth', 'accessToken'])
  },
  methods: {
    ...mapActions(['loginAccount']),
    login() {
      if (this.valid) {
        this.payload.content = this.usuario
        this.loginAccount(this.payload)
          .then(response => {
            this.alertSuccess()
          })
          .catch(error => {
            this.alertError(error)
          })
      }
    }
  }
}
</script>
<style scoped lang="css">
.login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  z-index: 0;
}
</style>
