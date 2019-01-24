// APP应用的全局配置
// 请求配置
// 这些是用于发出请求的可用配置选项。 只有url是必需的。 如果未指定方法，请求将默认为GET。
export default {
  serviceConfig: {
    url: '/', // `url`是将用于请求的服务器URL   在请求的时候，如axios.get(url,config);这里的url会覆盖config中的url
    method: 'post', // `method`是发出请求时使用的请求方法
    baseURL: 'http://47.104.174.167:3010', // `baseURL`将被添加到`url`前面，除非`url`是绝对的。
    // transformRequest: [function (data) {  // 这里可以在发送请求之前对请求数据做处理 // `transformRequest`允许在请求数据发送到服务器之前对其进行更改
    //  var serizeData = Qs.stringify(data)  // 这只适用于请求方法'PUT'，'POST'和'PATCH'
    //  return serizeData                    // 数组中的最后一个函数必须返回一个字符串，一个 ArrayBuffer或一个 Stream
    // }],
    // transformResponse: [function (data) { // `transformResponse`允许在 then / catch之前对响应数据进行更改
    //  var objData = Qs.parse(data)
    //  return objData
    // }],
    headers: { 'X-Requested-With': 'XMLHttpRequest' },  // `headers`是要发送的自定义 headers
    params: {},  // `params`是要与请求一起发送的URL参数  // 必须是纯对象或URLSearchParams对象
    // paramsSerializer: function(params) {  // `paramsSerializer`是一个可选的函数，负责序列化`params`
    // return Qs.stringify(params, {arrayFormat: 'brackets'})
    // },
    data: {}, // `data`是要作为请求主体发送的数据 // 仅适用于请求方法“PUT”，“POST”和“PATCH”
    timeout: 10000,  // `timeout`指定请求超时之前的毫秒数。 // 如果请求的时间超过'timeout'，请求将被中止。
    withCredentials: true, // `withCredentials`指示是否跨站点访问控制请求
    // adapter: function (config) { // `adapter'允许自定义处理请求，这使得测试更容易。
    // /* ... */                    // 返回一个promise并提供一个有效的响应
    // },
    // auth: {                       // `auth'表示应该使用 HTTP 基本认证，并提供凭据。
    //   username: 'lyh',            // 这将设置一个`Authorization'头，覆盖任何现有的`Authorization'自定义头，使用`headers`设置。
    //   password: '123456'
    // },
    responseType: 'json', // default   // “responseType”表示服务器将响应的数据类型    // 包括 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    xsrfCookieName: 'XSRF-TOKEN', // default   //`xsrfCookieName`是要用作 xsrf 令牌的值的cookie的名称
    xsrfHeaderName: 'X-XSRF-TOKEN', // default   // `xsrfHeaderName`是携带xsrf令牌值的http头的名称
    onUploadProgress: function (progressEvent) {   // `onUploadProgress`允许处理上传的进度事件
      // 使用本地 progress 事件做任何你想要做的
    },
    onDownloadProgress: function (progressEvent) {    // `onDownloadProgress`允许处理下载的进度事件
      // Do whatever you want with the native progress event
    },
    maxContentLength: 2000,  // `maxContentLength`定义允许的http响应内容的最大大小
    validateStatus: function (status) {   // `validateStatus`定义是否解析或拒绝给定的promise
      return status >= 200 && status < 300 // default
    },
    maxRedirects: 5, // 默认  // `maxRedirects`定义在node.js中要遵循的重定向的最大数量。  // 如果设置为0，则不会遵循重定向。
    // httpAgent: new http.Agent({ keepAlive: true }),   // `httpAgent`和`httpsAgent`用于定义在node.js中分别执行http和https请求时使用的自定义代理。
    // httpsAgent: new https.Agent({ keepAlive: true }),  // 允许配置类似`keepAlive`的选项，  // 默认情况下不启用。
    proxy: {
      host: '127.0.0.1',
      port: 9000,
      auth: {
        username: 'lyh',
        password: '123456'
      }
    }
  }
}
