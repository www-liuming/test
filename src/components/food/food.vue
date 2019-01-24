<template>
  <transition name="moveFromLeft">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title" v-text="food.name"></h1>
          <div class="detail">
            <span class="sell-count" v-text=" '月售' + food.sellCount + '份' "></span>
            <span class="rating" v-show="food.rating" v-text=" '好评率' + food.rating + '%' "></span>
            <span class="rating" v-show="!food.rating">暂无评价</span>
          </div>
          <div class="price">
            <span class="now" v-text=" '￥' + food.price "></span><span class="old" v-show="food.oldPrice" v-text=" '￥' + food.oldPrice "></span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text" v-text="food.info"></p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingSelect @on-selectType-change="onSelectTypeChange" @on-onlyContent-change="onOnlyContentChange" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingSelect>   <!-- 配合双向数据绑定。props -->
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li class="rating-item border-One" v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" :key="index">            <!-- v-show绑定函数，返回值 -->
                <div class="user">
                  {{rating.username}}<span class="name"></span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar" />
                </div>
                <div class="time">{{rating.rateTime | formatTime}}</div>                <!-- vue2.0里面filter | 不支持在v-text里面必须使用{{}} -->
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}" v-text="rating.text"></span>
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol'
  import split from '../split/split'
  import ratingSelect from '../ratingSelect/ratingSelect'
  import fn from '../../common/js/date.js'

  // const POSITIVE = 0
  // const NEGATIVE = 1
  const ALL = 2

  export default {
    data () {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          nagetive: '吐槽'
        }
      }
    },
    methods: {
      show () {                               // 给父组件调用
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = true           // 始终初始化这两个值
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide () {
        this.showFlag = false
      },
      addFirst (event) {
        if (!event._constructed) {
          return
        }
        this.$root.eventHub.$emit('cart.add', event.target)       // 此处调用小球动画在1.0中有bug。event.target突然隐藏造成小球动画开始的位置不正确，解决办法，给按钮的隐藏加一个动画
        Vue.set(this.food, 'count', 1)                 // 有可能food初始没有count属性。用Vue.set()
      },
      onOnlyContentChange (val) {
        this.onlyContent = val // ④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        this.$nextTick(() => {
          this.scroll.refresh()      // 因为li显示隐藏，会造成BScroll计算高度出问题，所以需要重置。涉及的BScroll的地方都要使用this.$nextTick()
        })
      },
      onSelectTypeChange (val) {
        this.selectType = val // ④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        this.$nextTick(() => {
          this.scroll.refresh()     // 因为li显示隐藏，会造成BScroll计算高度出问题，所以需要重置。涉及的BScroll的地方都要使用this.$nextTick()
        })
      },
      needShow (type, text) {
        if (this.onlyContent && !text) {      // 首先判断  要显示内容 却没有内容，就为空
          return false
        }
        if (this.selectType === ALL) {        // 判断 显示类型是否是全部，是的话就显示
          return true
        } else {
          return type === this.selectType      // 判断 显示类型是否是要显示的类型
        }
      }
    },
    props: {
      food: {
        type: Object
      }
    },
    components: {
      cartcontrol,
      split,
      ratingSelect
    },
    filters: {
      formatTime (time) {
        let date = new Date(time)
        return fn.formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    computed: {
    }
  }
</script>
<style lang="less" scoped>
	@import '../../common/less/index';
  .food{
    position:fixed;
    top:0;
    left:0;
    bottom:48px;
    z-index:30;
    width:100%;
    background: #fff;
    &.moveFromLeft-enter-active,&.moveFromLeft-leave-active{
      transition:all 0.4s;
    }
    &.moveFromLeft-enter,&.moveFromLeft-leave-active{
      transform:translate3d(100%,0,0);
      opacity:0;
    }
    .image-header{
      position:relative;
      width:100%;
      height:0;
      padding-top:100%;                          /* 黑科技，，给padding-XX设置100%的时候，此时的值是按照元素width的值计算的。这里得到了一个宽高相等的盒子 */
      img{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
      }
      .back{
        position:absolute;
        top:10px;
        left:0;
        .icon-arrow_lift{
          display:block;
          padding:10px;                        /* 由于设计需要按钮的样式只有固定大小，为了点击方便，一般会给它加上padding，扩大点击范围 */
          font-size:20px;
          color:#fff;
        }
      }
    }
    .content{
      position:relative;
      padding:18px;
      .title{
        line-height:14px;
        margin-bottom:8px;
        font-size:14px;
        font-weight:700;
        color: @fontColorGray;
      }
      .detail{
        margin-bottom:18px;
        line-height:10px;
        height:10px;
        font-size: 0;
        .sell-count,.rating{
          font-size: 10px;
          color:rgb(147,153,159);
        }
        .sell-count{
          margin-right:12px;
        }
      }
      .price{
        font-weight: 700;
        line-height: 24px;
        .now{
          margin-right: 8px;
          font-size: 14px;
          color:rgb(240,20,20);
        }
        .old{
          text-decoration: line-through;     /* line划线 */
          font-size: 10px;
          color:rgb(147,153,159);
        }
      }
      .cartcontrol-wrapper{
        position:absolute;
        right:12px;
        bottom:12px;
      }
      .buy{
        position:absolute;
        right:18px;
        bottom:18px;
        z-index:10;
        height:24px;
        line-height: 24px;
        padding:0 12px;
        box-sizing: border-box;
        border-radius:12px;
        font-size: 10px;
        color:#fff;
        background:rgb(0,160,220);
        &.fade-enter-active,&.fade-leave-active{
          opacity:1;
          transition:all 0.2s;
        }
        &.fade-enter,&.fade-leave-active{
          opacity:0;
        }
      }
    }
    .info{
      padding:18px;
      .title{
        line-height: 14px;
        margin-bottom: 6px;
        font-size:14px;
        color:@fontColorGray;
      }
      .text{
        line-height: 24px;
        padding:0 8px;
        font-size: 12px;
        color:rgb(77,85,93);
      }
    }
    .rating{
      padding-top: 18px;
      .title{
        line-height: 14px;
        margin-left: 18px;
        font-size:14px;
        color:@fontColorGray;
      }
      .rating-wrapper{
        padding:0 18px;
        .rating-item{
          position:relative;
          padding:16px 0;
          .border-one(rgba(7,17,27,0.1));
          .user{
            position: absolute;
            right:0;
            top:16px;
            line-height: 12px;
            .name{
              display:inline-block;
              vertical-align: top;
              margin-right:6px;
              font-size: 10px;
              color:rgb(147,153,159);
            }
            .avatar{
              border-radius: 50%;
            }
          }
          .time{
            margin-bottom: 6px;
            font-size: 10px;
            line-height: 12px;
            color:rgb(147,153,159);
          }
          .text{
            line-height: 16px;
            font-size: 12px;
            color:@fontColorGray;
            .icon-thumb_up,.icon-thumb_down{
              margin-right: 4px;
              line-height: 16px;
              font-size: 12px;
            }
            .icon-thumb_up{
              color:rgb(0,160,220);
            }
            .icon-thumb_down{
              color:rgb(147,153,159);
            }
          }
        }
        .no-rating{
          padding:16px 0;
          font-size: 12px;
          color:rgb(147,153,159);
        }
      }
    }
  }
</style>
