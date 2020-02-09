<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rolesList" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item,index1) in scope.row.children"
              :key="item.id"
              class="flexCenter"
              :class="[index1 !=0 ?'firstLevelItem':'']"
            >
              <el-col :span="6">
                <el-tag
                  :key="item.id"
                  :disable-transitions="false"
                  closable
                  @close="removeRolesItem(scope.row,item.id)"
                >{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  v-for="(item2,index2) in item.children"
                  :key="item2.id"
                  style="padding: 10px 0"
                  :class="['flexCenter',index2 !=0 ?'firstLevelItem':'']"
                >
                  <el-col :span="6">
                    <el-tag
                      :key="item2.id"
                      :disable-transitions="false"
                      type="success"
                      closable
                      @close="removeRolesItem(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <span v-for="item3 in item2.children" :key="item3.id" style="margin-right:10px">
                      <el-tag
                        :key="item3.id"
                        :disable-transitions="false"
                        type="warning"
                        closable
                        @close="removeRolesItem(scope.row,item3.id)"
                      >{{item3.authName}}</el-tag>
                    </span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showTree(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="30%" @close="treeClose">
      <el-tree
        :props="defaultProps"
        :data="treeList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="treeUpdateSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  components: {},
  data() {
    return {
      rolesList: [],
      dialogVisible: false,
      treeList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      defaultCheckedKeys: [],
      openTreeRolesId: ""
    };
  },
  mounted() {
    this.getRolesList();
  },
  methods: {
    getRolesList() {
      const _this = this;
      this.$axios.get("/roles").then(res => {
        const { data } = res;
        if (data.meta.status != 200) return this.$message.error(data.meta.msg);
        _this.rolesList = data.data;
      });
    },
    removeRolesItem(item, rightsId) {
      const { id: rolesId } = item;
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(rolesId, rightsId);
          this.$axios
            .delete(`/roles/${rolesId}/rights/${rightsId}`)
            .then(res => {
              const { data } = res;
              if (data.meta.status != 200)
                return this.$message.error(data.meta.msg);
              this.$message.success(data.meta.msg);
              item.children = data.data;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    showTree(item) {
      this.getTreeList();
      this.getDefaultCheckedKeys(item, this.defaultCheckedKeys);
      this.openTreeRolesId = item.id;
    },
    getDefaultCheckedKeys(item, arr) {
      if (!item.children) {
        return arr.push(item.id);
      }
      item.children.forEach(i => {
        this.getDefaultCheckedKeys(i, arr);
      });
    },
    getTreeList() {
      const _this = this;
      this.$axios.get("/rights/tree").then(res => {
        const { data } = res;
        if (data.meta.status != 200) return this.$message.error(data.meta.msg);
        _this.treeList = data.data;
        _this.dialogVisible = true;
      });
    },
    treeClose() {
      this.defaultCheckedKeys = [116];
      this.dialogVisible = false;
      console.log(this.defaultCheckedKeys);
    },
    treeUpdateSubmit() {
      const _this = this;
      const arr = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ];
      const ids = arr.join(",");
      this.$axios
        .post(`/roles/${this.openTreeRolesId}/rights`, { rids: ids })
        .then(res => {
          const { data } = res;
          if (data.meta.status != 200)
            return this.$message.error(data.meta.msg);
          this.$message.success(data.meta.msg);
          _this.getRolesList();
          _this.dialogVisible = false;
        });
    }
  }
};
</script>

<style>
.el-tag {
  margin: 5px 0;
}
.el-icon-caret-right {
  margin-left: 5px;
}
.firstLevelItem {
  border-top: 1px solid #efefef;
}
</style>
