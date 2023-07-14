<template>
  <div class="app-container">
    <!-- <p class="warn-content">
      富文本基于
      <el-link type="primary" href="https://www.kancloud.cn/wangfupeng/wangeditor3/332599" target="_blank">wangEditor</el-link>
    </p> -->
    <el-row :gutter="10">
      <el-col :span="24">
        <div ref="editor" class="text" />
      </el-col>
      <!-- <el-col :xs="24" :sm="24" :md="9" :lg="9" :xl="9">
        <div v-html="modelValue" />
        {{ modelValue }}
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { upload } from '@/utils/upload'
import E from 'wangeditor'
export default {
  name: 'Editor',
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editorContent:
        ``,
      editor: null
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi',
      'baseApi'
    ])
  },
  watch: {
    modelValue(newValue) {
      if (this.editor && (this.editorContent !== this.modelValue)) {
        this.editor.txt.html(newValue)
      }
    }
  },
  mounted() {
    const _this = this
    this.editor = new E(this.$refs.editor)

    // 自定义菜单配置
    this.editor.config.colors = [
      '#000000',
      '#eeece0',
      '#1c487f',
      '#4d80bf',
      '#ffffff',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FF00FF',
      '#FFFF00',
      '#70DB93',
      '#5C3317'
    ]

    this.editor.config.zIndex = 5
    // 文件上传
    this.editor.config.customUploadImg = function(files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      files.forEach(image => {
        upload(_this.imagesUploadApi, image).then(res => {
          const data = res.data
          const url = _this.baseApi + '/file/' + data.type + '/' + data.realName
          insert(url)
        })
      })
    }
    this.editor.config.onchange = (html) => {
      this.editorContent = html
      this.$emit('update:modelValue', html)
    }

    this.editor.config.pasteFilterStyle = false
    // 自定义处理粘贴的文本内容
    this.editor.config.pasteTextHandle = function(content) {
      // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
      if (content === '' && !content) return ''
      var str = content
      str = str.replace(/<xml>[\s\S]*?<\/xml>/ig, '')
      str = str.replace(/<style>[\s\S]*?<\/style>/ig, '')
      // str = str.replace(/<\/?[^>]*>/g, '')
      str = str.replace(/[ | ]*\n/g, '\n')
      str = str.replace(/&nbsp;/ig, '')
      console.log('****', content)
      console.log('****', str)
      return str
    }

    this.editor.config.customStyle = `
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      }
      .editor-container {
        display: block;
        width: 100%;
        height: 100%;
      }
    `

    this.editor.create()
    // 初始化数据
    this.editorContent = this.modelValue
    this.editor.txt.html(this.modelValue)
  }

}
</script>

<style scoped lang="scss">
.text {
  text-align: left;
}

::v-deep .w-e-text-container {
  min-height: 500px !important;

  .w-e-text {
    min-height: none;
  }
}

.app-container {
  padding: 0;
}</style>
