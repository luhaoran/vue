<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <div style="margin-top:15px">
        选择商品分类
        <el-cascader
          style="margin-left:10px"
          v-model="cateValue"
          :options="categories"
          :props="props"
          @change="handleChange"
        ></el-cascader>
      </div>
      <el-tabs v-model="tabName" @tab-click="tabsClick" style="margin-top:15px">
        <el-tab-pane label="动态参数" name="many">
          <el-table :data="manyParams" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag,index) in scope.row.attr_vals"
                  :key="tag"
                  closable
                  type="primary"
                  @close="handleClose(index,scope.row)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column prop="name" label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">静态属性</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Params",
  components: {},
  data() {
    return {
      pageCategories: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      categories: [],
      props: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      cateValue: "",
      manyParams: [],
      tabName: "many",
      inputVisible: false,
      inputValue: ""
    };
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    getCategories() {
      const _this = this;
      this.$axios
        .get("/categories", { params: this.pageCategories })
        .then(res => {
          const { data } = res;
          if (data.meta.status != 200)
            return this.$message.error(data.meta.msg);
          _this.categories = data.data.result;
          _this.total = data.data.total;
        });
    },
    handleChange() {},
    tabsClick() {},
    handleInputConfirm(item) {
      item.attr_vals.push(this.inputValue.trim());
      const attr_vals = item.attr_vals.join(" ");
      const params = { attr_name: item.attr_name, attr_sel: "many", attr_vals };
      this.$axios
        .put(`/categories/${item.cat_id}/attributes/${item.attr_id}`, params)
        .then(res => {
          const { data } = res;
          if (data.meta.status != 200)
            return this.$message.error(data.meta.msg);
          this.inputVisible = false;
          this.inputValue = "";
        });
    },
    handleClose(index, item) {
      item.attr_vals.splice(index,1);
      const attr_vals = item.attr_vals.join(" ");
      const params = { attr_name: item.attr_name, attr_sel: "many", attr_vals };
      this.$axios
        .put(`/categories/${item.cat_id}/attributes/${item.attr_id}`, params)
        .then(res => {
          const { data } = res;
          if (data.meta.status != 200)
            return this.$message.error(data.meta.msg);
          this.inputVisible = false;
          this.inputValue = "";
        });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  },
  watch: {
    cateValue() {
      if (this.cateValue.length == 3) {
        const [, , categoriesId] = this.cateValue;
        this.$axios
          .get(`/categories/${categoriesId}/attributes?sel=many`)
          .then(res => {
            const { data } = res;
            if (data.meta.status != 200)
              return this.$message.error(data.meta.msg);
            let manyParams = data.data;
            manyParams.forEach(el => {
              el.attr_vals = el.attr_vals.split(" ");
            });
            this.manyParams = manyParams;
          });
      }
    }
  }
};
</script>

<style>
.el-tag {
  margin-right: 8px;
}
.button-new-tag {
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  margin: 5px 0;
}
.input-new-tag {
  width: 150px;
  margin-left: 10px;
  vertical-align: bottom;
  margin: 5px 0;
}
</style>
