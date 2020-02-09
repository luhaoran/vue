import Vue from 'vue'
import vueRouter from 'vue-router';
import Login from './components/Login'
import Home from './components/Home'
import Users from './components/Users'
import Error from './components/Error'
import Welcome from './components/Welcome'

Vue.use(vueRouter);

const router = new vueRouter({
  mode:'history',
  routes: [  //配置路由，这里是个数组
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/home',
      component:Home,
      redirect:'/welcome', //设立子路由后，就要把父路由做重定向跳转
      children:[
        {
          path:'/Welcome',
          component:Welcome
        },
        {
          path:'/users',
          component:Users
        }
      ]
    },
    {
      path:'*',
      component:Error
    }
  ]             
})

router.beforeEach((to,from,next)=>{
  const token = sessionStorage.getItem("token")
  if(to.path == '/login' && token){
    return next("/home");
  }else if(to.path == '/login'){
    return next();
  }
  
  if(!token) return next("/login");
  next();
})

export default  router