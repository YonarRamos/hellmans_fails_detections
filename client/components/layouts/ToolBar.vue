<template>
  <div>
    <v-toolbar color="blue darken-2" fixed dark app dense clipped-left>
      <v-toolbar-title class="ml-0 pl-3">
        <img class="pt-1 mr-3" src="../../static/logo_white.png" alt="Unilever" width="26">
      </v-toolbar-title>
      <v-toolbar-items>
        <template v-for="(menu, i) in menus">
          <v-btn
            :key="(i + 1)*-1"
            :class="getActiveClass(menu.to)"
            style="width: 150px height: 36px"
            flat
            small
            @click="goToPage(menu.to)"
          >
            <v-icon small>{{ menu.icon }}</v-icon>
            <span class="ml-2">{{ menu.title }}</span>
          </v-btn>
        </template>
      </v-toolbar-items>
      <v-spacer/>
      <v-btn icon small @click="handleFullScreen()">
        <v-icon>fullscreen</v-icon>
      </v-btn>
      <v-menu :nudge-bottom="10" offset-y left origin="center center" transition="scale-transition">
        <v-btn slot="activator" icon small flat>
          <v-icon>settings</v-icon>
        </v-btn>
        <v-list class="pa-0">
          <template v-for="(item, i) in items">
            <v-list-tile
              v-if="auth.type == 'Administrador'"
              :key="i"
              :to="item.to"
              ripple="ripple"
              el="noopener"
            >
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
          <v-list-tile
            v-if="auth.type == 'Administrador'"
            to
            ripple="ripple"
            el="noopener"
            @click="cambiarMinimoTimepoReconocimientoAlarma()"
          >
            <v-list-tile-action>
              <v-icon>autorenew</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Min tiempo de rec. de alarmas</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to ripple="ripple" el="noopener" @click="cambiarPassword()">
            <v-list-tile-action>
              <v-icon>lock_open</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Cambiar contraseña</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to ripple="ripple" el="noopener" @click="exitToApp()">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Salir</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-chip label color="blue lighten-1" text-color="white">
        <v-icon class="mr-2">alarm</v-icon>
        <clock/>
      </v-chip>
    </v-toolbar>
    <min-tiempo-alarma v-if="modalEditarConfiguracionMinTiempoAlarma"/>
    <cambiar-password v-if="modalCambiarPassword"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import MinTiempoAlarma from '@/components/modules/Configuracion/MinTiempoAlarma'
import CambiarPassword from '@/components/modules/User/CambiarPassword'
import Clock from '~/components/common/widgets/Clock'
import Util from '~/util'
import menu from '~/api/menu'
export default {
  components: {
    Clock,
    MinTiempoAlarma,
    CambiarPassword
  },
  data: () => ({
    menus: [
      {
        title: 'Dashboard',
        description: 'Indicadores de equipos y lineas',
        icon: 'dashboard',
        to: '/dashboard'
      },
      {
        title: 'Alarmas',
        description: 'Reportes de equipos y lineas',
        icon: 'alarm',
        to: '/alarmas'
      },
      {
        title: 'Calendario',
        description: 'Calendario de eficiencia por turno',
        icon: 'date_range',
        to: '/calendario'
      },
      {
        title: 'Reportes',
        description: 'Reportes de fallas',
        icon: 'assignment',
        to: '/reportes'
      },
      {
        title: 'Declarar alarmas',
        description: 'Declarar alarmas',
        icon: 'check_box',
        to: '/declarar_alarmas'
      },
      {
        title: 'Cip',
        description: 'Detalle de cip',
        icon: 'bubble_chart',
        to: '/cip'
      },
       {
        title: 'Monitoreo',
        description: 'Detalle de cip',
        icon: 'tv',
        to: '/monitoreo'
      }
    ],
    items: [
      {
        title: 'Gestion de equipos',
        to: '/equipos',
        icon: 'desktop_mac'
      },
      {
        title: 'Alarmas silenciadas',
        to: '/alarmas/silenciadas',
        icon: 'alarm_off'
      },
      {
        title: 'Causas de fallas',
        to: '/causas_fallas',
        icon: 'assignment_turned_in'
      }
    ]
  }),

  computed: {
    ...mapGetters([
      'modalEditarConfiguracionMinTiempoAlarma',
      'auth',
      'modalCambiarPassword'
    ])
  },

  methods: {
    ...mapMutations([
      'MODAL_CHANGE_PASSWORD_USUARIO',
      'SET_MODAL_EDITAR_CONFIGURACION_MIN_TIEMPO_ALARMA',
      'SET_MODAL_CAMBIAR_PASSWORD'
    ]),
    ...mapActions(['logoutAccount', 'logoutAccount']),
    handleFullScreen() {
      let doc = window.document
      let docEl = doc.documentElement
      let requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen
      let cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen
      if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
      ) {
        requestFullScreen.call(docEl)
      } else {
        cancelFullScreen.call(doc)
      }
    },
    goHome() {
      this.$router.push({ path: '/dashboard' })
    },
    goToPage(url) {
      this.$router.push({ path: url })
    },
    getActiveClass(url) {
      if (this.$route.path === url) {
        return 'v-btn--active'
      } else {
        return ''
      }
    },
    goToUserAdmin() {
      this.$router.push({ path: '/users' })
    },
    cambiarPassword() {
      this.SET_MODAL_CAMBIAR_PASSWORD(true)
    },
    cambiarMinimoTimepoReconocimientoAlarma() {
      this.SET_MODAL_EDITAR_CONFIGURACION_MIN_TIEMPO_ALARMA(true)
    },
    exitToApp() {
      this.logoutAccount()
    }
  }
}
</script>
