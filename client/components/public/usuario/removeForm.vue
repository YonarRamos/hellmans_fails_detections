<template>
  <v-layout row justify-center>
    <v-dialog v-model="modalRemoveUsuario" persistent max-width="50%">
      <v-card>
        <v-card-title dark class="blue-grey darken-4 elevation-2">
          <v-icon dark x-large>people_outline</v-icon>
          <v-spacer></v-spacer>
          <span class="headline grey--text">Eliminar usuario</span>
          <v-spacer></v-spacer>
          <v-btn color="pink" flat icon @click.native="hideModal">
            <v-icon x-large>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <h2 class="font-weight-thin mb-3 mt-5">{{ title }}</h2>
          <h4 class="subheading grey--text">{{ sub_title }}</h4>
        </v-card-text>
        <v-card-actions>
          <v-btn dark color="red" @click.native="submitForm" block>Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  props: {
    usuario: {
      required: true,
      default: {
        name: null,
        lastname: null,
        email: null,
        password: null,
        type: null
      }
    }
  },
  data() {
    return {
      title: 'Seguro que desea eliminar al usuario',
      sub_title:
        'ADVERTENCIA: Se perderan todos los registros asociados al usuario',
      payload: { content: null }
    }
  },
  computed: {
    ...mapGetters(['modalRemoveUsuario'])
  },
  methods: {
    ...mapMutations(['MODAL_REMOVE_USUARIO']),
    ...mapActions(['deleteUsuario']),
    hideModal() {
      this.MODAL_REMOVE_USUARIO(false)
    },
    save() {
      this.payload.content = this.usuario
      this.deleteUsuario(this.payload)
      this.MODAL_REMOVE_USUARIO(false)
    },
    submitForm() {
      this.save()
    }
  }
}
</script>
