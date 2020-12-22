<template>
  <v-layout row justify-center align-center>
    <v-dialog v-model="modalEliminarUser" width="500" persistent>
      <v-card class="modal elevation-0">
        <v-card-title class="elevation-0 py-0 px-1">
          <v-spacer></v-spacer>
          <span class="title red--text">{{title}}</span>
          <v-spacer></v-spacer>
          <v-btn icon flat color="grey" @click="SET_MODAL_ELIMINAR_USER(false)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap justify-center text-xs-center>
            <v-flex xs12>
              <v-icon class="advertencia" color="orange">error_outline</v-icon>
            </v-flex>
            <v-flex>
              <span class="subheading grey--text">{{ sub_title }}</span>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn block dark flat color="red" @click="eliminarUser()">Si, eliminar</v-btn>
          <v-btn block dark flat color="blue" @click="SET_MODAL_ELIMINAR_USER(false)">cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<style scoped>
.advertencia {
  font-size: 100px;
}
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
      title: 'Seguro que desea eliminar el elemento?',
      sub_title: 'ADVERTENCIA: Se perderan todos los registros asociados'
    }
  },

  mixins: [notify],

  computed: {
    ...mapGetters(['user', 'modalEliminarUser'])
  },

  methods: {
    ...mapMutations(['SET_MODAL_ELIMINAR_USER']),
    ...mapActions(['deleteUser']),
    eliminarUser() {
      const payload = {
        content: this.user
      }
      this.deleteUser(payload)
        .then(response => {
          this.alertSuccess()
          this.SET_MODAL_ELIMINAR_USER(false)
        })
        .catch(error => {
          this.alertError(
            error
          )
        })
    }
  }
}
</script>
