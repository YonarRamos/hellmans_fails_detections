<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-toolbar class="blue-grey darken-4" dense>
            <h4 class="white--text">
              <strong>Administracion de equipos y lineas</strong>
            </h4>
            <v-spacer></v-spacer>
            <v-btn icon flat @click="getEquipos()">
              <v-icon color="white">refresh</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="equipos"
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
                    <strong>{{ props.item.nombre }}</strong>
                  </td>
                  <td>{{ props.item.grupo }}</td>
                  <td>{{ props.item.sub_grupo }}</td>
                  <td>
                    <v-edit-dialog
                      :return-value.sync="props.item.notificar_estado"
                      large
                      lazy
                      persistent
                      @save="cambiarEstadoNotificacion(props.item)"
                    >
                      <div>
                        <v-btn flat icon>
                          <v-icon
                            :color="getColorIcon(props.item.notificar_estado)"
                          >{{ props.item.notificar_estado ? 'notifications' : 'notifications_off'}}</v-icon>
                        </v-btn>
                      </div>
                      <div slot="input" class="mt-3 title blue-grey--text">Mostrar en dashboard</div>
                      <v-switch
                        slot="input"
                        label="Mostrar estado en dashboard"
                        v-model="props.item.notificar_estado"
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
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="headline" primary-title>
          Editar {{ equipo.Nombre }}
          <v-spacer/>
          <v-icon large color="blue">save</v-icon>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="equipo.Nombre" label="Nombre de equipo" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="equipo.Tipo" label="Tipo de equipo" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="equipo.Categoria" label="Categoria de equipo" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="equipo.TagAlarma" label="Mapeo de alarmas" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="equipo.TagEstado" label="Mapeo de estado" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="equipo.TagRuteo" label="Mapeo de ruteo" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-autocomplete v-model="equipo.Grupo" :items="itemsGroup" label="Grupo"></v-autocomplete>
              </v-flex>
              <v-flex xs12>
                <v-autocomplete v-model="equipo.SubGrupo" :items="itemsSubGroup" label="Sub grupo"></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="gray" flat @click="modificarEquipo()">Guardar</v-btn>
          <v-btn color="blue darken-1" flat @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import axios from '@/plugins/axios'
import mixins from '@/mixins'
export default {
  data: () => ({
    dialog: false,
    equipo: {
      Nombre: null,
      Grupo: null,
      SubGrupo: null,
      Tipo: null,
      Categoria: null,
      TagAlarma: null,
      TagEstado: null,
      TagRuteo: null
    },
    itemsGroup: [],
    itemsSubGroup: [],
    equipos: [],
    equipoSeleccionado: null,
    headers: [
      { text: 'Nombre', value: 'nombre' },
      { text: 'Grupo', value: 'grupo' },
      { text: 'Sub Grupo', value: 'sub_grupo' },
      { text: 'Notificar estado', value: 'notificar_estado' }
    ]
  }),
  mixins: [mixins],
  created() {
    this.getEquipos()
  },
  methods: {
    getEquipos() {
      this.loading = true
      axios.get('equipos?perPage=10000').then(response => {
        this.equipos = response.data.data
        this.loading = false
      })
    },
    getColorIcon(value) {
      if (value) {
        return 'green'
      }
      return 'grey'
    },
    cambiarEstadoNotificacion(item) {
      axios
        .put(`equipos/${item.id}`, {
          notificar_estado: item.notificar_estado
        })
        .then(response => {
          this.alertSuccess()
        })
    },
    editarEquipo(item) {
      this.equipo = {
        id: item.id,
        nombre: item.nombre,
        tipo: item.tipo,
        categoria: item.categoria,
        grupo: item.grupo,
        sub_grupo: item.sub_grupo
      }
      this.dialog = true
    },
    modificarEquipo() {
      axios.put(`equipos/${this.equipo.id}`, this.equipo).then(response => {
        this.alertSuccess()
        this.dialog = false
        this.getEquipos()
      })
    }
  }
}
</script>
