<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item
        label="虚拟币标志"
        prop="slug"
      >
        <el-input
          v-model="form.slug"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="语言"
        prop="area"
      >
        <el-input
          v-model="form.area"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        label="网站介绍"
        prop="infoTxt"
      >
        <el-input
          v-model="form.infoTxt"
          autosize
          type="textarea"
          style="width: 370px;"
          placeholder="请输入网站介绍"
        />
      </el-form-item>
      <el-form-item label="更多信息" prop="moreExtendJson">
        <el-input
          v-model="form.moreExtendJson"
          autosize
          type="textarea"
          style="width: 370px;"
          placeholder="请输入更多信息"
        />
      </el-form-item>
      <el-form-item label="社交媒体" prop="socialMediaJson">
        <el-input
          v-model="form.socialMediaJson"
          autosize
          type="textarea"
          style="width: 370px;"
          placeholder="社交媒体"
        />
      </el-form-item>
      <el-form-item label="常见问题" prop="questionJson">
        <el-input
          v-model="form.questionJson"
          autosize
          type="textarea"
          style="width: 370px;"
          placeholder="常见问题"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'

const defaultForm = {
  slug: '',
  area: '',
  infoTxt: '',
  moreExtendJson: {},
  socialMediaJson: {},
  questionJson: {},
  id: null // 提交后会报id的错,需要清空id
}
export default {
  mixins: [form(defaultForm)],
  props: {
    cryptoStatus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        jobSort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
      }
    }
  },
  mounted() {
    // this.moreExtendJsonStr = JSON.stringify(this.form.moreExtendJson)
    // this.socialMediaJsonStr = JSON.stringify(this.form.socialMediaJson)
    // this.questionJsonStr = JSON.stringify(this.form.questionJson)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
