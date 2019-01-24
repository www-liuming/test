export function urlParse () {    //  注意export和export default的区别
  let url = window.location.search        // '?id=123&a=b'
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g   // 包含?或者&开头，之后非?或者&的字符，1个或多个，中间用=连接，之后非?或者&的字符，1个或多个，g全局匹配
  let arr = url.match(reg)         // match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。返回值是匹配结果的数组。该数组的内容依赖于 regexp 是否具有全局标志 g。
  // ['?id=123','&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=')          // 截取第一个字符，并用=裁剪成数组
      let key = decodeURIComponent(tempArr[0])         // decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}
