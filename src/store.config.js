import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        api:"http://api.luhaoran.cn",
        products:[],
        cartList:[],
        countPrice:0
    },
    mutations:{
        countChange(state,num){
            state.count += num
        },
        productsSave(state,value){
            state.products = value
        },
        carListSave(state,value){
            state.cartList = value
        },
        countPriceChange(state,value){
            state.countPrice = value
        }
    }
})

export default store