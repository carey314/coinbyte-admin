<template>
  <div class="app-container">
    <button @click="handleDelete">删除</button>
    <button @click="handleSave">保存</button>t
    <mavon-editor ref="md" v-model="blogTxt" :style="ediorStyle" :toolbars="toolbars" @imgAdd="onImageAdd" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { getBlog, edit, add, del } from '@/api/system/blog'
import { upload } from '@/utils/upload'
import { form } from '@crud/crud'
import blogApi from '@/api/system/blog'

const defaultForm = {
  title: '',
  blogTxt: '',
  icon: '',
  status: 0,
  subDesc: '',
  typeOne: '',
  typeOneStr: {},
  typeTwo: '',
  typeTwoStr: {},
  top: 0,
  author: ''
}
export default {
  name: 'Markdown',
  components: {
    mavonEditor
  },
  mixins: [form(defaultForm)],
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
        height: `${window.innerHeight - 200}px`
      },
      blog: {},
      isEdit: false
    }
  },
  computed: {
    ...mapGetters('blog', ['blogs'])
  },
  mounted() {
    // window.addEventListener('resize', this.onWindowResize)
    // this.fetchBlog()
    this.fetchBlogDetail()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    submitCU() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.crud.status.cu === 1) {
            // Edit mode
            blogApi
              .edit(this.form.id, this.form)
              .then(response => {
                if (response && response.status === 200) {
                  this.$message.success('博客更新成功')
                  this.crud.cancelCU()
                  // Refresh the blog list after successful update
                  this.getAllBlog()
                } else {
                  this.$message.error('博客更新失败')
                }
              })
              .catch(error => {
                console.error(error)
                this.$message.error('博客更新失败')
              })
          } else {
            // Add mode
            // Implement the logic for adding a new blog here
          }
        } else {
          this.$message.error('请检查表单内容')
          return false
        }
      })
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
    async handleSave() {
      try {
        this.$loading(true)
        if (this.isEdit) {
          // 编辑博客
          const res = await edit(this.$route.params.id, this.blog)
          this.blog = res.data // 更新全量博客对象
          this.blogTxt = res.data.blogTxt
        } else {
          // 新增博客
          const blog = {
            title: this.blog.title,
            blogTxt: this.blog.blogTxt
          }
          const res = await add(blog)
          this.blog = res.data
          this.blogTxt = res.data.blogTxt
        }
        this.$message.success('保存成功', 1500)
      } catch (error) {
        // 错误处理
      }
      this.$loading(false)
    },
    fetchBlogDetail() {
      getBlog(this.$route.params.id).then(res => {
        this.blog = res
        this.blogTxt = res.blogTxt
      })
    },
    async handleDelete() {
      try {
        const confirmed = await this.$confirm('确定要删除此博客吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        if (confirmed) {
          this.$loading(true) // 显示loading
          await del(this.blog.id)
          this.$message.success('删除成功', 1500) // 提示持续时间1.5秒
          this.$loading(false)
          this.$router.push('/blog')
        }
      } catch (error) {
        this.$loading(false)
        console.error(error)
        this.$message.error('删除失败,请重试')
      }
    },
    onWindowResize() {
      this.editorStyle.height = `${window.innerHeight - 200}px`
    },
    fetchBlog() {
      const id = this.$route.params.id
      getBlog(id).then(res => {
        this.blogTxt = res.blogTxt
      })
    },
    onImageAdd(pos, $file) {
      upload(this.imagesUploadApi, $file).then(res => {
        const data = res.data
        const url = `${this.baseApi}/file/${data.type}/${data.realName}`
        this.$refs.md.$img2Url(pos, url)
      })
    }
  }
}
</script>

<style scoped>
  .v-note-wrapper.shadow {
    z-index: 5;
  }
</style>
