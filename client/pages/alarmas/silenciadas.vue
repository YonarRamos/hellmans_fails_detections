<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-toolbar class="blue-grey darken-4" dense>
            <h4 class="white--text">
              <strong>Administracion de alarmas</strong>
            </h4>
            <v-spacer></v-spacer>
            <v-btn icon flat @click="getAllAlarmsNotConsidered()">
              <v-icon color="white">refresh</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="grupoAlarmas"
              style="width: 100%"
              class="elevation-0 table-striped pl-1 pr-1 pb-1"
              no-data-text="No hay datos registrados en el sistema"
              rows-per-page-text="Por pagina"
              :rows-per-page-items="[50]"
              disable-initial-sort
            >
              <template slot="items" slot-scope="props">
                <tr class="text-xs-left">
                  <td>
                    <strong class="blue-grey--text">{{ props.item.tag }}</strong>
                  </td>
                  <td>{{ props.item.descripcion }}</td>
                  <td>{{ props.item.area }}</td>
                  <td>
                    <v-edit-dialog
                      :return-value.sync="props.item.considerada"
                      large
                      lazy
                      persistent
                      @save="considerarAlarma(props.item)"
                    >
                      <div>
                        <v-btn flat icon>
                          <v-icon
                            :color="getColorIcon(props.item.considerada)"
                          >{{ props.item.considerada ? 'alarm_on' : 'alarm_off'}}</v-icon>
                        </v-btn>
                      </div>
                      <div
                        slot="input"
                        class="mt-3 title blue-grey--text"
                      >Considerar pero seguir buscano en ruteo</div>
                      <v-switch
                        slot="input"
                        label="Considerar alarmas"
                        v-model="props.item.considerada"
                      ></v-switch>
                    </v-edit-dialog>
                  </td>
                  <td>
                    <v-edit-dialog
                      :return-value.sync="props.item.silenciada"
                      large
                      lazy
                      persistent
                      @save="silenciarAlarma(props.item)"
                    >
                      <div>
                        <v-btn flat icon>
                          <v-icon
                            :color="getColorIcon(props.item.silenciada)"
                          >{{ props.item.silenciada ? 'mic' : 'mic_off'}}</v-icon>
                        </v-btn>
                      </div>
                      <div
                        slot="input"
                        class="mt-3 title blue-grey--text"
                      >Omitir este tipo de alarmas</div>
                      <v-switch
                        slot="input"
                        label="Silenciar alarma"
                        v-model="props.item.silenciada"
                      ></v-switch>
                    </v-edit-dialog>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import axios from '@/plugins/axios'
import mixins from '@/mixins'
export default {
  middleware: 'authenticated',
  layout: 'custom',
  data: () => ({
    headers: [
      { text: 'Tag', value: 'tag' },
      { text: 'Descripcion', value: 'descripcion' },
      { text: 'Grupo', value: 'area' },
      { text: 'Considerada', value: 'considerada' },
      { text: 'Silenciada', value: 'silenciada' }
    ],
    grupoAlarmas: []
  }),
  mixins: [mixins],
  created() {
    this.getGruposAlarmas()
  },
  methods: {
    getColorIcon(value) {
      if (value) {
        return 'green'
      }
      return 'grey'
    },
    getGruposAlarmas() {
      axios.get('grupos_alarmas').then(response => {
        this.grupoAlarmas = response.data
      })
    },
    async silendiarAlarma(item) {
      await axios.post(`alarmas/${item.id}/silenciar`).then(async response => {
        await this.getGruposAlarmas()
        this.dialogSilenciarAlarma = false
        this.alertSuccess()
      })
    },
    async considerarAlarma(item) {
      await axios.post(`alarmas/${item.id}/considerar`).then(async response => {
        await this.getGruposAlarmas()
        this.dialogSilenciarAlarma = false
        this.alertSuccess()
      })
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
