<template>
  <v-fab-transition>
    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      fab
      small
      dark
      fixed
      bottom
      right
      color="red"
      @click="toTop"
    >
      <v-icon class="mt-3">keyboard_arrow_up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  data: () => ({
    fab: false
  }),
  methods: {
    onScroll() {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || document.documentElement.offsetTop || 0
      this.fab = top > 300
    },
    toTop() {
      this.$router.push({ hash: '' })
      this.$vuetify.goTo(0)
    }
  }
}
</script>
