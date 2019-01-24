export default{
  formatDate (date, format) {
    if (/(y+)/.test(format)) {                        // 正则表达式，匹配以y开头1个或多个字符串
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))              // 之前匹配成功的第一个值
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let key in o) {
      if (new RegExp(`(${key})`).test(format)) {
        let str = o[key] + ''
        format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : parseInt(str) > 10 ? str : '0' + str)
      }
    }
    return format
  }
}
