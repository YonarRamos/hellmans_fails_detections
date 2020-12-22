<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-toolbar class="blue-grey darken-4" dense>
            <h4 class="white--text">
              <strong>Administracion causas de falla</strong>
            </h4>
            <v-spacer></v-spacer>
            <v-btn icon flat @click="agregarCausa()">
              <v-icon color="white">add</v-icon>
            </v-btn>
            <v-btn icon flat @click="getCausas()">
              <v-icon color="white">refresh</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="causas"
              style="width: 100%"
              class="elevation-0 table-striped"
              no-data-text="No hay datos registrados en el sistema"
              rows-per-page-text="Por pagina"
              :rows-per-page-items="[25, 50, 100, 200]"
              disable-initial-sort
            >
              <template slot="items" slot-scope="props">
                <tr class="text-xs-left">
                  <td>
                    <strong class="blue--text">{{ props.item.nombre }}</strong>
                  </td>
                  <td>{{ props.item.tipo_equipo.nombre }}</td>
                  <td>{{ props.item.descripcion }}</td>
                  <td>
                    <div class="text-xs-right">
                      <v-btn icon flat @click="editarCausa(props.item)">
                        <v-icon color="blue-grey">edit</v-icon>
                      </v-btn>
                      <v-btn icon flat @click="eliminarCausa(props.item)">
                        <v-icon color="pink">delete</v-icon>
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogAgregar" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <span class="headline --text">AGREGAR CAUSA DE FALLA</span>
          <v-spacer></v-spacer>
          <v-btn color="pink" flat icon @click="dialogAgregar = false">
            <v-icon x-large>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form class="formRegister">
            <v-layout row wrap align-center justify-center>
              <v-flex xs12 md10>
                <v-text-field label="Causa" name="name" v-model="causa.nombre" required></v-text-field>
              </v-flex>
              <v-flex xs12 md10>
                <v-select
                  :items="tipos"
                  v-model="causa.tipo_equipo_id"
                  label="Tipo de falla"
                  single-line
                  hide-details
                ></v-select>
              </v-flex>
              <v-flex xs12 md10>
                <v-textarea label="Descripcion" v-model="causa.descripcion"></v-textarea>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn dark color="green" @click.native="submitAgregarCausa()" block>Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEditar" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <span class="headline --text">EDITAR CAUSA DE FALLA</span>
          <v-spacer></v-spacer>
          <v-btn color="pink" flat icon @click="dialogEditar = false">
            <v-icon x-large>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form class="formRegister">
            <v-layout row wrap align-center justify-center>
              <v-flex xs12 md10>
                <v-text-field label="Causa" name="name" v-model="causa.nombre" required></v-text-field>
              </v-flex>
              <v-flex xs12 md10>
                <v-select
                  :items="tipos"
                  v-model="causa.tipo_equipo_id"
                  label="Tipo de falla"
                  single-line
                  hide-details
                ></v-select>
              </v-flex>
              <v-flex xs12 md10>
                <v-textarea label="Descripcion" v-model="causa.descripcion"></v-textarea>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn dark color="green" @click.native="submitEditarCausa()" block>Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEliminar" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <span class="headline --text">ELIMINAR CAUSA DE FALLA</span>
          <v-spacer></v-spacer>
          <v-btn color="pink" flat icon @click="dialogEliminar = false">
            <v-icon x-large>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text style="margin-top: -50px">
          <h2 class="font-weight-thin mb-3 mt-5">Seguro que quiere eliminar el registro?</h2>
          <h4
            class="subheading grey--text"
          >Si se elimina el registro se perderan todos los datos asociados a el.</h4>
        </v-card-text>
        <v-card-actions>
          <v-btn dark color="red" @click.native="submitEliminarCausa()" block>Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from '@/plugins/axios'
import mixins from '@/mixins'
export default {
  data() {
    return {
      dialogAgregar: false,
      dialogEditar: false,
      dialogEliminar: false,
      causa: {
        nombre: null,
        tipo_equipo_id: null,
        descripcion: null
      },
      tipos: [],
      causas: [],
      headers: [
        { text: 'Causa', value: 'Causa' },
        { text: 'Tipo', value: 'Tipo' },
        { text: 'Descripcion', value: 'Descripcion' },
        { text: '', value: '' }
      ]
    }
  },

  mixins: [mixins],

  async created() {
    await this.getCausas()
    await this.getTipos()
  },
  methods: {
    async getTipos() {
      await axios.get('tipo_equipos').then(response => {
        this.tipos = response.data.data.map(item => {
          item.text = item.nombre
          item.value = item.id
          return item
        })
      })
    },
    async getCausas() {
      await axios.get('mapa_causas').then(response => {
        this.causas = response.data.data
      })
    },
    agregarCausa() {
      this.causa = {
        nombre: null,
        tipo_equipo_id: null,
        descripcion: null
      }
      this.dialogAgregar = true
    },
    editarCausa(item) {
      this.causa = item
      this.dialogEditar = true
    },
    eliminarCausa(item) {
      this.causa = item
      this.dialogEliminar = true
    },
    async submitAgregarCausa() {
      await axios.post('mapa_causas', this.causa).then(response => {
        this.alertSuccess()
        this.dialogAgregar = false
        this.getCausas()
      })
    },
    async submitEditarCausa() {
      await axios
        .put('mapa_causas/' + this.causa.id, this.causa)
        .then(response => {
          this.alertSuccess()
          this.dialogEditar = false
          this.getCausas()
        })
    },
    async submitEliminarCausa() {
      await axios.delete('mapa_causas/' + this.causa.id).then(response => {
        this.alertSuccess()
        this.dialogEliminar = false
        this.getCausas()
      })
    }
  }
}
</script>
