<template>
  <v-app>
    <tool-bar/>
    <v-content class="grey lighten-2">
      <v-container fluid grid-list-md text-xs-center>
        <nuxt/>
      </v-container>
    </v-content>
    <vue-snotify/>
    <connect-web-socket/>
    <fab/>
  </v-app>
</template>

<script>
import ToolBar from '@/components/layouts/ToolBar'
import Fab from '@/components/layouts/Fab'
import ConnectWebSocket from '@/components/common/ConnectWebSocket'
export default {
  components: {
    ToolBar,
    Fab,
    ConnectWebSocket
  },
  data() {
    return {}
  }
}
</script>
