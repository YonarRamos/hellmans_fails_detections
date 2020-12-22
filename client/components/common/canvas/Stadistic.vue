<template>
  <div>
    <v-btn @click="createCanvas()">GRAF</v-btn>
    <div
      id="sales-doughnut-chart-us"
      class="inview"
    ></div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  middleware: 'authenticated',
  layout: 'custom',
  data: () => ({
    title: 'Alarmas'
  }),
  methods: {
    createCanvas() {
      var chart = new CanvasJS.Chart('chartContainer', {
        data: [
          {
            type: 'column',
            dataPoints: [
              { x: 10, y: 71 },
              { x: 20, y: 55 },
              { x: 30, y: 50 },
              { x: 40, y: 65 },
              { x: 50, y: 95 },
              { x: 60, y: 68 },
              { x: 70, y: 28 },
              { x: 80, y: 34 },
              { x: 90, y: 14 }
            ]
          }
        ]
      })

      chart.render()
    }
  }
}
</script>
