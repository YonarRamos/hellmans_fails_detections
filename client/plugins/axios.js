import axios from 'axios'
import Cookie from 'js-cookie'

export default axios.create({
  baseURL: '/api/v1/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + Cookie.get('accessToken')
  }
})
