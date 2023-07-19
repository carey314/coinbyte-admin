<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :border="true" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="title" label="博客标题" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="subDesc" label="简介" />
      <!-- <el-table-column prop="icon" label="图片" /> -->
      <!-- <el-table-column prop="blogTxt" label="博客内容" /> -->
      <el-table-column prop="top" label="置顶" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.top"
            :value="scope.row.top === 1"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeTop(scope.row, scope.row.top)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="typeOne" label="一级分类" />
      <!-- <el-table-column prop="typeTwo" label="二级分类" /> -->
      <el-table-column prop="status" label="是否发布" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :value="scope.row.status === 1"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.status)"
          />
        </template>
      </el-table-column>
      <!--   编辑与删除   -->
      <el-table-column
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button @click="navigateToEditPage(scope.row)">编辑</el-button>
          <!-- <el-button style="margin-left: 0px !important;margin-top: 3px;" @click="navigateToDelPage(scope.row)">删除</el-button> -->
        </template>

      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <eForm :job-status="dict.job_status" />
  </div>
</template>

<script>
import crudJob from '@/api/system/blog'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'Blog',
  components: { eHeader, eForm, crudOperation, pagination },
  cruds() {
    return CRUD({
      title: '博客',
      url: 'api/coin/blog',
      crudMethod: { ...crudJob }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['job_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'blog:add'],
        edit: ['admin', 'blog:edit'],
        del: ['admin', 'blog:del']
      }
    }
  },
  created() {
    // 从本地存储获取数据
    const localData = localStorage.getItem('blogData')
    if (localData) {
      this.crud.data = JSON.parse(localData)
    }
    // 发送请求更新数据
    this.crud.refresh()
  },
  methods: {
    navigateToEditPage(data) {
      // const id = data.id // 假设 'id' 是您的数据对象中的属性名称
      // this.$router.push('/blog/' + id)
      this.crud.toEdit(data)
    },
    navigateToDelPage(data) {
      this.$confirm('确定删除该博客吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.crud.toDelete(data)
            .then(() => {
              // 删除成功后的操作
              this.crud.notify('删除成功', 'success')
              this.crud.refresh()
            })
            .catch((error) => {
              // 删除失败后的操作
              console.error('删除失败', error)
            })
        })
        .catch(() => {
          // 取消删除的操作
        })
    },
    changeEnabled(data, val) {
      const status = val ? 1 : 0
      console.log('val:', status)
      this.$confirm(
        '此操作将 "' +
          this.dict.label.job_status[status] +
          '" ' +
          data.title +
          '博客, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.updateBlogStatus(data.id, status)
            .then((response) => {
              data.status = status
              this.crud.notify(this.dict.label.job_status[status] + '成功', 'success')
              console.log(data.status + '121212121')
              localStorage.setItem('blogData', JSON.stringify(this.crud.data))
            })
            .catch((error) => {
              data.status = 1 - status
              console.log(error.data.message)
            })
        }).catch(() => {
        // 取消操作，无需改变状态值
        })
    },
    updateBlogStatus(id, status) {
      return new Promise((resolve, reject) => {
        crudJob.updateBlogStatus(id, status ? 1 : 0) // 将布尔值转换为状态值
          .then(response => {
            // 在请求成功后，执行 resolve 方法
            console.log('成功')
            resolve(response)
          })
          .catch(error => {
            // 在请求失败时，执行 reject 方法
            console.log('失败')
            reject(error)
          })
      })
    },
    changeTop(data, val) {
      const topStatus = val ? 1 : 0
      console.log('top:', topStatus)
      this.$confirm(
        '此操作将 "' +
          (topStatus === 1 ? '设为置顶' : '取消置顶') +
          '" ' +
          data.title +
          '博客, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.updateBlogTop(data.id, topStatus)
            .then((response) => {
              data.top = topStatus
              this.crud.notify((topStatus === 1 ? '设为置顶' : '取消置顶') + '成功', 'success')
              console.log(data.top + '121212121')
              localStorage.setItem('blogData', JSON.stringify(this.crud.data))
            })
            .catch((error) => {
              data.top = 1 - topStatus
              console.log(error.data.message)
            })
        }).catch(() => {
          // 取消操作，无需改变状态值
        })
    },
    updateBlogTop(id, top) {
      return new Promise((resolve, reject) => {
        crudJob.updateBlogTop(id, top ? 1 : 0) // 将布尔值转换为状态值
          .then(response => {
            // 在请求成功后，执行 resolve 方法
            console.log('成功')
            resolve(response)
          })
          .catch(error => {
            // 在请求失败时，执行 reject 方法
            console.log('失败')
            reject(error)
          })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
