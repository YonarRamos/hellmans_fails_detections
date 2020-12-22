<template>
  <v-card class="carta-tabla elevation-0">
    <v-data-table
      :headers="headers"
      :items="users.data"
      :loading="loading"
      :pagination.sync="pagination"
      :total-items="parseInt(users.total)"
      no-data-text="No hay datos registrados en el sistema"
      no-results-text="No hay datos registrados en el sistema"
      :rows-per-page-items="[10, 25, 50]"
      rows-per-page-text="Por pagina"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-left">
            <strong class="blue-grey--text">{{ props.item.email }}</strong>
          </td>
          <td class="text-xs-left">{{ props.item.username }}</td>
          <td class="text-xs-right">
            <div>
              <v-icon
                :disabled="props.item.username == 'admin'"
                color="blue"
                @click="editarUser(props.item)"
              >edit</v-icon>
              <v-icon
                :disabled="props.item.username == 'admin'"
                color="pink"
                @click="eliminarUser(props.item)"
              >delete</v-icon>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
    <user-eliminar v-if="modalEliminarUser"/>
    <user-editar v-if="modalEditarUser"/>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import UserEliminar from '@/components/modules/User/Eliminar'
import UserEditar from '@/components/modules/User/Editar'
export default {
  components: {
    UserEliminar,
    UserEditar
  },

  data() {
    return {
      headers: [
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Username', value: 'username', align: 'left' },
        { text: '', value: '', sortable: false }
      ],
      items: [],
      loading: false,
      search: '',
      pagination: {}
    }
  },

  watch: {
    pagination: {
      handler() {
        this.getUsers()
      },
      deep: true
    }
  },

  computed: {
    ...mapGetters([
      'users',
      'payloadUsers',
      'modalEditarUser',
      'modalEliminarUser'
    ])
  },

  methods: {
    ...mapMutations([
      'SET_USER',
      'SET_PAYLOAD_USERS',
      'SET_MODAL_EDITAR_USER',
      'SET_MODAL_ELIMINAR_USER'
    ]),
    ...mapActions(['getAllUsers']),
    async getUsers() {
      this.loading = true
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      const payload = {
        params: {
          sortBy: sortBy,
          descending: descending ? 'DESC' : 'ASC',
          page: page,
          perPage: rowsPerPage
        }
      }

      await this.getAllUsers(payload)
      this.loading = false
    },
    expandTabla(props) {
      props.expanded = !props.expanded
    },
    buscar() {
      this.getUsers()
    },
    limpiar() {
      this.search = ''
      this.getUsers()
    },
    agregarUser() {
      this.SET_MODAL_AGREGAR_USER(true)
    },
    editarUser(item) {
      this.SET_USER(item)
      this.SET_MODAL_EDITAR_USER(true)
    },
    eliminarUser(item) {
      this.SET_USER(item)
      this.SET_MODAL_ELIMINAR_USER(true)
    }
  }
}
</script>

<style scoped>
.carta-tabla {
  border: 1px solid #b0bec5;
  border-radius: 4px;
}
</style>
