<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="user-card-header">
        <el-row :gutter="15">
          <el-col :span="7">
            <el-input
              clearable
              placeholder="请输入内容"
              @clear="queryClear"
              v-model="getUseParams.query"
              class="input-with-select"
            >
              <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="addUserVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
        <el-table :data="users.users" style="width: 100%" stripe border>
          <el-table-column type="index" label="#" width="50"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobild" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="mgStateChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button type="primary" size="mini">
                <i class="el-icon-edit"></i>
              </el-button>
              <el-button type="danger" @click="deleteUser(scope.row)" size="mini">
                <i class="el-icon-delete"></i>
              </el-button>
              <el-button type="warning" size="mini">
                <i class="el-icon-setting"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getUseParams.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="getUseParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="users.total"
        ></el-pagination>
        <el-dialog
          title="添加新用户"
          :visible.sync="addUserVisible"
          width="50%"
          :before-close="addUserFormClose"
        >
          <el-form ref="addUserForm" :model="addUserForm" :rules="addUserRules" label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addUserForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addUserForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addUserForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobild">
              <el-input v-model="addUserForm.mobild"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addUserFormClose">取 消</el-button>
            <el-button type="primary" @click="addUserSubmit">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Users",
  components: {},
  data() {
    var validateEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/;
      if (regEmail.test(value)) {
        return cb();
      }
      return cb(new Error("请输入正确的邮箱！"));
    };
    var validateMoblie = (rule, value, cb) => {
      const regEmail = /^1[3456789]\d{9}$/;
      if (regEmail.test(value)) {
        return cb();
      }
      return cb(new Error("请输入正确的手机号！"));
    };
    return {
      getUseParams: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      users: [],
      addUserVisible: false,
      addUserForm: {
        username: "admin222",
        password: "111111",
        email: "test@google.com",
        mobild: "15666666666"
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 10, message: "长度在 4 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" }
        ],
        email: [{ validator: validateEmail, trigger: "blur" }],
        mobild: [{ validator: validateMoblie, trigger: "blur" }]
      },
      deleteUser(item) {
        const _this = this;
        const { id } = item;
        this.$confirm(`此操作将永久删除该用户${id}, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$axios.delete(`/users/${id}`).then(res=>{
            const { data } = res;
            if(data.meta.status != 200) return this.$message.error(data.meta.msg)
            this.$message.success(data.meta.msg);
            _this.getUseParams.pagenum = 1;
            _this.getUserList()
          })
        })
        .catch(() => {
          this.$message.info("已取消删除")
        });
      }
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      const _this = this;
      this.$axios.get("/users", { params: _this.getUseParams }).then(res => {
        const { data } = res;
        if (data.meta.status != 200)
          return this.$message.error("获取用户数据失败");
        _this.users = data.data;
      });
    },
    handleSizeChange(val) {
      this.getUseParams.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.getUseParams.pagenum = val;
      this.getUserList();
    },
    queryClear() {
      this.getUserList();
    },
    mgStateChange(item) {
      this.$axios.put(`users/${item.id}/state/${item.mg_state}`).then(res => {
        const { data } = res;
        if (data.meta.status === 200) {
          this.$message.success(data.meta.msg);
        } else {
          item.mg_state = !item.mg_state;
          this.$message.error(data.meta.msg);
        }
      });
    },
    addUserFormClose() {
      this.$refs.addUserForm.resetFields();
      this.addUserVisible = false;
    },
    addUserSubmit() {
      const _this = this;
      this.$refs.addUserForm.validate(is => {
        if (!is) return this.$message.error("请填写正确的信息");
        this.$axios.post("/users", this.addUserForm).then(res => {
          const { data } = res;
          if (data.meta.status != 201) this.$message.error("添加失败");
          _this.getUserList();
          _this.$message.success("添加用户成功！");
          _this.addUserVisible = false;
          _this.$refs.addUserForm.resetFields();
        });
      });
    }
  }
};
</script>


