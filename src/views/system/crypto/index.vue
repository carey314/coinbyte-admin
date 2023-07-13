<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="slug" label="虚拟币标志" />
      <el-table-column prop="area" label="语言" />
      <!-- <el-table-column prop="infoTxt" label="网站介绍" />
      <el-table-column prop="moreExtendJson" label="更多信息" />
      <el-table-column prop="socialMediaJson" label="社交媒体" />
      <el-table-column prop="questionJson" label="常见问题" /> -->

      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','crypto:edit','crypto:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <eForm :crypto-status="dict.crypto_status" />
  </div>
</template>

<script>
import crudJob from '@/api/system/crypto'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
export default {
  name: 'Crypto',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '虚拟货币',
      url: 'api/coin/info',
      crudMethod: { ...crudJob }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['crypto_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'crypto:add'],
        edit: ['admin', 'crypto:edit'],
        del: ['admin', 'crypto:del']
      },
      rules: {
        slug: [
          { required: true, message: '请输入虚拟币标志', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入语言', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.crypto_status[val] + '" ' + data.name + '岗位, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudJob.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.crypto_status[val] + '成功', 'success')
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
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
