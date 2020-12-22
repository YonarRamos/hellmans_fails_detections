<template>
    <div class="text-xs-center">
        <template v-for="area in areaSelected">
            <v-chip 
              :key="area"
              outline
              color="primary">
              {{area}}
            </v-chip>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'chip-selected',
  data: () => ({}),
  computed: {
    ...mapGetters(['areaSelected'])
  },
  methods: {}
}
</script>
