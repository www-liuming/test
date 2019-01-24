<template>
	<div class="seller" ref="seller">                         <!-- BScroll html布局，外层div固定视口高度或宽度，内层div被内容撑出高度 -->
		<div class="seller-content">
			<div class="overview">
				<h1 class="title" v-text="seller.name"></h1>
				<div class="desc border-One">
					<star :size="36" :score="seller.score"></star>
					<span class="text" v-text=" '(' + seller.ratingCount + ')' "></span>
					<span class="text" v-text=" '月售' + seller.sellCount + '单' "></span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress" v-text="seller.minPrice"></span>元
						</div>
					</li>
					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="stress" v-text="seller.deliveryPrice"></span>元
						</div>
					</li>
					<li class="block">
						<h2>平均配送时间</h2>
						<div class="content">
							<span class="stress" v-text="seller.deliveryTime"></span>分钟
						</div>
					</li>
				</ul>
				<div class="favorite" @click="toggleFavorate">              <!-- 此处值可以做一下前端的缓存 -->
					<span class="icon-favorite" :class="{'active': favorite}"></span>
					<span class="text" v-text="favoriteText"></span>
				</div>
			</div>
			<split></split>
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<div class="content-wrapper border-One">
					<p class="content" v-text="seller.bulletin"></p>
				</div>
				<ul v-if="seller.supports" class="supports">
					<li class="support-item border-One" v-for="(item,index) in seller.supports" :key="index">
						<span class="icon" :class="classMap[seller.supports[index].type]"></span>
						<span class="text" v-text="seller.supports[index].description"></span>
					</li>
				</ul>
			</div>
			<split></split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pic-wrapper">
					<ul class="pic-list" ref="ul">
						<li v-for="(pic,index) in seller.pics" :key="index" class="pic-item">
							<img :src="pic" width="120" height="90" alt="pic">
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="info">
				<h1 class="title border-One">商家信息</h1>
				<ul>
					<li v-for="(info,index) in seller.infos" :key="index" class="info-item border-One" v-text="info"></li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
  import star from '../star/star'
  import split from '../split/split'
  import BScroll from 'better-scroll'
  import { saveToLocal, loadFromLocal } from '../../common/js/store'

  export default {
    data () {
      return {
        classMap: [],
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false)
        })()
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      star,
      split
    },
    computed: {
      favoriteText () {
        if (this.favorite) {
          return '已收藏'
        }
        return '收藏'
      }
    },
    // watch: {
    //  'seller' () {                     // 监听seller的变化，来初始化BScroll   刷新页面seller才会有变化， bug ->切换路由的时候BScroll失效了。 所以需要的mounted(代替vue1.0 ready)里也初始化一遍BScroll
    //    this.init_scroll()               //    有坑。这样写没实现
    //  }
    // },
    methods: {
      init_scroll () {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      },
      pic_scroll () {
        if (this.seller.pics) {    // 有图片的时候      有坑，同上，必须两个函数里面都执行
          let picWidth = 120
          let margin = 6
          let ulWidth = (picWidth + margin) * this.seller.pics.length - margin
          this.$refs.ul.style.width = ulWidth + 'px'  // 设置ul的宽度,原生js需要加 单位  'px'
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.ul.parentNode, {
                scrollX: true,                     // 支持横向滚动
                eventPassThrough: 'vertical'        // 忽略竖向滚动，必须有这个才能实现双滚动
              })
            } else {
              this.picScroll.refresh()
            }
          })
        }
      },
      toggleFavorate (event) {
        if (!event._constructed) {
          return
        }
        this.favorite = !this.favorite
        saveToLocal(this.seller.id, 'favorite', this.favorite)
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
      // this.$nextTick(function () {    // 此处使用另外一种判断dom加载完成的方式
      //   this.init_scroll()
      // })
    },
    mounted () {                // 同上道理，路由跳转激活滚动
      this.init_scroll()         //  此处有坑，由于mounted函数的执行顺序在watch之前。所以之前init_scroll逻辑不严谨需要加else
      this.pic_scroll()
    },
    updated () {                // 同上道理，刷新页面激活滚动
      this.init_scroll()
      this.pic_scroll()
    }
  }
