<template>
  <v-card class="carta-tabla elevation-0">
    <v-data-table
      :headers="headers"
      :items="alarmas.data"
      :loading="loading"
      :pagination.sync="pagination"
      :total-items="parseInt(alarmas.total)"
      no-data-text="No hay datos registrados en el sistema"
      no-results-text="No hay datos registrados en el sistema"
      :rows-per-page-items="[10, 25, 50]"
      rows-per-page-text="Por pagina"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-left">
            <strong class="blue-grey--text ml-3">{{ props.item.created_at }}</strong>
          </td>
          <td class="text-xs-left">{{ props.item.descripcion }}</td>
          <td class="text-xs-left">{{ props.item.codigo_producto }}</td>
          <td class="text-xs-left">{{ props.item.tendencia.tag }}</td>
          <td class="text-xs-left">{{ props.item.updated_at }}</td>
          <td class="text-xs-left">{{ props.item.detalle }}</td>
          <td class="text-xs-left">{{ props.item.usuario }}</td>
          <td class="text-xs-right">
            <div>
              <v-icon
                :disabled="props.item.reconocida"
                color="red"
                @click="reconocerAlarma(props.item)"
              >{{props.item.reconocida ? 'alarm_on' : 'alarm'}}</v-icon>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
    <alarma-reconocer v-if="modalReconocerAlarma"/>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import AlarmaReconocer from '@/components/modules/Alarma/Reconocer'
export default {
  components: {
    AlarmaReconocer
  },

  data() {
    return {
      headers: [
        { text: 'Fecha', value: 'created_at', align: 'left' },
        { text: 'Descripcion', value: 'descripcion', align: 'left' },
        { text: 'Codigo producto', value: 'codigo_producto', align: 'left' },
        {
          text: 'Tendencia',
          value: 'tendencia',
          align: 'left',
          sortable: false
        },
        { text: 'Reconocida', value: 'updated_at', align: 'left' },
        { text: 'Detalle', value: 'detalle', align: 'left' },
        { text: 'Usuario', value: 'usuario', align: 'left' },
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
        this.getAlarmas()
      },
      deep: true
    }
  },

  computed: {
    ...mapGetters(['alarmas', 'payloadAlarmas', 'modalReconocerAlarma'])
  },

  methods: {
    ...mapMutations(['SET_ALARMA', 'SET_MODAL_RECONOCER_ALARMA']),
    ...mapActions(['getAllAlarmas']),
    async getAlarmas() {
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

      await this.getAllAlarmas(payload)
      this.loading = false
    },
    expandTabla(props) {
      props.expanded = !props.expanded
    },
    buscar() {
      this.getAlarmas()
    },
    limpiar() {
      this.search = ''
      this.getAlarmas()
    },
    reconocerAlarma(item) {
      this.SET_ALARMA(item)
      this.SET_MODAL_RECONOCER_ALARMA(true)
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
