export default {
  methods: {
    alertSuccess() {
      this.$snotify.success('El proceso se genero sin errores', 'Correcto!', {
        timeout: 2000
      })
    },
    alertError(_error) {
      this.$snotify.error(
        'Hubo errores durante el proceso: ' + _error,
        'Error!',
        {
          timeout: 2000
        }
      )
    }
  }
}
