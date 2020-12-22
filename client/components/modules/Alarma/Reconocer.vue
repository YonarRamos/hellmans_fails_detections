<template>
  <v-layout row justify-center>
    <v-dialog v-model="modalReconocerAlarma" width="400" persistent>
      <v-card class="modal elevation-0">
        <v-card-title class="elevation-0 py-0 px-2">
          <v-icon medium>alarm</v-icon>
          <v-spacer></v-spacer>
          <span class="title blue-grey--text">RECONOCER ALARMA</span>
          <v-spacer></v-spacer>
          <v-btn icon flat color="grey" @click="SET_MODAL_RECONOCER_ALARMA(false)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-layout justify-center>
              <v-flex xs12>
                <v-textarea
                  ref="Detalle"
                  v-model="alarmaReconocer.detalle"
                  label="Detalle"
                  placeholder="Detalle de lo ocurrido ..."
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn block dark flat color="green" @click="reconocerAlarma()">Guardar</v-btn>
          <v-btn block dark flat color="blue" @click="SET_MODAL_RECONOCER_ALARMA(false)">cancelar</v-btn>
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
      alarmaReconocer: {
        detalle: null
      },
      width: 0
    }
  },

  mixins: [notify],

  computed: {
    ...mapGetters(['alarma', 'modalReconocerAlarma'])
  },

  methods: {
    ...mapMutations(['SET_MODAL_RECONOCER_ALARMA', 'SET_ACTUALIZAR_ALARMAS']),
    ...mapActions(['ackAlarma']),
    reconocerAlarma() {
      const payload = {
        content: this.alarmaReconocer
      }
      this.ackAlarma(payload)
        .then(response => {
          this.alertSuccess()
          this.alarmaReconocer = {
            detalle: null
          }
          this.SET_MODAL_RECONOCER_ALARMA(false)
        })
        .catch(error => {
          this.alertError(error)
        })
    }
  }
}
</script>
