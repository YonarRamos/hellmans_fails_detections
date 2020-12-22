import Vue from 'vue'

export function alertError(_error) {
  Vue.notify({
    group: 'app',
    type: 'error',
    title: 'Operacion fallida!',
    text: 'Error: ' + _error
  })
}
export function alertSuccess(context) {
  Vue.notify({
    group: 'app',
    type: 'success',
    title: 'Operacion exitosa!',
    text: 'La operacion se realizo correctamente!'
  })
}
