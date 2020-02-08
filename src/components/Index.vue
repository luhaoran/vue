<template>
  <div>
      <router-view></router-view>
      <Foot :routerName="currentRouter"/>
  </div>
</template>

<script>

import Foot from './Foot'

export default {
  name: 'Index',
  components: {
    Foot
  },
  data(){
    return{
      currentRouter:''
    }
  },
  mounted(){
  },
  computed:{
    
  },
  watch:{
    $route:{
        handler:function(route){
        this.currentRouter = route.name
      },
      immediate: true
    }
  }
}
</script>

<style>

  body{margin: 0;font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;}
  ul{margin: 0;padding: 0}
  ul li{list-style: none}
  #app{margin: 0;padding: 0}
  a{text-decoration: none}
  p{margin: 0}
</style>