</script>
<style lang="less" scoped>
	@import '../../common/less/mixin';
	.seller{
		position:absolute;
		top:174px;
		bottom: 0;
		left: 0;
		width:100%;
		overflow: hidden;
		.overview{
			position:relative;
			padding: 18px;
			.title{
				margin-bottom: 8px;
				line-height: 14px;
				color:rgb(7,17,27);
				font-size: 14px;
			}
			.desc{
				padding-bottom: 18px;
				.border-one(rgba(7,17,27,0.1));
				font-size: 0;
				.star{
					display: inline-block;
					vertical-align: top;
					margin-right:8px;
				}
				.text{
					display: inline-block;
					vertical-align: top;
					line-height: 18px;
					margin-right:12px;
					font-size: 10px;
					color:rgb(77,85,93);
				}
			}
			.remark{
				display:flex;
				padding-top: 18px;
				.block{
					flex:1;
					text-align: center;
					border-right:1px solid rgba(7,17,27,0.1);
					&:last-child{
						border-right:0;
					}
					h2{
						margin-bottom: 4px;
						line-height: 10px;
						font-size: 10px;
						color:rgb(147,153,159);
					}
					.content{
						line-height: 24px;
						font-size: 10px;
						color:rgb(7,17,27);
						.stress{
							font-size: 24px;
						}
					}
				}
			}
			.favorite{
				position:absolute;
				width:50px;
				right:11px;
				top:18px;
				text-align: center;
				.icon-favorite{
					display:block;
					margin-bottom: 4px;
					line-height: 24px;
					font-size: 24px;
					color:#d4d6d9;
					&.active{
						color:rgb(240,20,20);
					}
				}
				.text{
					font-size: 10px;
					line-height: 10px;
					color:rgb(77,85,93);
				}
			}
		}
		.bulletin{
			padding: 18px 18px 0 18px;
			.title{
				margin-bottom: 8px;
				line-height: 14px;
				color:rgb(7,17,27);
				font-size: 14px;
			}
			.content-wrapper{
				padding:0 12px 16px 12px;
				.border-one(rgba(7,17,27,0.1));
				.content{
					line-height: 24px;
					font-size: 12px;
					color:rgb(240,20,20);
				}
			}
			.supports{
				.support-item{
					padding:16px 12px;
					font-size: 0;
					.border-one(rgba(7,17,27,0.1));
					&:last-child{
						.border-none();
					}
					.icon{
						display:inline-block;
						width:12px;
						height:12px;
						margin-right:4px;
						background-size: 12px 12px;
						background-repeat: no-repeat;
						vertical-align: top;
						&.decrease{
							.bg-image('../../components/seller/decrease_4');
						};
						&.discount{
							.bg-image('../../components/seller/discount_4');
						};
						&.guarantee{
							.bg-image('../../components/seller/guarantee_4');
						};
						&.invoice{
							.bg-image('../../components/seller/invoice_4');
						};
						&.special{
							.bg-image('../../components/seller/special_4');
						};
					}
					.text{
						font-size: 12px;
						line-height: 16px;
						color:rgb(7,17,27);
					}
				}
			}
		}
		.pics{
			padding:18px;
			.title{
				margin-bottom: 12px;
				line-height: 14px;
				color:rgb(7,17,27);
				font-size: 14px;
			}
			.pic-wrapper{
				width:100%;
				overflow:hidden;
				white-space: nowrap;     /* 图片不折行，因为此处没有使用float */
				.pic-list{
					font-size: 0;
					.pic-item{
						display:inline-block;
						margin-right:6px;
						width:120px;
						height:90px;
						&:last-child{
							margin:0;
						}
					}
				}
			}
		}
		.info{
			padding: 18px 18px 0 18px;
			color:rgb(7,17,27);
			.title{
				padding-bottom: 12px;
				line-height: 14px;
				font-size: 14px;
				.border-one(rgba(7,17,27,0.1));
			}
			.info-item{
				padding:16px 12px;
				line-height: 16px;
				.border-one(rgba(7,17,27,0.1));
				font-size: 10px;
				color:rgb(7,17,27);
				&:last-child{
					.border-none();
				}
			}
		}
	}
</style>
