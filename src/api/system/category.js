import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/coin/blog/type',
    method: 'post',
    data
  })
    .catch(error => {
      console.log('Add Error:', error.response.data)
      throw error // 继续抛出错误，以便上层处理
    })
}

export function getCategorySuperior(pid) {
  const data = pid.length || pid.length === 0 ? pid : Array.of(pid)
  return request({
    url: 'api/coin/blog/type',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/coin/blog/type',
    method: 'put',
    data
  })
}

export function del(id) {
  const data = [id[0]]
  return request({
    url: `/api/coin/blog/type`,
    method: 'delete',
    data
  })
}

export function getCategory(id) {
  return request({
    url: `/api/coin/blog/type/${id}`,
    method: 'get'
  })
}

export function getCategorys() {
  return request({
    url: 'api/coin/blog/type',
    method: 'get'
  })
}

export default { add, edit, del, getCategory, getCategorys, getCategorySuperior }
