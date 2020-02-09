<template>
    <router-view></router-view>
</template>

<script>
export default {
  name: 'Index',
  components: {
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
  .el-card{margin-top: 15px}
  .el-table{margin-top: 15px}
  #app, body, html{min-width: 1380px;}
  .el-pagination{margin-top: 15px}
</style>
