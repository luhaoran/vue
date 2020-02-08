<template>
  <ul class="footer">
    <li v-for="item in footNav" :key="JSON.stringify(item)" :class="routerName==item.routerName?'active':''">
      <router-link :to="item.to">
        <i :class="item.icon"  style="font-size:20px"></i>
        <span class="span">{{item.name}}</span>
      </router-link>
    </li>
    
  </ul>
</template>

<script>
export default {
  name: 'HelloWorld',
  data(){
    return {
      footNav:[{
        icon:'el-icon-house',
        name:'首页',
        routerName:'Home',
        to:'/'
      },{
        icon:'el-icon-tickets',
        name:'商城',
        routerName:'List',
        to:'/list'
      },{
        icon:'el-icon-user',
        name:'我的',
        routerName:'User',
        to:'/user'
      }]
    }
  },
  props: {
    routerName: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .footer{
    flex: 1;
    display: flex;
    justify-content: space-between;
    padding:.6rem 0;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    background-color: #f9f9f9
  }
  .footer li{
    width: 100%;
    text-align: center
  }

  .footer li.active a{
    color: #4c4cf9
  }

  .span{
    display: block;
    font-size: .8rem;
    margin-top: 3px;
    letter-spacing: 1px
  }
</style>
