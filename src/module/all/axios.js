import service from '../axios/server.js'

export default {
  getSeller: function (params, callback) {   // 分页显示
    service.post('/seller', params, callback)
  },
  getGoods: function (params, callback) {   // 分页显示
    service.post('/goods', params, callback)
  },
  getRatings: function (params, callback) {   // 分页显示
    service.post('/ratings', params, callback)
  }
}
