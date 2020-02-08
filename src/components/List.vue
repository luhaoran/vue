<template>
  <div class="wrap">
    <el-dropdown trigger="click" @command="typeClick" size="small" split-button type="primary">
      {{nowName}}
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item 
          v-for="(item,index) in products" 
          :key="JSON.stringify(item)"
          :icon="index == nowIndex ? 'el-icon-check' : 'el-icon-close'"
          :command="index"
        >
          {{item.name}}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <ul class="product-ul">
      <li class="product-li" 
          v-for="(item,index) in nowProducts" 
          :key="JSON.stringify(item)"
      >
          <div class="product-li-item">
            <div class="img" :style="{backgroundImage:'url('+item.pic+')'}"></div>
            <p class="name">{{item.name}}</p>
            <div class="priceAndBtn">
              <h4>¥ {{item.price}}</h4>
              <div class="btn">
                <i @click="add(index)" class="el-icon-circle-plus"></i>
                <span>{{item.selNum}}</span>
                <i @click="min(index)" class="el-icon-remove"></i>
              </div>
            </div>
          </div>
      </li>
    </ul>
    <div class="countPrice">¥ <span>{{countPrice}}</span></div>
    
  </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
export default {
  name: 'Index',
  data(){
    return{
      products:[],
      nowProducts:[],
      nowIndex:0,
      nowName:''
    }
  },
  components: {
  },
  mounted(){
    this.getProducts()
    console.log(this.$store.state.cartList)
  },
  methods:{
    ...mapMutations(['productsSave','carListSave','countPriceChange']),
    getProducts(){
      const _this = this
      const { api,cartList } = this.$store.state
      this.axios.get(api+ "/getProducts").then((res)=>{
        const data = res.data;
        if(data.status === 1){
          let products = data.data;
          for(let i = 0; i < products.length; i++){
            for(let y = 0; y < products[i].products.length; y++){
              let item = products[i].products[y];
              const has = cartList.find(i=>i.id==item.id);
              console.log(has)
              has && (products[i].products[y].selNum = has.selNum)
            }
          }

          _this.products = products;
          _this.nowProducts = _this.products[_this.nowIndex].products
          _this.nowName = _this.products[_this.nowIndex].name
          _this.productsSave(_this.products)
        }
      })
    },
    typeClick(e){
      this.nowIndex = e
    },
    add(index){
      let products = this.products;
      let cartList = this.cartList;
      let item = products[this.nowIndex].products[index];
      let hasIndex = cartList.findIndex((i)=>i.id==item.id);

      if(hasIndex >= 0){
        products[this.nowIndex].products[index].selNum += 1;
        item = products[this.nowIndex].products[index];
        cartList.splice(hasIndex,item)
      }else{
        products[this.nowIndex].products[index].selNum = 1;
        item = products[this.nowIndex].products[index];
        cartList.push(item)
      }
      
      this.productsSave(products)
      this.carListSave(cartList)
      this.nowProducts = products[this.nowIndex].products
    },
    min(index){
      let products = this.products;
      let cartList = this.cartList;
      let item = products[this.nowIndex].products[index];
      let hasIndex = cartList.findIndex((i)=>i.id==item.id);

      if(hasIndex >= 0 && item.selNum > 1){
        products[this.nowIndex].products[index].selNum -= 1;
        item = products[this.nowIndex].products[index];
        cartList.splice(hasIndex,item)
      }else if(item.selNum == 1){
        products[this.nowIndex].products[index].selNum = 0;
        cartList.splice(hasIndex)
      }
      
      this.productsSave(products)
      this.carListSave(cartList)
      this.nowProducts = products[this.nowIndex].products
    }
  },
  computed:{
    ...mapState(['cartList','countPrice'])
  },
  watch:{
    nowIndex(){
      this.nowProducts = this.products[this.nowIndex].products
      this.nowName = this.products[this.nowIndex].name
    },
    cartList(){
      let countPrice = 0
      this.cartList.forEach((item)=>{
        countPrice += item.price * item.selNum
      })
      this.countPriceChange(countPrice)
    }
  }


}
</script>

<style lang="less">
  body{margin: 0}
  ul li{list-style: none}
  #app{margin: 0;padding: 0}
  .wrap{width: 96%;margin: 0 auto;padding: 20px 0 0 0}

  .product-ul{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    flex-wrap:wrap;
    .product-li{
      width: 48%;
      border: 1px solid #ddd;
      border-radius: 3px;
      margin-bottom: 10px;
      .product-li-item{
        padding: 10px;
        .img{
          width: 100%;
          height: 120px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center
        }
        .name{
          font-size: 12px;
          margin-top: 10px
        }
      }
    }
  }
  .btn{
    color: #e86363;
    margin-top: 5px;
    span{
      display: inline-block;
      margin: 0 5px

    }
    i{
      font-size: 18px
    }
  }
  .priceAndBtn{
    display: flex;
    justify-content: space-between;
    h4{
      margin: 0;
      margin-top: 4px
    }
  }
  .countPrice{
    position: fixed;
    right: 0;
    bottom: 100px;
    padding: 0 20px;
    color: red;
    span{
      font-size: 24px
    }
  }

 

</style>
