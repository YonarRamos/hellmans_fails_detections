import Ws from '@adonisjs/websocket-client'
import Vue from 'vue'

const ws = Ws()

Vue.prototype.$ws = ws
