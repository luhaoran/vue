import Vue from 'vue'
import vueRouter from 'vue-router';
import Home from './components/Home.vue'
import List from './components/List'
import User from './components/User'


Vue.use(vueRouter);

export default new vueRouter({
    mode:'history',
    routes: [              //配置路由，这里是个数组
      {                    //每一个链接都是一个对象
        path: '/',         //链接路径
        name: 'Home',     //路由名称，
        component: Home   //对应的组件模板
      },
      {                    //每一个链接都是一个对象
        path: '/list',         //链接路径
        name: 'List',     //路由名称，
        component: List   //对应的组件模板
      },
      {                    //每一个链接都是一个对象
        path: '/user',         //链接路径
        name: 'User',     //路由名称，
        component: User   //对应的组件模板
      }
    ]
  })