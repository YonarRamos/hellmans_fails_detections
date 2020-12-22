<template>
  <v-footer fixed dense height="auto" color="blue">
    <v-layout justify-center row wrap>
      <template v-for="(item, i) in items">
        <v-menu
          v-bind:key="i"
          offset-y
          origin="center center"
          :nudge-bottom="10"
          transition="scale-transition"
        >
          <v-btn
            v-bind:key="i"
            @click="seleccionarEquipo(item)"
            flat
            slot="activator"
            :color="equipoSeleccionado(item)"
            round
            dark
          >
            <span>{{ item.nombre }}</span>
          </v-btn>
        </v-menu>
      </template>
      <v-btn @click="getItems()" flat icon color="white">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-layout>
  </v-footer>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import axios from '@/plugins/axios'
import _ from 'lodash'

export default {
  data: () => ({
    items: [],
    equipos: [],
    equipo: null
  }),

  created() {
    this.getEquipos()
  },

  watch: {
    equipos() {
      this.getItems()
    }
  },

  methods: {
    ...mapMutations(['SET_EQUIPO_SELECCIONADO', 'SET_APLICAR_FILTRO']),
    getItems() {
      const items = _.groupBy(this.equipos, 'grupo')
      this.items = []
      for (const key in items) {
        this.items.push({ nombre: key, categoria: 'grupo' })
      }
      this.items = this.items.filter(item => {
        if (
          item.nombre !== 'CIP' &&
          item.nombre !== 'PLAYA TANQUES' &&
          item.nombre !== 'KETCHUP' &&
          item.nombre !== ''
        ) {
          return true
        }
      })
    },
    seleccionarEquipo(item) {
      if (item.categoria !== 'grupo') {
        this.SET_EQUIPO_SELECCIONADO(item)
        this.SET_APLICAR_FILTRO()
      } else {
        this.items = this.equipos.filter(equipo => {
          if (equipo.grupo === item.nombre && equipo.sub_grupo === '') {
            return true
          }
        })
      }
    },
    equipoSeleccionado(equipo) {
      if (this.equipo) {
        if (equipo.id === this.equipo.id) {
          return 'pink darken-4'
        }
      }
      return 'white'
    },
    getEquipos() {
      axios.get('equipos?perPage=1000').then(response => {
        this.equipos = response.data.data
        this.getItems()
      })
    }
  }
}
</script>