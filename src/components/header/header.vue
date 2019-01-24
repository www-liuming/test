<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img :src="seller.avatar" alt="logo" width="64" height="64">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name" v-text="seller.name"></span>
				</div>
				<div class="description" v-text="seller.description + '/' +seller.deliveryTime + '分钟送达' "></div>
				<div class="support" v-if="seller.supports">             <!-- 使用v-if="seller.supports"来避免错误 -->
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>    <!-- 动态绑定class，利用下标 -->
					<span class="text" v-text="seller.supports[0].description"></span>   <!-- 此处在vue1.0里面会报错 seller.supports[0]找不到 -->
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click='showDetail'>     <!-- 使用v-if="seller.supports"来避免错误 -->
				<span class="count" v-text="seller.supports.length + '个' "></span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrapper" @click='showDetail'>
			<span class="bulletin-title"></span><span class="bulletin-text" v-text="seller.bulletin"></span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
			<img :src="seller.avatar" alt="background">
		</div>
		<transition name='fade'>                                  <!-- transition,vue过渡，动画效果 -->   
			<div v-show="detailShow" class="detail">              <!-- 经典stick footer布局 html并列两个容器，固定在底部的和内容区平级 内容区必须清除浮动并且里面嵌套一个容器-->
				<div class="detail-wrapper clearfix">
					<div class="detail-main">
						<h1 class="name" v-text="seller.name"></h1>
						<div class="star-wrapper">
							<star :size='48' :score='seller.score'></star>
						</div>
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>
						<ul v-if="seller.supports" class="supports">
							<li class="support-item" v-for="(item,index) in seller.supports" :key="index">
								<span class="icon" :class="classMap[seller.supports[index].type]"></span>
								<span class="text" v-text="seller.supports[index].description"></span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">
							<p class="content" v-text="seller.bulletin"></p>
						</div>
					</div>
				</div>
				<div class="detail-close">
					<i class="icon-close" @click="detailShow = false"></i>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
  import star from '../star/star'

  export default {
    data () {
      return {
        classMap: [],
        detailShow: false
      }
    },
    methods: {
      showDetail () {
        this.detailShow = true
      }
    },
    components: {
      star
    },
    props: {
      seller: {
        type: Object
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    }
  }
</script>
<style lang="less" scoped>
    @import '../../common/less/mixin';

    .fade-enter-active,.fade-leave-active{           /* 配合transition组件使用的css */
		transition: opacity 0.5s;
	}
	.fade-enter,.fade-leave-active{                   /* 配合transition组件使用的css */
		opacity: 0;
	}

	.header{
		position:relative;
		color:#fff;
		overflow:hidden;
		background: rgba(7,17,27,0.5);        /* 必须是半透明的，才能看到背景图片 */                       
		.content-wrapper{
			position:relative;
			padding:24px 12px 18px 24px;
			font-size: 0;                     /* 避免span标签之间空字符造成的间隙，外层div font-size:0，里层span设置font-size: xx */
			.avatar{
				display:inline-block;               /* 移动端布局尽量使用 inline-block,不适用float */
			}
			.content{
				display:inline-block;
				margin-left:16px;
				vertical-align: top;               /* 和图片对齐 */
				.title{
					margin:2px 0 8px 0;
					.brand{
						display:inline-block;
						width:30px;
						height:18px;
						.bg-image('../../components/header/brand');
						background-size:cover;
						background-repeat: no-repeat;
					}
					.name{
						margin-left:6px;
						font-size: 16px;
						line-height: 18px;
						font-weight: bold;
						vertical-align: top;
					}
				}
				.description{
					margin-bottom: 10px;
					line-height: 12px;
					font-size: 12px;
				}
				.support{
					.icon{
						display:inline-block;
						width:12px;
						height:12px;
						margin-right:4px;
						background-size: 12px 12px;
						background-repeat: no-repeat;
						vertical-align: top;
						&.decrease{
							.bg-image('../../components/header/decrease_1');
						};
						&.discount{
							.bg-image('../../components/header/discount_1');
						};
						&.guarantee{
							.bg-image('../../components/header/guarantee_1');
						};
						&.invoice{
							.bg-image('../../components/header/invoice_1');
						};
						&.special{
							.bg-image('../../components/header/special_1');
						};
					}
					.text{
						line-height: 12px;
						font-size: 10px;
					}
				}
			}
			.support-count{
				position:absolute;
				right:12px;
				bottom:14px;
				padding:0 8px;
				height:24px;
				line-height: 24px;
				border-radius: 14px;
				background: rgba(0,0,0,0.2);
				text-align: center;
				.count{
					vertical-align: top;
					font-size: 10px;
				}
				.icon-keyboard_arrow_right{
					font-size: 10px;
					line-height: 24px;
					margin-left: 2px;
				}
			}
		}
		.bulletin-wrapper{
			position:relative;
			height:28px;
			line-height: 28px;
			padding:0 22px 0 12px;
			white-space: nowrap;                    /* white-space：nowrap是不换行，word-wrap:break-word是换行 */
			overflow: hidden;                       /* white-space: nowrap; overflow: hidden; text-overflow:ellipsis;必须一起使用*/
			text-overflow:ellipsis;                 /* text-overflow: clip|ellipsis|string;   	修剪文本 | 显示省略符号来代表被修剪的文本 | 使用给定的字符串来代表被修剪的文本 */
			font-size: 10px;                       /* 此处font-size会影响text-overflow属性设置的... 把span标签并排来消除空格间隙 */
			.bulletin-title{
				display:inline-block;
				vertical-align: top;
				margin-top: 8px;
				width:22px;
				height:12px;
				.bg-image('../../components/header/bulletin');
				background-size: 22px 12px;
				background-repeat: no-repeat;
			}
			.bulletin-text{
				vertical-align: top;
				margin:0 4px;
			}
			.icon-keyboard_arrow_right{
				position:absolute;
				font-size: 10px;
				right:12px;
				top:8px;
			}
		}
		.background{
			position:absolute;
			top:0;
			left:0;
			width:100%;
			height:100%;
			z-index:-1;
			filter:blur(10px);               /* 滤镜，模糊效果 */
			img{
				width:100%;
				height:100%;
			}
		}
		.detail{
			position:fixed;                  /* fixed  布局 */  
			top:0;
			left:0;      
			z-index:1000;
			width:100%;
			height:100%;
			overflow:auto;
			background:rgba(7,17,27,0.8);
			backdrop-filter:blur(10px);          /* 背景虚化iphone  ios系统里面有效 */
			.detail-wrapper{
				min-height:100%;                  /* 确保最小高度是视口的高度 */
				width:100%;
				.detail-main{
					margin-top:64px;
					padding-bottom:84px;          /* 此处padding是stick footer布局必须的，并且其值必须等于固定底部的容器的高度 */
					.name{
						line-height: 16px;
						text-align: center;
						font-size: 16px;
						font-weight: 700;
					}
					.star-wrapper{
						margin-top:18px;
						padding:2px 0;
						text-align: center;
					}
					.title{
						display:flex;
						width:80%;
						margin:28px auto 24px auto;
						.line{
							flex:1;
							position:relative;
							top:-6px;
							border-bottom: 1px solid rgba(255,255,255,0.2);
						}
						.text{
							padding:0 12px;
							font-size: 14px;
							font-weight: 700;
						}
					}
					.supports{
						width:80%;
						margin:0 auto;
						.support-item{
							padding:0 12px;
							margin-bottom: 12px;
							font-size: 0;
							&:last-child{
								margin-bottom: 0;
							}
							.icon{
								display:inline-block;
								width:16px;
								height:16px;
								vertical-align: top;
								margin-right:6px;
								background-size:16px 16px;
								background-repeat: no-repeat;
								&.decrease{
									.bg-image('../../components/header/decrease_2');
								};
								&.discount{
									.bg-image('../../components/header/discount_2');
								};
								&.guarantee{
									.bg-image('../../components/header/guarantee_2');
								};
								&.invoice{
									.bg-image('../../components/header/invoice_2');
								};
								&.special{
									.bg-image('../../components/header/special_2');
								};
							}
							.text{
								line-height: 16px;
								font-size: 12px;
							}
						}
					}
					.bulletin{
						width:80%;
						margin: 0 auto;
						.content{
							padding: 0 12px;
							line-height: 24px;
							font-size: 12px;
						}
					}
				}
			}
			.detail-close{
				position:relative;
				width:32px;
				height:32px;
				margin:-84px auto 0 auto;         /* 此处margin是stick footer布局必须的，并且其值必须等于上一处的padding */
				clear:both;    					  /* 此处clear:both是stick footer布局必须的 */
				font-size: 32px;
			}
		}
	}
</style>
