import axios from 'axios'
import config from './base'
export default {
  post: function (url, params, callback) {
    // var instance = axios.create(config.serviceConfig)
    axios.post(url, params, config.serviceConfig).then(callback).catch(function (data) {
      alert('请求失败，请检查' + data)
    })
  }
}
