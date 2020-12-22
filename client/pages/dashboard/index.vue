<template>
  <v-layout row wrap>
    <v-flex xs12 pt-3 pb-0>
      <selector-tipo-adquisicion/>
    </v-flex>
    <v-flex md3 xl2 px-1>
      <alarmas-notificadas/>
    </v-flex>
    <v-flex md9 xl10 px-1>
      <v-layout row wrap>
        <template v-for="(item, i) in datosSocket">
          <v-flex :key="i" xs3 xl2 pa-1>
            <carta-estado :equipo="item"/>
          </v-flex>
        </template>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import CartaEstado from '~/components/public/dashboard/CartaEstado'
import AlarmasNotificadas from '@/components/public/dashboard/AlarmasNotificadas'
import SelectorTipoAdquisicion from '@/components/public/dashboard/SelectorTipoAdquisicion'
export default {
  middleware: 'authenticated',
  layout: 'custom',
  components: {
    CartaEstado,
    AlarmasNotificadas,
    SelectorTipoAdquisicion
  },
  data: () => ({}),
  computed: {
    ...mapGetters(['datosSocket', 'alarmasNotificadas'])
  }
}
</script>
