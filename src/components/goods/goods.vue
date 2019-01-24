<template>
	<div id="goods">
		<div class="goods">
			<div class="menu-wrapper" ref="menuWrapper">     <!-- v-ref、v-el 弃用 统一使用ref属性为元素或组件添加标记，然后通过this.$refs获取  获取dom -->
				<ul>
					<li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current' : currentIndex === index}" @click="selectMenu(index,$event)">
						<span class="text border-One">
							<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span><span v-text="item.name"></span>
						</span>
					</li>
				</ul>
			</div>
			<div class="foods-wrapper" ref="foodsWrapper">
				<ul>
					<li v-for="(item,index) in goods" :key="index" class="food-list food-list-js">
						<h1 v-text="item.name" class="title"></h1>
						<ul>
							<li v-for="(food,foodIndex) in item.foods" :key="foodIndex" class="food-item border-One"  @click="selectFood(food,$event)">
								<div class="icon">
									<img width="57" height="57" :src="food.icon" alt="icon">
								</div>
								<div class="content">
									<h1 v-text="food.name" class="name"></h1>
									<p v-text="food.description" class="desc"></p>
									<div class="extra">
										<span class="count" v-text=" '月售' + food.sellCount + '份' "></span><span v-show="food.rating" v-text=" '好评率' + food.rating + '%' "></span><span class="rating" v-show="!food.rating">暂无评价</span>
										<div class="price">
											<span class="now" v-text=" '￥' + food.price "></span><span class="old" v-show="food.oldPrice" v-text=" '￥' + food.oldPrice "></span>
										</div>
										<div class="cartcontrol-wrapper">
											<cartcontrol :food="food"></cartcontrol>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>  <!-- 子组件和父组件的链接。通过ref="XXX" 访问到对应的子组件 -->
		</div>
		<food :food="selectedFood" ref="food"></food>
	</div>
</template>
<script>

import axios from 'axios'
import BScroll from 'better-scroll'           // new BScroll()需要传两个参数，DOM对象 and Option
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'
import { baseUrl } from '@/module/axios/baseUrl'

const ERR_OK = 0

