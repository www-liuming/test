<template>
  <div id="shopcart">
  	<div class="shopcart">
  		<div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight' : totalCount>0}">               <!-- 当选中的数量大于1，才加highlight  class -->
              <span class="icon-shopping_cart"></span>
            </div>
            <div class="num" v-show="totalCount>0" v-text="totalCount"></div>
          </div>
          <div class="price" :class="{'highlight' : totalPrice>0}" v-text=" '￥' + totalPrice "></div>
          <div class="desc" v-text=" '另需配送费￥' + deliveryPrice + '元' "></div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">                           <!-- 停止冒泡&阻止默认事件 -->
          <div class="pay" :class="payClass" v-text="payDesc"></div>               <!-- 定义一个计算属性的变量为class -->
        </div>  
      </div>
      <div class="ball-container">
        <transition v-for="(ball,index) in balls" :key="index" name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div class="ball drop-transition" v-show="ball.show">
            <div class="inner"></div>
          </div>
        </transition>
      </div>
      <transition name="fold">
        <div class="shopcart-list fold-transition" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food border-One" v-for="(food,index) in selectFoods" :key="index">
                <span class="name" v-text="food.name"></span>
                <div class="price">
                  <span v-text=" '￥' + food.price*food.count"></span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
  	</div>
    <transition name="fade" tag='div'>
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>
<script>
  import cartcontrol from '../cartcontrol/cartcontrol'
  import BScroll from 'better-scroll'                                 // 因为+，-按钮跟Bscroll相关联。所以此处也要引用BScroll

  export default {
    data () {
      return {
        balls: [{'show': false}, {'show': false}, {'show': false}, {'show': false}, {'show': false}],
        dropBalls: [],
        fold: false                           // 折叠，默认为false
      }
    },
    components: {
      cartcontrol
    },
    methods: {
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {      // 从balls里面取一个show为false的球，并给其设置一些对象
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true                       // 根据这个触发动画缓动效果
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeEnter (el) {                                                                // 通过钩子写样式，那么过渡元素就不需要为其添加vue的过渡css类名了，只需在元素本身添加transition即可
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {              // 要运动的小球
            let rect = ball.el.getBoundingClientRect()      // 获取该元素相对于视口的位置
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)      // 获取小球运动的，x，y值
            el.style.display = ''
            el.style.webkitTransform = `translate3D(0, ${y}px, 0)`
            el.style.transform = `translate3D(0, ${y}px, 0)`
            let inner = el.getElementsByClassName('inner')[0]
            inner.style.webkitTransform = `translate3D(${x}px,0, 0)`
            inner.style.transform = `translate3D(${x}px,0, 0)`
          }
        }
      },
      enter (el) {
        /* eslint-disable no-unused-vars */             // 因为下一行的变量不会使用，加一行eslint-disabled
        let rf = el.offsetHeight
        this.$nextTick(() => {                            // 样式重置
          el.style.webkitTransform = 'translate3D(0, 0, 0)'
          el.style.transform = 'translate3D(0, 0, 0)'
          let inner = el.getElementsByClassName('inner')[0]
          inner.style.webkitTransform = `translate3D(0, 0, 0)`
          inner.style.transform = `translate3D(0, 0, 0)`
        })
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      toggleList () {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      empty () {
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
      },
      hideList () {
        this.fold = true
      },
      pay () {
        if (this.totalPrice < this.minPrice) {
          return
        }
        alert('支付' + this.totalPrice + '元')
      }
    },
    props: {
      selectFoods: {
        type: Array,                          /* 如果type是Array或者Object。default需要是一个函数，return对应的值 */
        default () {
          return [{'price': 10, 'count': 2}]
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    computed: {
      totalPrice () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount () {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          return `还差${this.minPrice - this.totalPrice}元起送`
        } else {
          return '去结算'
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      listShow () {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {                                        // 因为listShow是不断变化的，为防止多次初始化BScroll；加此判断
              this.scroll = new BScroll(this.$refs.listContent, {      // 初始化BScroll
                click: true
              })
            } else {
              this.scroll.refresh()                      // 刷新
            }
          })
        }
        return show
      }
    }
  }
</script>
<style lang="less" scoped>
	@import '../../common/less/mixin';
  
  .shopcart{
    position:fixed;                   /* 固定在底部；position:fixed; */
    left:0;
    bottom:0;
    z-index:999;
    width:100%;
    height:48px;
    .content{
      display:flex;
      background: #141d27;
      color: rgba(255,255,255,0.4);
      font-size: 0;                   /* inline-block的间隙问题 */
      .content-left{
        flex:1;
        .logo-wrapper{
          display:inline-block;
          position:relative;
          top:-10px;
          margin:0 12px;
          padding:6px;
          width:56px;
          height:56px;
          box-sizing: border-box;            /* 移动端流行的布局，盒模型 */
          vertical-align: top;
          border-radius: 50%;
          background: #141d27;
          .logo{
            width:100%;
            height:100%;
            border-radius: 50%;
            background:#2b343c;
            text-align: center;
            &.highlight{
              background: rgb(0,160,220);
              .icon-shopping_cart{
                color:#fff;
              }
            }
            .icon-shopping_cart{
              font-size: 24px;
              line-height: 44px;
              color:#80858a;
            }
          }
          .num{
            position:absolute;
            top:0;
            right:0;
            width:24px;
            height:16px;
            line-height: 16px;
            text-align: center;
            border-radius: 16px;
            font-size: 9px;
            font-weight: 700;
            color:#fff;
            background: rgb(240,20,20);
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
          }
        }
        .price{
          display:inline-block;
          vertical-align: top;
          margin-top: 12px;
          padding-right:12px;
          line-height:24px;                                 /* 此处垂直居中没有使用line-height:48px;  而是line-height:24px;margin-top:12px; 是因为它有一个右border */
          box-sizing: border-box;
          border-right:1px solid rgba(255,255,255,0.1);
          font-size: 16px;
          font-weight: 700;
          &.highlight{
            color:#fff;
          }
        }
        .desc{
          display:inline-block;
          vertical-align: top;
          margin:12px 0 0 12px;
          line-height:24px; 
          font-size: 10px;
        }
      }
      .content-right{
        flex:0 0 105px;
        width:105px;
        .pay{
          height:48px;
          line-height:48px;
          text-align: center;
          font-size:12px;
          font-weight: 700;
          &.not-enough{
            background: #2b333b;
          }
          &.enough{
            background: #00b43c;
            color:#fff;
          }
        }
      }
    }
    .ball-container{
      .ball{
        position:fixed;
        left:32px;
        bottom:22px;
        z-index:200;
        &.drop-transition{
          transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);                   /* cubic-bezier曲线路径 */
          .inner{
            width:16px;
            height:16px;
            border-radius: 50%;
            background:rgb(0,160,220);
            transition:all 0.4s linear;
          }
        }
      }
    }
    .shopcart-list{
      position:absolute;
      top:0;
      left:0;
      z-index:-1;
      width:100%;
      &.fold-transition{
        transition:all 0.3s linear;
        transform:translate3d(0,-100%,0);
      }
      &.fold-enter,&.fold-leave-active{
        transform:translate3d(0,0,0);
      }
      .list-header{
        height:40px;
        line-height:40px;
        padding:0 18px;
        background:#f3f5f7;
        border-bottom:1px solid rgba(7,17,27,0.1);
        .title{
          float:left;
          font-size: 14px;
          color:rgb(7,17,27);
        }
        .empty{
          float:right;
          font-size: 12px;
          color:rgb(0,160,220);
        }
      }
      .list-content{
        padding:0 18px;
        max-height: 217px;
        background:#fff;
        overflow:hidden;
        .food{
          position:relative;
          box-sizing: border-box;
          padding:12px 0;
          .border-one(rgba(7,17,27,0.1));
          .name{
            line-height: 24px;
            font-size: 14px;
            color:rgb(7,17,27);
          }
          .price{
            position:absolute;
            right:90px;
            bottom:12px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 700;
            color:rgb(240,20,20);
          }
          .cartcontrol-wrapper{
            position:absolute;
            bottom:6px;
            right:0;
          }
        }
      }
    }
  }
  .list-mask{
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index:40;
    backdrop-filter:blur(10px);
    background:rgba(7,17,27,0.6);
    &.fade-enter-active,&.fade-leave-active{
      transition: all 0.3s;
    }
    &.fade-enter,&.fade-leave-active{
      opacity:0;
      background:rgba(7,17,27,0);
    }
  }
</style>
