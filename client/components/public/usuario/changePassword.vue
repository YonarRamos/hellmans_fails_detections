<template>
  <v-layout row justify-center>
    <v-dialog v-model="modalChangePasswordUsuario" persistent max-width="50%">
      <v-card>
        <v-card-title dark class="blue-grey darken-4 elevation-2">
          <v-icon dark x-large>people_outline</v-icon>
          <v-spacer></v-spacer>
          <span class="headline grey--text">Cambiar contraseña</span>
          <v-spacer></v-spacer>
          <v-btn color="pink" flat icon @click.native="hideModal">
            <v-icon x-large>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  prepend-icon="lock"
                  v-model="usuario.oldPassword"
                  :rules="passwordRules"
                  name="oldPassword"
                  label="Password actual"
                  id="oldPassword"
                  type="password"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  prepend-icon="lock"
                  v-model="usuario.newPassword"
                  :rules="new_passwordRules"
                  name="newPassword"
                  label="Nuevo password"
                  id="newPassword"
                  type="password"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn dark color="green" @click.native="submitForm" block>Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      usuario: {
        oldPassword: null,
        newPassword: null
      },
      valid: false,
      passwordRules: [v => !!v || 'La contraseña no puede ser vacia'],
      new_passwordRules: [v => !!v || 'La contraseña no puede ser vacia'],
      breadcrumbsItems: [
        { text: 'Configuraciones', disabled: true },
        { text: 'Usuario', disabled: true },
        { text: 'Cambio de contraseña', disabled: true }
      ],
      payload: { content: null }
    }
  },
  computed: {
    ...mapGetters(['auth', 'modalChangePasswordUsuario'])
  },
  methods: {
    ...mapMutations(['MODAL_CHANGE_PASSWORD_USUARIO']),
    ...mapActions(['changePasswordUsuario']),
    hideModal() {
      this.MODAL_CHANGE_PASSWORD_USUARIO(false)
    },
    submitForm() {
      if (this.valid) {
        this.changePassword()
      } else {
        return false
      }
    },
    changePassword() {
      this.payload.content = this.usuario
      this.changePasswordUsuario(this.payload)
    }
  }
}
</script>
