<template>
	<div class="star" :class="starType">
		<span v-for="(itemClass,index) in itemClasses" :key="index" :class="itemClass" class="star-item"></span>
	</div>
</template>
<script>

  const LENGTH = 5
  const CLS_ON = 'on'
  const CLS_HALF = 'half'
  const CLS_OFF = 'off'

  export default {
    data () {
      return {
      }
    },
    methods: {
    },
    props: {
      size: {
        type: Number,
        default: 48
      },
      score: {
        type: Number,
        default: 5
      }
    },
    computed: {
      starType () {
        return 'star-' + this.size
      },
      itemClasses () {
        let result = []
        let score = Math.floor(this.score * 2) / 2             // 小算法，向下取0.5倍数的值
        let hasDecimal = score % 1 !== 0                     // 判断是否为小数
        let integer = Math.floor(score)
        for (let i = 0; i < integer; i++) {                  // 放置全星
          result.push(CLS_ON)
        }
        if (hasDecimal) {                                    // 如果有小数，则放置一个半星
          result.push(CLS_HALF)
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF)
        }
        return result
      }
    }
  }
</script>
<style lang="less" scoped>
	@import '../../common/less/mixin';
    .star{
    	font-size: 0;
    	.star-item{
			display: inline-block;
			background-repeat: no-repeat;
    	}
    	&.star-48{
    		.star-item{
				width:20px;
				height:20px;
				margin-right: 22px;
				background-size: 20px 20px;
				&:last-child{
					margin-right: 0;
				}
				&.on{
					.bg-image('../../components/star/star48_on');
				}
				&.half{
					.bg-image('../../components/star/star48_half');
				}
				&.off{
					.bg-image('../../components/star/star48_off');
				}
    		}
    	}	
    	&.star-36{
    		.star-item{
				width:15px;
				height:15px;
				margin-right: 6px;
				background-size: 15px 15px;
				&:last-child{
					margin-right: 0;
				}
				&.on{
					.bg-image('../../components/star/star36_on');
				}
				&.half{
					.bg-image('../../components/star/star36_half');
				}
				&.off{
					.bg-image('../../components/star/star36_off');
				}
    		}
    	}
    	&.star-24{
    		.star-item{
				width:10px;
				height:10px;
				margin-right: 3px;
				background-size: 10px 10px;
				&:last-child{
					margin-right: 0;
				}
				&.on{
					.bg-image('../../components/star/star24_on');
				}
				&.half{
					.bg-image('../../components/star/star24_half');
				}
				&.off{
					.bg-image('../../components/star/star24_off');
				}
    		}
    	}
    }
</style>
