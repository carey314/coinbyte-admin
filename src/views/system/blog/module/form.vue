<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="1500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="博客标题" prop="title">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="简介" prop="subDesc">
            <el-input v-model="form.subDesc" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="form.author" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图片" prop="icon">
            <el-input v-model="form.icon" style="width: 370px;" />
          </el-form-item>
          <!-- <el-form-item label="博客内容" prop="blogTxt" style="position: relative;">
            <el-input v-model="form.blogTxt" style="width: 370px;" />
          </el-form-item> -->
          <el-form-item label="一级分类" prop="typeOne">
            <el-input v-model="form.typeOne" style="width: 370px;" />
          </el-form-item>
          <!-- <el-form-item label="二级分类" prop="typeTwo">
            <el-input v-model="form.typeTwo" style="width: 370px;" />
          </el-form-item> -->
          <el-form-item v-if="form.pid !== 0" label="状态" prop="status">
            <el-radio
              v-for="item in jobStatus"
              :key="item.id"
              v-model="form.status"
              :label="item.value === 'true'"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <span>博客内容:</span>
          <mavon-editor ref="md" v-model="form.blogTxt" :style="editorStyle" style="margin-top:8px;" :toolbars="toolbars" @imgAdd="onImageAdd" />
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="crud.cancelCU">
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
import blogApi from '@/api/system/blog'
import { mavonEditor } from 'mavon-editor'
import { upload } from '@/utils/upload'
import 'mavon-editor/dist/css/index.css'
// import CRUD from '@crud/crud'

const defaultForm = {
  id: '',
  title: '',
  blogTxt: '',
  icon: '',
  status: 0,
  subDesc: '',
  typeOne: '',
  typeTwo: '',
  top: 0,
  author: '',
  publishTime: ''
}
export default {
  components: {
    mavonEditor
  },
  mixins: [form(defaultForm)],
  props: {
    jobStatus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      toolbars: {
        'bold': true,
        'italic': true,
        'header': true,
        'underline': true,
        'strikethrough': true,
        'mark': true,
        'superscript': true,
        'subscript': true,
        'quote': true,
        'ol': true,
        'ul': true,
        'link': true,
        'imagelink': true,
        'code': true,
        'table': true,
        'undo': true,
        'redo': true,
        'trash': true,
        'save': false,
        'alignleft': true,
        'aligncenter': true,
        'alignright': true,
        'navigation': true,
        'subfield': true,
        'fullscreen': true,
        'readmodel': true,
        'htmlcode': true,
        'help': true,
        'preview': true
      },
      blogTxt: '',
      editorStyle: {
        // height: `${window.innerHeight + 200}px`
        height: `500px`
      },
      rules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        blogTxt: [
          { required: true, message: '请输入博客内容', trigger: 'blur' }
        ],
        // icon: [
        //   { required: true, message: '请输入图标', trigger: 'blur' }
        // ],
        typeOne: [
          { required: true, message: '请输入一级分类', trigger: 'blur' }
        ],
        typeTwo: [
          { required: true, message: '请输入二级分类', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    goToApiPage(id) {
      this.$router.push('/blog/' + id)
    },
    cancelCU() {
      this.crud.status.cu = 0
    },
    getAllBlog() {
      blogApi
        .getAllBlog()
        .then(response => {
          if (response && response.status === 200) {
            this.blogList = response.data
          } else {
            this.$message.error('获取博客列表失败')
          }
        })
        .catch(error => {
          console.error(error)
          this.$message.error('获取博客列表失败')
        })
    },
    onImageAdd(pos, $file) {
      upload(this.imagesUploadApi, $file).then(res => {
        const data = res.data
        const url = `${this.baseApi}/file/${data.type}/${data.realName}`
        this.$refs.md.$img2Url(pos, url)
      })
    },
    handleUploadSuccess(response, file, fileList) {
      this.imageUrl = response.data.url
      this.form.icon = response.data.url
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
  .v-note-wrapper.shadow {
    z-index: 5;
  }

</style>
