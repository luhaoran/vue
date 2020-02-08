<template>
  <div>
      <p @click="clickMe">这是首页---{{count}}</p>
  </div>
</template>

<script>
import { mapState,mapMutations  } from 'vuex';
export default {
  name: 'Home',
  data(){
    return {

    }
  },
  computed:{
    ...mapState(["count"]),
  },
  methods:{
    ...mapMutations(["countChange"]),
    clickMe(){
      this.countChange(20)
    }
  }
}
</script>

<style lang="less" scope>
  body{margin: 0}
  ul li{list-style: none}
  #app{margin: 0;padding: 0}
  div{
    p{font-size: 20px}
  }
</style>
