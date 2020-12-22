<template>
  <div class="pa-1 pagina">
    <v-layout row wrap>
      <v-flex xs6></v-flex>
      <v-flex xs6>
        <buscador/>
      </v-flex>
      <v-flex xs12>
        <tendencia-tabla class="mt-2"/>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import notify from '@/mixins/notify'
import { mapGetters, mapMutations } from 'vuex'
import TendenciaTabla from '@/components/modules/Tendencia/Tabla'
import Buscador from '@/components/modules/Tendencia/Buscador'
export default {
  components: {
    TendenciaTabla,
    Buscador
  },

  data() {
    return {}
  },

  mixins: [notify],

  computed: {
    ...mapGetters(['modalAgregarTendencia'])
  },

  methods: {
    ...mapMutations(['SET_MODAL_AGREGAR_TENDENCIA'])
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
