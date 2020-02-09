<template>
  <div class="login-wrap">
    <div class="login-div">
      <el-form
        :model="user"
        :rules="rules"
        ref="user"
        class="demo-ruleForm"
      >
        <el-form-item  prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
				<el-form-item  prop="password">
          <el-input v-model="user.password" show-password></el-input>
        </el-form-item>
        <el-form-item class="form-button-group">
          <el-button @click="resetForm('user')">重置</el-button>
					<el-button type="primary" @click="submitForm('user')">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {
      user: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 10, message: "长度在 4 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        
      }
    };
	},
	methods:{
		submitForm(formName){
			const _this = this
			this.$refs[formName].validate((res)=>{
				if(!res){
					this.$message.error('输入不正确！');
				}else{
					this.$axios.post('/login',_this.user).then((res)=>{
						const { data } = res
						if(data.meta.status == 200){
							this.$message.success(data.meta.msg);
							sessionStorage.setItem('token',data.data.token);
							_this.$router.push('/home')
						}else{
							this.$message.error(data.meta.msg);
						}
					})
				}
				
			})
		},
		resetForm(formName){
			this.$refs[formName].resetFields()
		}
	},
  mounted() {
		console.log(this.$route)
	},
  computed: {}
};
</script>

<style lang="less" scope>
.login-wrap {
  background: url(../../public/images/back.jpg) no-repeat center center;
  background-size: cover;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-div {
  position: relative;
  width: 400px;
  background-color: white;
  top: -10%;
  border-radius: 5px;
  padding: 40px;
}

.form-button-group{
	text-align: right
}
</style>
