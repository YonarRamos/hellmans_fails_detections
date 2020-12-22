<template>
  <div class="px-0">
    <template v-for="(item, i) in items">
      <v-chip
        :key="i"
        label
        :style="`background-color: ${item.color_grafico}`"
        class="white--text"
      >{{ item.nombre }}</v-chip>
    </template>
  </div>
</template>

<style scoped>
.line-chart {
  height: 30px;
}
.zoom {
  transition: transform 0.2s;
  margin: 0 auto;
}
.zoom:hover {
  transform: scale(1);
  opacity: 0.6;
  border-width: 5px;
}
</style>

<script>
import { mapGetters, mapMutations } from 'vuex'
import axios from '@/plugins/axios'
import moment from 'moment'
import mathjs from 'mathjs'
export default {
  data: () => ({
    items: []
  }),
  computed: {
    ...mapGetters(['equipoSeleccionado'])
  },
  watch: {
    equipoSeleccionado() {
      if (this.equipoSeleccionado) {
        this.getReferences()
      }
    }
  },
  methods: {
    getReferences() {
      axios
        .get(`equipos/${this.equipoSeleccionado.id}/mapa_estados`)
        .then(response => {
          this.items = response.data
        })
    }
  }
}
</script>
