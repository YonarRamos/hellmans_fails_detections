<template>
  <div>
    <tabla-equipos/>
  </div>
</template>

<style scoped>
.boton-add {
  margin-top: 10px;
}
</style>


<script>
import TablaEquipos from '@/components/public/equipo/TablaEquipos'
export default {
  middleware: 'authenticated',
  layout: 'custom',
  components: {
    TablaEquipos
  },
  data: () => ({}),
  methods: {}
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
