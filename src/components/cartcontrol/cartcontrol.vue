<template>
	<div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCount">
      </div>
    </transition>
    <div class="cart-count" @click.stop.prevent="" v-show="food.count>0" v-text="food.count"></div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCount"></div>
	</div>
</template>
<script>
  import Vue from 'vue'
  export default {
    data () {
      return {
      }
    },
    methods: {
      addCount (event) {
        if (!event._constructed) {             // BScroll触发的点击事件里event才有这个_constructed属性是bool值。原生js的event事件中没有
          return                               // pc端监听到了BScroll触发的点击事件，然后直接return
        }
        if (!this.food.count) {
          // this.food.count = 1               // 直接添加一个之前不存在的属性，vue无法实时更新，因为没给其遍历设置set，get方法
          Vue.set(this.food, 'count', 1)       // 使用Vue.set()  参数，对象，要添加的属性，值
        } else {
          this.food.count ++
        }
        this.$root.eventHub.$emit('cart.add', event.target)
      },
      decreaseCount (event) {
        if (!event._constructed) {             // BScroll触发的点击事件里event才有这个_constructed属性是bool值。原生js的event事件中没有
          return                               // pc端监听到了BScroll触发的点击事件，然后直接return
        }
        if (this.food.count) {
          this.food.count --
        }
      }
    },
    props: {
      food: {          // 该组件内容与foodCount有关，所以根据需求会从父级传food对象过来
        type: Object
      }
    },
    computed: {
    }
  }
</script>
<style lang="less" scoped>

  .move-enter-active,.move-leave-active{           /* 配合transition组件使用的css */
    transition: all 0.3s linear;
  }
  .move-enter,.move-leave-active{                   /* 配合transition组件使用的css */
    opacity: 0;
    transform: translate3D(24px,0,0) rotate(180deg);
  }

  .cartcontrol{
    font-size:0;
    .cart-decrease{
      display:inline-block;
      padding:6px;
      font-size: 24px;
      line-height: 24px;
      color:rgb(0,160,220);
    }
    .cart-count{
      display:inline-block;
      vertical-align: top;
      width:12px;
      margin-top:6px;
      line-height: 24px;
      font-size: 10px;
      text-align: center;
      color:rgb(147,153,159);
    }
    .cart-add{
      display:inline-block;
      padding:6px;
      font-size: 24px;
      line-height: 24px;
      color:rgb(0,160,220);
    }
  }
</style>
