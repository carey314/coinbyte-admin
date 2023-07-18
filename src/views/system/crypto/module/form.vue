<template>
  <div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible="crud.status.cu > 0"
      :title="crud.status.title"
      width="1200px"
    >
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="虚拟币名称" prop="name">
                  <el-input v-model="form.name" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="虚拟币标志" prop="slug">
                  <el-input v-model="form.slug" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="语言" prop="area">
                  <el-input v-model="form.area" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="虚拟币图标" prop="icon">
                  <!-- <el-input v-model="form.icon" /> -->
                  <el-upload
                    class="avatar-uploader"
                    :action="imagesUploadApi"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="form.icon" :src="form.icon" class="upload-image">
                    <div v-else class="uploadbtn">
                      + icon
                    </div>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="社交媒体" prop="socialMediaJson">
                  <!-- <Editor v-model="form.socialMediaJson" /> -->
                  <el-select
                    v-model="form.socialMediaJson"
                    multiple
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in socialMediaOpitons"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="类别" prop="typeIdList">
                  <!-- <Editor v-model="form.socialMediaJson" /> -->
                  <el-select
                    v-model="form.typeIdList"
                    multiple
                    style="width: 100%;"
                    allow-create
                    filterable
                    @change="typeChange"
                  >
                    <el-option
                      v-for="item in typeIdListOpitons"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <!-- <span
                        style="
                          float: right;
                          color: var(--el-text-color-secondary);
                          font-size: 13px;
                        "
                      >{{ item.value }}</span> -->
                      <el-button
                        size="mini"
                        type="success"
                        icon="el-icon-edit"
                        style="
                          float: right;
                        "
                        @click="(e) => openEditType(item, e)"
                      />
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="别名" prop="alias">
                  <el-input v-model="form.alias" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="16">
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
                  <Editor v-model="form.moreExtendJson.text" />
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
              <!-- <el-tab-pane label="社交媒体" name="socialMediaJson">
              </el-tab-pane> -->
              <el-tab-pane label="常见问题" name="questionJson">
                <template v-if="!questionJsonEditor.isEditor">
                  <el-collapse v-if="form.questionJson.length > 0" v-model="collapseNames">
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
                  <!-- <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    style="margin-top: 10px;"
                    @click="toAddQuestionJson"
                  /> -->
                  <div
                    class="uploadbtn"
                    style="margin-top: 20px; float: right;"
                    @click="toAddQuestionJson"
                  >
                    + Question
                  </div>
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
          </el-col>
        </el-row>

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
    <el-dialog
      :visible="toEditType.view"
      title="Edit type"
      width="30%"
    >
      <el-input v-model="toEditType.currentItem.label" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="confirmEditType">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { form } from '@crud/crud'
import Editor from '../../../components/Editor.vue'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import { Notification } from 'element-ui'

const defaultForm = {
  slug: '',
  area: '',
  infoTxt: '',
  icon: '',
  moreExtendJson: {},
  socialMediaJson: [],
  questionJson: [],
  id: null, // 提交后会报id的错,需要清空id
  name: '',
  typeIdList: [],
  alias: ''
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
    },
    getInfo: {
      type: Function,
      required: true
    },
    infoTypes: {
      type: Array,
      default: () => []
    },
    setInfoTypes: {
      type: Function,
      required: true
    },
    addType: {
      type: Function,
      required: true
    },
    editType: {
      type: Function,
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
      ],
      typeIdListOpitons: [
        // {
        //   label: 'Type 1',
        //   value: 1
        // },
      ],
      toEditType: {
        view: false,
        currentItem: {
          value: null,
          label: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi',
      'baseApi'
    ]),
    headers() {
      return {
        'Authorization': getToken()
      }
    }
  },
  watch: {
    async 'form.id'(newValue) {
      if (newValue !== null) {
        const res = await this.getInfo(newValue)
        this.form = Object.assign(this.form, res)
        if (!Array.isArray(this.form.socialMediaJson)) {
          this.form.socialMediaJson = []
        }
        if (!Array.isArray(this.form.questionJson)) {
          this.form.questionJson = []
        }
        console.log(this.form.socialMediaJson)
      }
    },
    async infoTypes(newValue) {
      this.typeIdListOpitons = newValue.map(v => (
        {
          label: v.name,
          value: v.id,
          key: v.id
        }
      ))
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
    },
    beforeAvatarUpload(rawFile) {
      const imgTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']
      if (!imgTypes.includes(rawFile.type)) {
        // ElMessage.error('Avatar picture must be JPG format!')
        Notification.error({
          title: 'Picture must be image format!',
          duration: 5000
        })
        return false
      }
      // else if (rawFile.size / 1024 / 1024 > 2) {
      //   // ElMessage.error('Avatar picture size can not exceed 2MB!')
      //   Notification.error({
      //     title: 'Avatar picture must be JPG format!',
      //     duration: 5000
      //   })
      //   return false
      // }
      return true
    },
    handleUploadSuccess(response) {
      const url = `${this.baseApi}/file/${response.type}/${response.realName}`
      this.form.icon = url
    },
    handleUploadError(error) {
      Notification.error({
        title: JSON.parse(error.message).message,
        duration: 5000
      })
    },
    async typeChange(val) {
      const newType = val.find(v => {
        if (typeof v === 'string') {
          return true
        }
      })
      if (newType) {
        try {
          await this.addType({
            name: newType
          })
          await this.setInfoTypes()
          setTimeout(async() => {
            const findOptId = this.typeIdListOpitons.find(v => v.label === newType).value
            if (!this.form.typeIdList.includes(findOptId)) {
              this.form.typeIdList[this.form.typeIdList.length - 1] = findOptId
              console.log(this.form.typeIdList, this.typeIdListOpitons)
            }
            await this.setInfoTypes()
            Notification.success({
              title: '添加成功!',
              duration: 5000
            })
          })
        } catch (e) {
          console.log(e)
          Notification.error({
            title: '请稍后再试!',
            duration: 5000
          })
        }
      }
    },
    openEditType(item, e) {
      this.toEditType.currentItem = item
      this.toEditType.view = true
      e.stopPropagation()
    },
    async confirmEditType() {
      try {
        await this.editType(
          {
            id: this.toEditType.currentItem.value,
            name: this.toEditType.currentItem.label
          }
        )
        await this.setInfoTypes()
        this.toEditType = {
          view: false,
          currentItem: {
            value: null,
            label: ''
          }
        }
        Notification.success({
          title: '更改成功!',
          duration: 5000
        })
      } catch (e) {
        console.log(e)
        Notification.error({
          title: '请稍后再试!',
          duration: 5000
        })
      }
    },
    closeDialog() {
      this.toEditType = {
        view: false,
        currentItem: {
          value: null,
          label: ''
        }
      }
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
.upload-image {
  width: 80px;
}
.uploadbtn {
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: all .2s;
}
.uploadbtn:hover {
  border: 1px dashed #05f;
  color: #05f;
}
</style>
