// 利用express启动一个小型server
var express = require('express')
var config = require('./config/index')

var port = process.env.PORT || config.build.port            // process.env  当前环境变量

var app = express()                 // 启动服务
var router = express.Router()       // 设置路由
router.get('/', function (req, res, next) {     // 跳转到根目录的回调函数
  req.url = '/index.html'                       // 请求指向index.html
  next()                                        // 然后执行此函数
})
app.use(router)

// mock数据
var appData = require('./mock/data.json')//引入文件
var seller = appData.seller//json数据模块
var goods = appData.goods//数据模块
var ratings = appData.ratings//数据模块
var apiRouters = express.Router()//定义router
apiRouters.get('/seller',function (req, res) {
  res.json({
     errno: 0, //返回值为json格式，效验码编程时方便判断返回状态
     data: seller
  });
})
apiRouters.get('/goods',function (req, res) {
  res.json({
    errno: 0,
    data: goods
  })
})
apiRouters.get('/ratings',function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  })
})
app.use('/apis', apiRouters)//域名下的访问路径

app.use(express.static('./dist'))                   //  指向dist文件夹    定义static目录

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
})