<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="900px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="虚拟币标志" prop="slug">
        <el-input v-model="form.slug" style="width: 370px;" />
      </el-form-item>

      <el-form-item label="语言" prop="area">
        <el-input v-model="form.area" style="width: 370px;" />
      </el-form-item>
      <el-tabs v-model="activeName" class="editor-tabs">
        <el-tab-pane label="网站介绍" name="infoTxt">
          <el-form-item label="" prop="infoTxt" label-width="0px">
            <Editor v-model="form.infoTxt" />
            <!-- <el-input
              v-model="form.infoTxt"
              autosize
              type="textarea"
              style="width: 370px;"
              placeholder="请输入网站介绍"
            /> -->
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="更多信息" name="moreExtendJson">
          <el-form-item label="" prop="moreExtendJson" label-width="0px">
            <Editor v-model="form.moreExtendJson" />
            <!-- <el-select
              multiple
              v-model="form.moreExtendJson"
            >
              <el-option
                v-for="item in socialMediaOpitons"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="社交媒体" name="socialMediaJson">
          <el-form-item label="" prop="socialMediaJson" label-width="0px">
            <!-- <Editor v-model="form.socialMediaJson" /> -->
            <el-select
              v-model="form.socialMediaJson"
              multiple
            >
              <el-option
                v-for="item in socialMediaOpitons"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="常见问题" name="questionJson">
          <template v-if="!questionJsonEditor.isEditor">
            <el-collapse v-model="collapseNames">
              <el-collapse-item v-for="(item, index) in form.questionJson" :key="index" title="How Many Bitcoins Are There?" :name="item.que + index">
                <template #title>
                  <div style="display: flex; justify-content: space-between; width: 100%;">
                    <div>{{ item.que }}</div>
                    <div style="margin-right: 10px;">
                      <el-button
                        size="mini"
                        type="success"
                        icon="el-icon-edit"
                        @click="toEditQuestionJson(index)"
                      />
                      <el-button
                        size="mini"
                        icon="el-icon-delete"
                        @click="deleteQuestionJson(index)"
                      />
                    </div>
                  </div>
                </template>
                <div class="collapse-content" v-html="item.ans" />
              </el-collapse-item>
            </el-collapse>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              style="margin-top: 10px;"
              @click="toAddQuestionJson"
            />
          </template>
          <template v-else>
            <div class="my-label">问题</div>
            <el-form-item label-position="top" label="" prop="" label-width="0px">
              <el-input v-model="questionJsonEditor.currentInfo.que" type="textarea" />
            </el-form-item>
            <div class="my-label">答案</div>
            <el-form-item label-position="top" label="" prop="questionJson" label-width="0px">
              <Editor v-model="questionJsonEditor.currentInfo.ans" />
            </el-form-item>
            <div style="display: flex; justify-content: flex-end; width: 100%; margin-top: 10px;">
              <el-button @click="addQuestionJson(true)">完成</el-button>
              <el-button @click="addQuestionJson(false)">取消</el-button>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <!-- <el-form-item label="更多信息" prop="moreExtendJson">
        <el-input v-model="form.moreExtendJson" autosize type="textarea" style="width: 370px;" placeholder="请输入更多信息" />
      </el-form-item>
      <el-form-item label="社交媒体" prop="socialMediaJson">
        <el-input v-model="form.socialMediaJson" autosize type="textarea" style="width: 370px;" placeholder="社交媒体" />
      </el-form-item>
      <el-form-item label="常见问题" prop="questionJson">
        <el-input v-model="form.questionJson" autosize type="textarea" style="width: 370px;" placeholder="常见问题" />
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="crud.cancelCU">
        取消
      </el-button>
      <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'
import Editor from '../../../components/Editor.vue'

const defaultForm = {
  slug: '',
  area: '',
  infoTxt: '',
  moreExtendJson: '',
  socialMediaJson: [],
  questionJson: [],
  id: null // 提交后会报id的错,需要清空id
}
// const questionJson = [
//   {
//     key: '1',
//     que: '',
//     ans: ''
//   }
// ];
export default {
  components: {
    Editor
  },
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
      },
      activeName: 'infoTxt',
      collapseNames: '',
      questionJsonEditor: {
        isEditor: false,
        isEdit: false,
        currentIndex: null,
        currentInfo: {}
      },
      socialMediaOpitons: [
        {
          label: 'Facebook',
          value: 'facebook'
        },
        {
          label: 'Twitter',
          value: 'twitter'
        }
      ]
    }
  },
  mounted() {
    // this.moreExtendJsonStr = JSON.stringify(this.form.moreExtendJson)
    // this.socialMediaJsonStr = JSON.stringify(this.form.socialMediaJson)
    // this.questionJsonStr = JSON.stringify(this.form.questionJson)
  },
  methods: {
    toAddQuestionJson() {
      this.questionJsonEditor.currentInfo = {}
      this.questionJsonEditor.isEditor = true
    },
    toEditQuestionJson(index) {
      this.questionJsonEditor.currentInfo = this.form.questionJson[index]
      this.questionJsonEditor.currentIndex = index
      this.questionJsonEditor.isEdit = true
      this.questionJsonEditor.isEditor = true
    },
    deleteQuestionJson(index) {
      this.form.questionJson.splice(index, 1)
    },
    addQuestionJson(confirm = false) {
      if (confirm) {
        if (this.questionJsonEditor.isEdit) {
          this.form.questionJson[this.questionJsonEditor.currentIndex] = this.questionJsonEditor.currentInfo
        } else {
          this.form.questionJson.push(
            this.questionJsonEditor.currentInfo
          )
        }
      }
      this.questionJsonEditor.currentInfo = {}
      this.questionJsonEditor.isEditor = false
      this.questionJsonEditor.isEdit = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
.my-label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-weight: 700;
}
</style>
