<template>
  <div id="app">
    <v-header :seller='seller'></v-header>
    <div class="tab border-One">                 <!-- :key="index"，vue2.2以上要求v-for跟key一起使用，确保每一项都是独一无二的 -->
      <router-link  v-for="(item,index) in nav" :key="index" class="tab-item" tag="div" :to="item.path"><a v-text="item.name"></a></router-link>  <!-- :to="{path:item.path,query: {name: item.id}}" 传参 -->
    </div>
    <keep-alive>              <!-- 保留组件之前的状态 -->
      <router-view :seller="seller"></router-view>     
    </keep-alive>
  </div>
</template>

<script>

import header from './components/header/header'    // 不能使用html标签作为组件的标签
import axios from 'axios'
import {urlParse} from './common/js/util'         // import {fn1, fn2} from 'XXX'  ->  export多次
import { baseUrl } from '@/module/axios/baseUrl'

const ERR_OK = 0

export default {
  name: 'app',
  data () {
    return {
      nav: [{'name': '商品', 'path': '/goods'}, {'name': '评论', 'path': '/ratings'}, {'name': '商家', 'path': '/seller'}],
      seller: {
        id: (() => {                   // 立即执行函数
          let queryParam = urlParse()
          return queryParam.id
        })()
      }
    }
  },
  created () {
    let self = this
    axios.get(baseUrl + '/apis/seller?id=' + this.seller.id, {}).then(function (res) {
      if (res.data.errno === ERR_OK) {
        self.seller = Object.assign({}, self.seller, res.data.data)   // 使用assign方法，这样就会是只给this.seller插入对应的键值，而不会全部替换。我们在data里面给seller定义的id属性值就不怕被替换掉了。类似数组的push
        // self.seller = res.data.data                                 // vue给seller的每一个属性都添加了get，set方法，用于监控其变化
      }
    })
  },
  components: {
    'v-header': header
  }
}
</script>

<style lang="less" scoped>  /* 使用less语法需要加lang='less' 每一行后面必须加;代表结束 */
  @import './common/less/mixin';
  /* 移动端flex布局。尽量不适用float,用inline-block */
  #app{
    .tab{
      display: flex;
      width:100%;
      height:40px;
      line-height: 40px;
      .border-one(rgba(7,17,27,0.1));         /* .border-1px会报undefined,也许是不支持数字 */
      .tab-item{
        flex:1;
        text-align:center;
        a{
          display:block;
          font-size:14px;
          color:rgb(77,85,93);
        }
        &.active a{
          color:rgb(240,20,20);
        }
      }
    }
  }
</style>
