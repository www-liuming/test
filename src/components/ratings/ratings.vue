<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score" v-text="seller.score"></h1>
					<div class="title">综合评分</div>
					<div class="rank" v-text=" '高于周边商家' + seller.rankRate"></div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score" v-text="seller.serviceScore"></span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<star :size="36" :score="seller.foodScore"></star>
						<span class="score" v-text="seller.foodScore"></span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery" v-text="seller.deliveryTime + '分钟' "></span>
					</div>
				</div>
			</div>
			<split></split>
			<ratingSelect @on-selectType-change="onSelectTypeChange" @on-onlyContent-change="onOnlyContentChange" :select-type="selectType" :only-content="onlyContent" :ratings="ratings"></ratingSelect>   <!-- 配合双向数据绑定。props -->
			<div class="rating-wrapper">
				<ul v-show="ratings && ratings.length">
					<li class="rating-item border-One" v-for="(rating,index) in ratings" :key="index"  v-show="needShow(rating.rateType,rating.text)">
						<div class="avatar">
							<img width="28" height="28" :src="rating.avatar" alt="img">
						</div>
						<div class="content">
							<h1 class="name" v-text="rating.username"></h1>
							<div class="star-wrapper">
								<star :size="24" :score="rating.score"></star>
								<span class="delivery" v-show="rating.deliveryTime" v-text="rating.deliveryTime"></span>
							</div>
							<p class="text" v-text="rating.text"></p>
							<div class="recommend" v-show="rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span class="item" v-for="(item,index) in rating.recommend" :key="index" v-text="item"></span>
							</div>
							<div class="time">{{ rating.rateTime | formatTime }}</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
  import axios from 'axios'
  import star from '../star/star'
  import split from '../split/split'
  import ratingSelect from '../ratingSelect/ratingSelect'
  import fn from '../../common/js/date.js'
  import BScroll from 'better-scroll'
  import { baseUrl } from '@/module/axios/baseUrl'

  const ALL = 2
  const ERR_OK = 0

  export default {
    data () {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      star,
      split,
      ratingSelect
    },
    methods: {
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
    filters: {
      formatTime (time) {
        let date = new Date(time)
        return fn.formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    created () {
      axios.get(baseUrl + '/apis/ratings', {}).then(function (res) {
        if (res.data.errno === ERR_OK) {
          this.ratings = res.data.data                                 // vue给seller的每一个属性都添加了get，set方法，用于监控其变化
          this.$nextTick(() => {                          // 初始化BScroll
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            })
          })
        }
      }.bind(this))
    }
  }
</script>
<style lang="less">
	@import '../../common/less/mixin';
	.ratings{
		position:absolute;
		top:174px;           // header组件的高度
		bottom:0;
		width:100%;
		left:0;
		overflow: hidden;
		.overview{
			display: flex;
			padding: 18px 0;
			.overview-left{
				padding: 6px 0;
				flex: 0 0 137px;
				width:137px;
				border-right:1px solid rgba(7,17,27,0.1);
				text-align: center;
				@media only screen and (min-width:320px){    // 兼容iPhone5的布局
					flex: 0 0 120px;
					width:120px;
				}
				.score{
					margin-bottom: 6px;
					line-height: 28px;
					font-size: 24px;
					color:rgb(255,153,0);
				}
				.title{
					margin-bottom: 8px;
					line-height: 12px;
					font-size: 12px;
					color:rgb(7,17,27);
				}
				.rank{
					line-height: 10px;
					font-size: 10px;
					color:rgb(147,153,159);
				}
			}
			.overview-right{
				flex:1;
				padding:6px 0 6px 24px;
				@media only screen and (min-width:320px){        // 兼容iPhone5的布局
					padding-left:6px;
				}
				.score-wrapper{
					margin-bottom: 8px;
					font-size: 0;
					.title{
						display:inline-block;
						font-size: 12px;
						line-height: 18px;
						color:rgb(7,17,27);
						vertical-align: top;
					}
					.star{
						display:inline-block;
						margin:0 12px;
						vertical-align: top;
					}
					.score{
						display:inline-block;
						line-height: 18px;
						font-size: 12px;
						vertical-align: top;
						color:rgb(255,153,0);
					}
				}
				.delivery-wrapper{
					font-size: 0;
					.title{
						font-size: 12px;
						line-height: 18px;
						color:rgb(7,17,27);
					}
					.delivery{
						font-size: 12px;
						color:rgb(147,153,159);
						margin-left: 12px;
					}
				}
			}
		}
		.rating-wrapper{
			padding:0 18px;
			.rating-item{
				display:flex;
				padding:18px 0;
				.border-one(rgba(7,17,27,0.1));
				.avatar{
					flex:0 0 28px;
					width:28px;
					margin-right: 12px;
					img{
						border-radius: 50%;

					}
				}
				.content{
					position:relative;
					flex:1;
					.name{
						margin-bottom: 4px;
						line-height: 12px;
						font-size: 10px;
						color:rgb(7,17,27);
					}
					.star-wrapper{
						margin-bottom: 6px;
						font-size: 0;
						.star{
							display:inline-block;
							margin-right: 6px;
							vertical-align: top;
						}
						.delivery{
							display:inline-block;
							vertical-align: top;
							line-height: 12px;
							font-size: 10px;
							color:rgb(147,153,159);
						}
					}
					.text{
						margin-bottom: 8px;
						font-size: 12px;
						line-height: 18px;
						color:rgb(7,17,27);
					}
					.recommend{
						line-height: 16px;
						.icon-thumb_up, .item{
							display:inline-block;
							margin: 0 8px 4px 0;
							font-size: 9px;
						}
						.icon-thumb_up{
							color:rgb(0,160,220);
						}
						.item{
							padding:0 6px;
							border:1px solid rgba(7,17,27,0.1);
							border-radius: 1px;
							color:rgb(147,153,159);
							background: #fff;
						}
					}
					.time{
						position:absolute;
						top:0;
						right:0;
						line-height: 12px;
						font-size: 10px;
						color:rgb(147,153,159);
					}
				}
			}
		}
	}
</style>
