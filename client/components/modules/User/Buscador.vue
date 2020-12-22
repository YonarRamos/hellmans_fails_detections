<template>
  <v-layout>
    <v-flex xs6></v-flex>
    <v-flex xs6>
      <v-text-field
        v-model="search"
        class="buscador"
        append-icon="search"
        label="Buscar usuario por email"
        color="blue"
        outline
        single-line
        hide-details
        clearable
        @click:append="buscar()"
        @click:clear="limpiar()"
        @keyup.enter.native="buscar()"
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      search: '',
      searchField: 'email'
    }
  },

  methods: {
    ...mapActions(['getAllUsers']),
    buscar() {
      this.getAllItems()
    },
    limpiar() {
      this.search = ''
      this.getAllItems()
    },
    getAllItems() {
      const payload = {
        params: {
          searchField: this.searchField,
          search: this.search
        }
      }
      this.getAllUsers(payload)
    }
  }
}
</script>

<style scoped>
</style>