<template>
  <div class="alarmas">
    <template v-for="(item, i) in alarmasNotificadas">
      <v-alert
        :key="i"
        :value="true"
        :type="getColor(item.duracion)"
        outline
        class="pt-1 pb-1 mt-2"
      >
        <div class="layout row ma-0 justify-space-between">
          <strong>{{ item.grupo }}:</strong>
          <span class="grey--text">
            {{ item.duracion / 60 | redondear }}
            <strong>min</strong>
          </span>
        </div>
        <span class="blue-grey--text">{{ item.nombre }}</span>
        <v-spacer></v-spacer>
      </v-alert>
    </template>
  </div>
</template>

<script>
import states from '@/api/states'
import mixins from '@/mixins'
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => ({}),

  mixins: [mixins],

  computed: {
    ...mapGetters(['alarmasNotificadas'])
  },

  methods: {
    getColor(Duration) {
      if (Duration > 90) {
        return 'error'
      } else if (Duration > 60) {
        return 'warning'
      } else if (Duration > 30) {
        return 'info'
      }
      return 'info'
    }
  }
}
</script>

<style scoped>
.alarmas {
  background-color: rgb(231, 231, 231);
  border: 1px solid rgb(201, 201, 201);
  padding: 0 4px 0 4px;
  border-radius: 4px;
  height: 86vh;
}
</style>
