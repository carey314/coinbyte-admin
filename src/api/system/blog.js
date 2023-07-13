import request from '@/utils/request'

export function getAllBlog(params) {
  return request({
    url: 'api/coin/blog',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/coin/blog',
    method: 'post',
    data
  })
}

export function del(id) {
  const data = [id[0]] // 请求体
  return request({
    url: `/api/coin/blog`,
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: `/api/coin/blog`,
    method: 'put',
    data
  })
}

export function updateBlogStatus(id, status) {
  return request({
    url: `api/coin/blog/${id}/${Number(status)}`,
    method: 'put'
  })
}

export function getBlog(id) {
  return request({
    url: `api/coin/blog/${id}`,
    method: 'get'
  })
}
export default { getAllBlog, add, del, edit, getBlog, updateBlogStatus }
