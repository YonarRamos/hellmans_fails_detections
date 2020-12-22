<template>
  <div class="pa-1 pagina">
    <v-layout row wrap>
      <v-flex xs6>
        <v-layout row wrap>
          <v-btn
            dark
            flat
            icon
            class="mt-3 ml-2"
            color="blue-grey"
            @click="SET_MODAL_AGREGAR_TANQUE(true)"
          >
            <v-icon>note_add</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <buscador/>
      </v-flex>
      <v-flex xs12>
        <tanque-tabla class="mt-2"/>
      </v-flex>
    </v-layout>
    <tanque-agregar v-if="modalAgregarTanque"/>
  </div>
</template>

<script>
import notify from '@/mixins/notify'
import { mapGetters, mapMutations } from 'vuex'
import TanqueTabla from '@/components/modules/Tanque/Tabla'
import TanqueAgregar from '@/components/modules/Tanque/Agregar'
import Buscador from '@/components/modules/Tanque/Buscador'
export default {
  components: {
    TanqueTabla,
    TanqueAgregar,
    Buscador
  },

  data() {
    return {}
  },

  mixins: [notify],

  computed: {
    ...mapGetters(['modalAgregarTanque'])
  },

  methods: {
    ...mapMutations(['SET_MODAL_AGREGAR_TANQUE'])
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
