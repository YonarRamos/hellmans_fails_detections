<template>
  <v-layout row wrap>
    <v-flex xs12 text-xs-right>
      <v-switch class="ml-1" v-model="reconocida" label="Considerar solor alarmas o causas"></v-switch>
    </v-flex>
    <v-flex xs12 pa-2>
      <v-card color="blue-grey lighten-5" height="300px">
        <div id="grafico"></div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style scoped>
#grafico {
  width: 100%;
  height: 100%;
}
</style>


<script>
import moment from 'moment'
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import mathjs from 'mathjs'
import axios from '@/plugins/axios'

export default {
  data: () => ({
    topAlarmas: [],
    topEstados: [],
    reconocida: false
  }),

  computed: {
    ...mapGetters(['aplicarFiltro', 'equipoSeleccionado', 'desde', 'hasta'])
  },

  watch: {
    aplicarFiltro() {
      if (this.equipoSeleccionado) {
        this.getTopAlarmas().then(data => {
          this.getTopEstados()
        })
      }
    },
    topEstados() {
      this.graficar()
    },
    reconocida() {
      if (this.equipoSeleccionado) {
        this.getTopAlarmas().then(data => {
          this.getTopEstados()
        })
      }
    }
  },

  methods: {
    async getTopAlarmas() {
      this.loading = true
      await axios
        .get(`equipos/${this.equipoSeleccionado.id}/alarmas`, {
          params: {
            desde: this.desde,
            hasta: this.hasta,
            group: true,
            reconocidas: this.reconocida
          }
        })
        .then(response => {
          this.topAlarmas = response.data
          this.loading = false
        })
    },
    async getTopEstados() {
      this.loading = true
      await axios
        .get(`equipos/${this.equipoSeleccionado.id}/estados`, {
          params: {
            desde: this.desde,
            hasta: this.hasta,
            group: true
          }
        })
        .then(response => {
          this.topEstados = response.data
          this.loading = false
        })
    },
    graficar() {
      let myChart = echarts.init(document.getElementById('grafico'))

      let categoriaAlarmas = this.topAlarmas.map(item => item.nombre)
      let duracionAlarmas = this.topAlarmas.map(item =>
        mathjs.round(item.duracion / 60, 2)
      )
      let recurrenciaAlarmas = this.topAlarmas.map(item => item.cantidad)

      let dataEstados = this.topEstados.map(item => {
        return {
          value: item.duracion,
          name: item.nombre,
          itemStyle: {
            normal: {
              opacity: 0.7,
              color: item.Color,
              borderWidth: 1,
              borderColor: '#ffffff'
            }
          }
        }
      })

      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: [
          {
            left: '4%',
            width: '90%',
            width: '74%'
          },
          {
            left: '76%',
            width: '21%'
          }
        ],
        xAxis: [
          {
            gridIndex: 0,
            type: 'category',
            data: categoriaAlarmas,
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          },
          {
            gridIndex: 1,
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          }
        ],
        yAxis: [
          {
            gridIndex: 0,
            min: 0,
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            },
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          {
            gridIndex: 0,
            min: 0,
            scale: true,
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            },
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          {
            gridIndex: 1,
            type: 'category',
            show: false
          }
        ],
        series: [
          {
            name: 'Alarmas',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: duracionAlarmas,
            itemStyle: {
              opacity: 0.7,
              color: '#235894',
              borderWidth: 2,
              borderColor: '#235894'
            }
          },
          {
            name: 'Recurrencia Alarmas',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 1,
            data: recurrenciaAlarmas,
            symbolSize: 7,
            lineStyle: {
              normal: {
                width: 2,
                color: 'black'
              }
            }
          },
          {
            name: 'Top Estados',
            type: 'pie',
            radius: '40%',
            center: ['88%', '40%'],
            data: dataEstados,
            tooltip: {}
          }
        ]
      }

      myChart.setOption(option)
    }
  }
}
</script>