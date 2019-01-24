<template>
	<div class="ratingSelect">
		<div class="ratingType border-One">
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count" v-text="ratings.length"></span></span>  
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count" v-text="positives.length"></span></span>  
      <span @click="select(1,$event)" class="block nagetive" :class="{'active':selectType===1}">{{desc.nagetive}}<span class="count" v-text="nagetives.length"></span></span>  
    </div>
    <div @click="toggleContent" class="switch" :class="{'on': onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
	</div>
</template>
<script>
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2

  export default {
    data () {
      return {
        myOnlyContent: this.onlyContent,            // ① 创建props属性onlyContent的副本--myOnlyContent
        mySelectType: this.selectType
      }
    },
    methods: {
      select (type, event) {
        if (!event._constructed) {
          return
        }
        this.mySelectType = type
        // this.$root.eventHub.$emit('ratingType.select', type)        //由于selectType是固定值，所以要让父元素知道它改变要通过 广播事件让父组件监听。。。要让子组件数据变化的同时父组件数据也跟着变化，除了广播以外，可以是父组件传给子组件一个对象。通过直接更改对象的属性来实现。其原理是因为js的对象是引用类型                     该处替换成双向数据绑定形式
      },
      toggleContent (event) {
        if (!event._constructed) {
          return
        }
        this.myOnlyContent = !this.myOnlyContent
      }
    },
    props: {
      ratings: {
        type: Array,
        default () {
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            nagetive: '不满意'
          }
        }
      }
    },
    watch: {
      onlyContent (val) {                   // vue2.0 双向数据绑定
        this.myOnlyContent = val // ② 监听外部对props属性onlyContent的变更，并同步到组件内的data属性myOnlyContent中
      },
      myOnlyContent (val) {
        this.$emit('on-onlyContent-change', val) // ③ 组件内对myOnlyContent变更后向外部发送事件通知   下一步在父组件中
      },
      selectType (val) {                   // vue2.0 双向数据绑定
        this.mySelectType = val // ② 监听外部对props属性mySelectType的变更，并同步到组件内的data属性mmySelectType中
      },
      mySelectType (val) {
        this.$emit('on-selectType-change', val) // ③ 组件内对mySelectType变更后向外部发送事件通知   下一步在父组件中
      }
    },
    computed: {
      positives () {
        return this.ratings.filter((rating) => {       // 数组的过滤
          return rating.rateType === POSITIVE
        })
      },
      nagetives () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    }
  }
</script>
<style lang="less" scoped>
	@import '../../common/less/mixin';
    .ratingSelect{
    	.ratingType{
        padding: 18px 0;
        margin: 0 18px;
        .border-one(rgba(7,17,27,0.1));
        font-size: 0;
        .block{
          display:inline-block;
          padding:8px 12px;
          margin-right: 8px;
          border-radius:2px;
          font-size: 12px;
          color:rgb(77,85,93);
          &.active{
            color:#fff;
          }
          &.positive{
            background:rgba(0,160,220,0.2);
            &.active{
              background:rgb(0,160,220);
            }
          }
          &.nagetive{
            background:rgba(77,85,93,0.2);
            &.active{
              background:rgb(77,85,93);
            }
          }
          .count{
            font-size: 8px;
            margin-left: 2px;
            line-height: 16px;
          }
        }
      }
      .switch{
        padding:12px 18px;
        line-height: 24px;
        border-bottom: 1px solid rgba(7,17,27,0.1);
        color:rgb(147,153,159);
        font-size: 0;
        &.on{
          .icon-check_circle{
            color: #00c850;
          }
        }
        .icon-check_circle{
          display:inline-block;
          margin-right: 4px;
          font-size: 24px;
        }
        .text{
          display:inline-block;
          vertical-align: top;
          font-size: 12px;
        }
      }
    }
</style>
