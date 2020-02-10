<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-top:15px"
      @click="addVisible=true"
    >添加分类</el-button>
    <el-card>
      <zk-table
        ref="table"
        sum-text="sum"
        index-text="#"
        :data="categories"
        :columns="treeColums"
        stripe
        border
        tree-type
        :selection-type="false"
        :expand-type="false"
        show-index
      >
        <template slot="canUseTemp" scope="scope">
          <i class="el-icon-success" style="color:lightblue" v-if="!scope.row.cat_deleted"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <template slot="sortTemp" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
        </template>
        <template slot="doTemp" scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCategorie(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delCategorie(scope.row)"
          >删除</el-button>
        </template>
      </zk-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageCategories.pagenum"
          :page-sizes="[2, 5, 10, 50]"
          :page-size="pageCategories.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <el-dialog title="修改分类名称" :visible.sync="cnuVisible" width="50%" @close="cnuClose">
        <el-form :model="cnuForm" :rules="cnuRules" ref="cnuForm" label-width="100px">
          <el-form-item label="分类名称" prop="cnuName">
            <el-input v-model="cnuForm.cnuName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cnuVisible = false">取 消</el-button>
          <el-button type="primary" @click="cnuSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加分类" :visible.sync="addVisible" width="40%" @close="addVisible=false">
        <el-cascader
          v-model="addValue"
          :options="addCategories"
          :props="addProps"
          @change="addSelectChange"
          clearable
          style="width:100%"
        ></el-cascader>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addVisible=false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Categories",
  components: {},
  data() {
    return {
      pageCategories: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      categories: [],
      treeColums: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          prop: "",
          type: "template",
          template: "canUseTemp"
        },
        {
          label: "排序",
          prop: "",
          type: "template",
          template: "sortTemp"
        },
        {
          label: "操作",
          prop: "",
          type: "template",
          template: "doTemp"
        }
      ],
      total: 0,
      cnuVisible: false,
      cnuForm: {
        cnuName: ""
      },
      cnuRules: {
        cnuName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      cnuId: 0,
      addCategories: [],
      addVisible: false,
      addValue: "",
      addProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true
      }
    };
  },
  mounted() {
    this.getCategories();
    this.getAddCategories();
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
    getAddCategories() {
      const _this = this;
      this.$axios.get("/categories?type=2").then(res => {
        const { data } = res;
        if (data.meta.status != 200) return this.$message.error(data.meta.msg);
        _this.addCategories = data.data;
        console.log(_this.addCategories);
      });
    },
    editCategorie(item) {
      this.cnuVisible = true;
      this.cnuId = item.cat_id;
      this.cnuForm.cnuName = item.cat_name;
    },
    delCategorie(item) {
      console.log(item);
    },
    handleSizeChange(pagesize) {
      this.pageCategories.pagesize = pagesize;
      this.getCategories();
    },
    handleCurrentChange(pagenum) {
      this.pageCategories.pagenum = pagenum;
      this.getCategories();
    },
    cnuClose() {
      (this.cnuForm.cnuName = ""), (this.cnuVisible = false);
    },
    cnuSubmit() {
      this.$refs.cnuForm.validate(res => {
        if (!res) return;
      });
      this.$axios
        .put(`/categories/${this.cnuId}`, { cat_name: this.cnuForm.cnuName })
        .then(res => {
          const { data } = res;
          if (data.meta.status != 200)
            return this.$message.error(data.meta.msg);
          this.$message.success(data.meta.msg);
          this.cnuVisible = false;
          this.getCategories();
        });
    },
    addSelectChange(val) {
      console.log(val);
    }
  }
};
</script>

<style>
</style>
