<template>
  <div>
    <v-card color="blue-grey lighten-5">
      <v-card-title>
        <v-layout row wrap>
          <v-flex xs4 text-xs-right>
            <v-select
              v-model="cipSeleccionado"
              multiple
              :items="itemsCIP"
              box
              label="Seleccione un equipo"
            ></v-select>
          </v-flex>
        <v-flex xs2 sm2>
           
          </v-flex>

          <v-flex xs6 text-xs-right>
            <v-btn large icon color="blue" dark @click="csvExport(csvData)">
              <v-icon>get_app</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="cips"
        :loading="loading"
        style="width: 100%"
        class="elevation-0"
        no-data-text="No hay datos registrados en el sistema"
        rows-per-page-text="Por pagina"
        :rows-per-page-items="[100]"
        disable-initial-sort
        item-key="inicio"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr
            @click="props.expanded = !props.expanded"
            class="text-xs-left"
            style="cursor: pointer;"
          >
            <td>
              <strong class="blue-grey--text">{{ props.item.Description }}</strong>
            </td>
            <td>{{ props.item.Description | circuito }}</td>
            <td> {{props.item.EventStamp | fecha}}</td>
            <td><strong>{{ props.item.duracion /60 | redondear }}</strong> min</td>
            <td>{{ props.item.Value }}</td> 
            <td><v-text-field v-model="props.item.target" type="number" class="body-1"  flat solo hide-details placeholder="Indicar litros"></v-text-field></td>
            <td><v-text-field flat solo hide-details readonly class="body-1 red--text" style="color: #000 !important;" :value="props.item.target ? props.item.desvio = props.item.target - props.item.Value : '...'" ></v-text-field></td>
            <td>{{ props.item.Description | FilterModo }}</td>
            <td>{{ props.item.Description | filterAprobado }}</td>
             
          </tr>
        </template>
      </v-data-table>
  
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import moment from 'moment'
import mathjs from 'mathjs'
import axios from '@/plugins/axios'
import mixins from '@/mixins'
import exportFromJSON from 'export-from-json'
import _ from 'lodash'
import  json from "@/static/DATOS_CIP.json";
export default {

  data: () => ({
    cips: [],
    cip:{
            "EventStamp": "",
            "TagName": "",
            "Description": "",
            "Area": "",
            "Value": "",
            "target":null,
            "desvio":null
        },
    datos: json,
    drenaje:null,
    prueba:'',
    headers: [
      { text: 'Descripción', value:'duracion'},
      { text: 'N° de circuito', value: 'description' },
      { text: 'Fecha', value: 'vol_env'},
      { text: 'Tiempo', value: 'vol_sani'},
      { text: 'Litro/Drenaje', value: 'inicio' },
      { text: 'Target Litros', value: 'fin' },
      { text: 'Desvio', value:'Duracion'},
      { text: 'Tipo Limpieza', value:'Duracion'},
      { text: 'Cond. Final', value:'Duracion'},
      
    ],
    itemsCIP: [
      {
        text: 'CIP L100',
        value: 'CIP1'
      },
      {
        text: 'CIP L200',
        value: 'CIP2'
      },
      {
        text: 'CIP L300',
        value: 'CIP3'
      },
      {
        text: 'CIP L400',
        value: 'CIP4'
      },
      {
        text: 'CIP L500',
        value: 'CIP5'
      },
      {
        text: 'CIP L600',
        value: 'CIP6'
      },
      {
        text: 'CIP L700',
        value: 'CIP7'
      },
      {
        text: 'CIP L1100',
        value: 'CIP11'
      },
      {
        text: 'CIP L1200',
        value: 'CIP12'
      }
    ],
    loading: false,
    runtime:[],
    equipos:[],
    cipSeleccionado: ['CIP11'],
    numeroObjeto:[''],
  }),

  mixins: [mixins],

  computed: {
    ...mapGetters(['aplicarFiltro', 'desde', 'hasta']),
    BusquedaPorNombre: function(){
    //  return this.cips.filter((item) => item.descripcion.match(this.nombredeobjeto))
    },
    csvData() {
      return this.BusquedaPorNombre.map(item => ({
        ...item,
        duracion: item.duracion,
        operaciones: item.operaciones[0].descripcion,
        Fecha: item.operaciones[0].fecha,
        Estados: item.operaciones[0].estado,
        
        Modo: item.operaciones[0].modo
      }))
    
      
    }
  },

  watch: {
    aplicarFiltro() {
      this.getCips()
    }
  },
  filters:{
    filterAprobado: function(value){
     let fin = value.includes('Fin')
     let abor = value.includes('Abortado')
     
     if(fin){
       return 'OK'
     }
     if(abor){
       return 'Abortado'
     }

    },
    FilterModo: function(value){
      let modo = value.includes('Modo')
      if(modo){
        return 'LAVADO'
      }
    },
    fecha: function(value){
     let  hasta = 
      moment(value)
        .format('YYYY-MM-DD HH:mm:ss')
   
    return hasta
    },
    circuito: function(value){
      let exp = /( [0-9]\S+)/
      let res = exp.exec(value)
      if(res){
        if(res[0] == " 0Modo:"){
          return ''
        }
        return res[0]
      }
      return ''
    }
  },
created(){
    this.getCips()
},
  methods: {

    ...mapMutations(['SET_APLICAR_FILTRO']),
    async getCips() {
      let arr = [];
      this.loading = true
      alert(this.desde,this.hasta,)

        await axios
        .get('cips1', {
          params: {
            desde: this.desde,
            hasta: this.hasta,
            cip: this.cipSeleccionado
          }
        })
        .then(response => {
          arr = response.data.cips;
          this.runtime = response.data.runtime;
        })
        this.cips=[];

        for (let i = 0;i<arr.length;i++) {
          let index =  this.runtime.findIndex(element => element.DateTime.toString().slice(0,10) == arr[i].EventStamp.toString().slice(0,10));
          if(index != -1){
            arr[i].Value = this.runtime[index].Value;
          }else{
            arr[i].Value = 0
          }
          this.cip = arr[i]
          this.cips.push(this.cip);
        }
      this.loading = false
    },
    csvExport(arrData) {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        Object.keys(arrData[0]).join(";"),
        ...arrData.map(item => Object.values(item).join(";"))
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", "export.csv");
      link.click();
    }
  }
}
</script>

<style>
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }
  input[type=number] { -moz-appearance:textfield; }
</style> 