export default {
  data () {
    return {
      goods: [],
      classMap: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count > 0) {          // 找到所有的选中的food
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  methods: {
    selectMenu (index, event) {
      if (!event._constructed) {             // BScroll触发的点击事件里event才有这个_constructed属性是bool值。原生js的event事件中没有
        return                               // pc端监听到了BScroll触发的点击事件，然后直接return
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-js')
      this.foodsScroll.scrollToElement(foodList[index], 500)                   // BScroll组件的一个方法scrollToElement(el,ms) 参数为dom对象，和运动毫秒数
    },
    selectFood (food, event) {
      if (!event._constructed) {             // BScroll触发的点击事件里event才有这个_constructed属性是bool值。原生js的event事件中没有
        return                               // pc端监听到了BScroll触发的点击事件，然后直接return
      }
      this.selectedFood = food
      this.$refs.food.show()
    },
    initScroll () {           //  初始化滑动区域
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {                   // 此处使用this.$refs.menuWrapper获取dom元素。ref的值必须和$refs.XXX对应
        click: true                   //  传递click: true，作用是允许该处添加点击事件，否则默认事件无效         移动端发送一次点击，网页端效果点击了两次
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3                  //  传递probeType: 3，作用是能够实时监听到滚动的值
      })
      this.foodsScroll.on('scroll', (pos) => {             // 监听scroll事件，并且返回pos(位置)
        this.scrollY = Math.abs(Math.round(pos.y))         // 取整数，取绝对值
      })
    },
    computeHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-js')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        height += foodList[i].clientHeight                  // 每一个li的高度
        this.listHeight.push(height)
      }
    },
    drop (target) {
      // this.$nextTick(() => {                            // 异步执行drop动画，优化体验   (报错，找不到this.$refs.shopcart)
      //   this.$refs.shopcart.drop(target)                     // 父组件和子组件的通信。通过this.$refs.XXX访问到对应的子组件，并且调用子组件里面的drop方法
      // })
      this.$refs.shopcart.drop(target)
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    let self = this
    axios.get(baseUrl + '/apis/goods', {}).then(function (res) {
      if (res.data.errno === ERR_OK) {
        self.goods = res.data.data                                 // vue给seller的每一个属性都添加了get，set方法，用于监控其变化
        self.$nextTick(function () {
          this.initScroll()
          this.computeHeight()
        })
      }
    })
    // this.$router.push('/goods')                  // 此处手动跳转。。有一个vue-router的重定向 router.redirect({'/':'/goods'})

    this.$root.eventHub.$on('cart.add', (target) => {
      this.drop(target)
    })
  },
  // mounted () {                  // vue2.0 生命周期。mounted -> DOM渲染过程
  //   this.initScroll()
  // },
  updated () {                  // vue2.0 生命周期。updated -> DOM渲染完成
    // this.computeHeight(foodList)     // 使用upated 此处有坑，函数会无限循环
    // this.initScroll()            // 此处由于BScroll组件是操作了DOM。需要使用Vue.$nextTick(function(){})  在dom加载完成后的回调函数  vue2.0失效
  }
}
</script>
<style lang="less" scoped>
	@import '../../common/less/mixin';
	.goods{
		display:flex;
		position:absolute;
		top:174px;                 /* header和nav模块高度相加 */
		bottom:46px;               /* 购物车模块的高度 */
		width:100%;
		overflow: hidden;
		.menu-wrapper{
			flex:0 0 80px;         /* 参数,flex-grow 相对扩展量,flex-shrink 相对收缩量,flex-basis 具体值(px,rem,%...) */
			width:80px;
			background: #f3f5f7;
			.menu-item{
				display: table;           /* 小技巧，利用display:table-cell让文字垂直居中（无论元素多少行） */
				height:54px;
				width:56px;
				line-height: 14px;
				padding:0 12px;
				&.current{
					position:relative;
					z-index:10;
					margin-top:-1px;
					background: #fff;
					font-weight: 700;
					.text{
						.border-none;
					}
				}
				&:last-child{
					.text{
						.border-none;
					}
				}
				.icon{
					display:inline-block;
					width:12px;
					height:12px;
					margin-right:2px;
					background-size: 12px 12px;
					background-repeat: no-repeat;
					vertical-align: top;
					&.decrease{
						.bg-image('../../components/goods/decrease_3');
					};
					&.discount{
						.bg-image('../../components/goods/discount_3');
					};
					&.guarantee{
						.bg-image('../../components/goods/guarantee_3');
					};
					&.invoice{
						.bg-image('../../components/goods/invoice_3');
					};
					&.special{
						.bg-image('../../components/goods/special_3');
					};
				}
				.text{
					display:table-cell;
					width:56px;
					vertical-align: middle;
					.border-one(rgba(7,17,27,0.1));
					font-size: 12px;
				}
			}
		}
		.foods-wrapper{
			flex:1;
			.title{
				padding-left: 14px;
				height:26px;
				line-height: 26px;
				border-left: 2px solid #d9dde1;
				font-size: 12px;
				color:rgb(147,153,159);
				background:#f3f5f7;
			}
			.food-item{
				display:flex;
				margin:18px;                                  /* 此处上下margin有一个重叠效果 */
				padding-bottom:18px;
				.border-one(rgba(7,17,27,0.1));
				&:last-child{
					.border-none;
					margin-bottom:0;
				}
				.icon{
					flex: 0 0 57px;
					margin-right:10px;
				}
				.content{
					flex:1;
					.name{
						margin: 2px 0 8px 0;
						height:14px;
						line-height: 14px;
						font-size:14px;
						color:rgb(7,17,27);
					}
					.desc,.extra{
						line-height: 10px;
						font-size: 10px;
						color:rgb(147,153,159);
					}
					.desc{
						margin-bottom:8px;
						line-height: 14px;
					}
					.extra{
						.count{
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
						right:0;
						bottom:12px;

					}
				}
			}
		}
	}
</style>
