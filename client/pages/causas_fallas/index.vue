<template>
  <v-layout row>
    <v-flex xs12>
      <tabla-causas/>
    </v-flex>
  </v-layout>
</template>

<script>
import TablaCausas from '@/components/public/causa/TablaCausa'
export default {
  middleware: 'authenticated',
  layout: 'custom',
  components: {
    TablaCausas
  }
}
</script>
