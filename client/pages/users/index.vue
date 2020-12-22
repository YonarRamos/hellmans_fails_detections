<template>
  <v-app id="pageUser">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-toolbar class="blue-grey darken-4" dense>
              <h4 class="white--text">
                <strong>PANEL DE USUARIOS</strong> - Lista de usuarios registrados
              </h4>
              <v-spacer></v-spacer>
              <v-btn icon flat @click="addUsuario()">
                <v-icon color="white">add</v-icon>
              </v-btn>
              <v-btn icon flat @click="refreshData()">
                <v-icon color="white">refresh</v-icon>
              </v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <template>
                <v-data-table
                  :headers="headers"
                  :items="usuarios"
                  :pagination.sync="pagination"
                  :total-items="totalPageUsuarios"
                  style="width: 100%"
                  class="elevation-0 table-striped"
                  no-data-text="No hay datos registrados en el sistema"
                  rows-per-page-text="Por pagina"
                  :rows-per-page-items="[25, 50, 100, 200]"
                  disable-initial-sort
                >
                  <template slot="items" slot-scope="props">
                    <tr>
                      <td>
                        <strong class="blue--text">{{ props.item.email }}</strong>
                      </td>
                      <td>{{ props.item.username }}</td>
                      <td>{{ props.item.lastname }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>
                        <div class="text-xs-right">
                          <v-btn icon flat @click="editUsuario(props.item)">
                            <v-icon color="blue-grey">edit</v-icon>
                          </v-btn>
                          <v-btn icon flat @click="removeUsuario(props.item)">
                            <v-icon color="pink">delete</v-icon>
                          </v-btn>
                        </div>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </template>
              <v-divider></v-divider>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <add-form></add-form>
    <edit-form :usuario="usuario"></edit-form>
    <remove-form :usuario="usuario"></remove-form>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import addForm from '@/components/public/usuario/addForm'
import editForm from '@/components/public/usuario/editForm'
import removeForm from '@/components/public/usuario/removeForm'
export default {
  middleware: 'authenticated',
  layout: 'custom',
  components: {
    addForm,
    editForm,
    removeForm
  },
  data: () => ({
    usuario: {
      name: null,
      lastname: null,
      email: null,
      password: null,
      type: null
    },
    headers: [
      { text: 'Email', value: 'email' },
      { text: 'Username', value: 'username' },
      { text: 'Apellido', value: 'lastname' },
      { text: 'Nombre', value: 'name' }
    ],
    pagination: {},
    payload: {
      content: null,
      limit: null,
      skip: null,
      where: null,
      order: null
    }
  }),
  computed: {
    ...mapGetters(['usuarios', 'totalPageUsuarios'])
  },
  watch: {
    pagination: {
      handler() {
        if (this.pagination.sortBy) {
          this.sortPaginate(this.pagination.sortBy, this.pagination.descending)
        }
        this.payload.limit = this.pagination.rowsPerPage
        this.payload.skip =
          this.pagination.rowsPerPage * (this.pagination.page - 1)
        this.getAllusuarios(this.payload).then(data => {
          this.getTotalPageUsuarios(this.payload)
        })
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations([
      'MODAL_ADD_USUARIO',
      'MODAL_EDIT_USUARIO',
      'MODAL_REMOVE_USUARIO'
    ]),
    ...mapActions(['getAllusuarios', 'getTotalPageUsuarios']),
    sortPaginate(sortBy, descending) {
      let order = ''
      order = descending ? 'ASC' : 'DESC'
      this.payload.order = sortBy + ' ' + order
    },
    refreshData() {
      this.getAllusuarios(this.payload).then(data => {
        this.getTotalPageUsuarios(this.payload)
      })
    },
    addUsuario() {
      this.MODAL_ADD_USUARIO(true)
    },
    editUsuario(item) {
      this.usuario = item
      this.MODAL_EDIT_USUARIO(true)
    },
    removeUsuario(item) {
      this.usuario = item
      this.MODAL_REMOVE_USUARIO(true)
    }
  }
}
</script>

<style scoped lang="css">
h1 {
  font-size: 150px;
  line-height: 150px;
  font-weight: 700;
  color: #252932;
  text-shadow: rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px,
    rgba(61, 61, 61, 0.3) 3px 3px;
}
</style>
