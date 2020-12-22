<template>
  <div class="pa-1 pagina">
    <v-layout row wrap>
      <v-flex xs6></v-flex>
      <v-flex xs6>
        <buscador/>
      </v-flex>
      <v-flex xs12>
        <alarma-tabla class="mt-2"/>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import notify from '@/mixins/notify'
import { mapGetters, mapMutations } from 'vuex'
import AlarmaTabla from '@/components/modules/Alarma/Tabla'
import Buscador from '@/components/modules/Alarma/Buscador'
export default {
  components: {
    AlarmaTabla,
    Buscador
  },

  data() {
    return {}
  },

  mixins: [notify],

  computed: {
    ...mapGetters(['modalAgregarAlarma'])
  },

  methods: {
    ...mapMutations(['SET_MODAL_AGREGAR_ALARMA'])
  }
}
</script>

<style scoped>
.pagina {
  background-color: #ffffff;
}
.grupo-expand {
  border-radius: 4px;
  border: 1px solid #b0bec5;
  margin-top: 0.5rem;
  width: 100%;
  height: 60px;
}
.boton-agregar {
  border: 1px solid #b0bec5;
  border-radius: 4px;
  margin-top: 0.5rem;
  padding-left: 2.5rem;
  height: 60px;
  width: 100%;
}
</style>
