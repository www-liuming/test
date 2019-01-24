<template>
	<div class="split"></div>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
    },
    props: {
    }
  }
</script>
<style lang="less" scoped>
	@import '../../common/less/mixin';
    .split{
    	width:100%;
      height:16px;
      border-top: 1px solid rgba(7,17,27,0.1);
      border-bottom: 1px solid rgba(7,17,27,0.1);
      background: #f3f5f7;
    }
</style>
