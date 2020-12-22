<template>
  <span>
    {{ dateTime }}
  </span>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      dateTime: moment().add(-3, 'hours').format('HH:mm')
    }
  },
  created() {
    let _this = this
    setInterval(function() {
      _this.dateTime = moment().add(-3, 'hours').format('HH:mm')
    }, 1000)
  }
}
</script>

<style>
</style>
