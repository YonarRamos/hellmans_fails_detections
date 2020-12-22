<template>
  <v-container>
    <v-layout row class="filtro">
      <v-flex>
        <v-menu
          ref="menuFechaDesde"
          v-model="menuFechaDesde"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          offset-y
          full-width
          transition="scale-transition"
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="fechaDesde"
            label="Desde"
            persistent-hint
            prepend-icon="event"
          />
          <v-date-picker
            v-model="fechaDesde"
            no-title
            locale="es-es"
            @input="menuFechaDesde = false"
          />
        </v-menu>
      </v-flex>
      <v-flex>
        <v-menu
          ref="menuHoraDesde"
          :close-on-content-click="false"
          v-model="menuHoraDesde"
          :nudge-right="40"
          :return-value.sync="horaDesde"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <v-text-field slot="activator" v-model="horaDesde" label prepend-icon="access_time"/>
          <v-time-picker
            v-if="menuHoraDesde"
            v-model="horaDesde"
            format="24hr"
            no-title
            locale="es-es"
            @change="$refs.menuHoraDesde.save(horaDesde)"
          />
        </v-menu>
      </v-flex>
      <v-flex>
        <v-menu
          ref="menuFechaDesde"
          :close-on-content-click="false"
          v-model="menuFechaHasta"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="fechaHasta"
            label="Hasta"
            persistent-hint
            prepend-icon="event"
          />
          <v-date-picker
            v-model="fechaHasta"
            no-title
            locale="es-es"
            @input="menuFechaHasta = false"
          />
        </v-menu>
      </v-flex>
      <v-flex>
        <v-menu
          ref="menuHoraHasta"
          v-model="menuHoraHasta"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="horaHasta"
          lazy
          offset-y
          full-width
          transition="scale-transition"
          max-width="290px"
          min-width="290px"
        >
          <v-text-field slot="activator" v-model="horaHasta" prepend-icon="access_time"/>
          <v-time-picker
            v-if="menuHoraHasta"
            v-model="horaHasta"
            no-title
            format="24hr"
            locale="es-es"
            @change="$refs.menuHoraHasta.save(horaHasta)"
          />
        </v-menu>
      </v-flex>
      <v-flex>
        <v-btn color="blue" flat style="margin-top: 10px;" @click="save()">
          <v-icon>refresh</v-icon>Filtrar
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
export default {
  data: () => ({
    date: null,
    fechaDesde: null,
    fechaHasta: null,
    menuFechaDesde: false,
    menuFechaHasta: false,
    horaDesde: null,
    horaHasta: null,
    menuHoraDesde: false,
    menuHoraHasta: false,
    close: null,
    valid: ''
  }),
  computed: {
    ...mapGetters(['aplicarFiltro', 'desde', 'hasta'])
  },
  watch: {
    date() {
      // this.fechaDesde = moment(this.date).format('YYYY-MM-DD');
      // this.fechaHasta = moment(this.date).format('YYYY-MM-DD');
    }
  },
  created() {
    this.date = moment().format('YYYY-MM-DD')
    this.fechaDesde = moment()
      .add(-1, 'days')
      .format('YYYY-MM-DD')
    this.fechaHasta = moment().format('YYYY-MM-DD')
    this.horaDesde = '06:00:00'
    this.horaHasta = '05:59:59'

    const desde = moment(new Date(this.fechaDesde + ' ' + this.horaDesde))
      .add(-3, 'hours')
      .format('YYYY-MM-DD HH:mm:ss')

    const hasta = moment(new Date(this.fechaHasta + ' ' + this.horaHasta))
      .add(-3, 'hours')
      .format('YYYY-MM-DD HH:mm:ss')

    this.SET_DESDE(new Date(desde))
    this.SET_HASTA(new Date(hasta))
  },
  methods: {
    ...mapMutations(['SET_DESDE', 'SET_HASTA', 'SET_APLICAR_FILTRO']),
    save() {
      if (this.date && this.horaDesde && this.horaHasta) {
        const desde = moment(new Date(this.fechaDesde + ' ' + this.horaDesde))
          .add(-3, 'hours')
          .format('YYYY-MM-DD HH:mm:ss')

        const hasta = moment(new Date(this.fechaHasta + ' ' + this.horaHasta))
          .add(-3, 'hours')
          .format('YYYY-MM-DD HH:mm:ss')

        this.SET_DESDE(new Date(desde))
        this.SET_HASTA(new Date(hasta))

        this.SET_APLICAR_FILTRO()
        this.close = false
      }
    },
    dateTimeNow() {
      this.date = moment().format('YYYY-MM-DD')
      this.fechaDesde = moment(this.date).format('YYYY-MM-DD')
      this.fechaHasta = moment(this.date).format('YYYY-MM-DD')
      this.horaDesde = this.workShiftNow()
      this.horaHasta = moment().format('HH:mm:ss')
    },
    dateTimeNight() {
      this.date = moment().format('YYYY-MM-DD')
      this.fechaDesde = moment(this.date).format('YYYY-MM-DD')
      this.fechaHasta = moment(this.date).format('YYYY-MM-DD')
      this.horaDesde = '22:00:00'
      this.horaHasta = '06:00:00'
    },
    dateTimeAfternoon() {
      this.date = moment().format('YYYY-MM-DD')
      this.fechaDesde = moment(this.date).format('YYYY-MM-DD')
      this.fechaHasta = moment(this.date).format('YYYY-MM-DD')
      this.horaDesde = '14:00:00'
      this.horaHasta = '22:00:00'
    },
    dateTimeMorning() {
      this.date = moment().format('YYYY-MM-DD')
      this.fechaDesde = moment(this.date).format('YYYY-MM-DD')
      this.fechaHasta = moment(this.date).format('YYYY-MM-DD')
      this.horaDesde = '06:00:00'
      this.horaHasta = '14:00:00'
    },
    workShiftNow() {
      let dateTimeNow = moment().format('H')
      let workShiftNight = 22
      let workShiftAfternoon = 14
      let workShiftMorning = 6

      if (dateTimeNow >= workShiftNight) {
        return '22:00:00'
      } else if (dateTimeNow >= workShiftAfternoon) {
        return '14:00:00'
      } else if (dateTimeNow >= workShiftMorning) {
        return '06:00:00'
      } else {
        return '22:00:00'
      }
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
