import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/coin/info',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/api/coin/info',
    method: 'put',
    data
  })
}

export function get(id) {
  return request({
    url: `/api/coin/info/${id}`,
    method: 'get'
  })
}

export function getCoinInfoBySlugAndArea(slug, area) {
  return request({
    url: `api/coin/info/${slug}/${area}`,
    method: 'get'
  })
}

export function getAll(params) {
  return request({
    url: 'api/coin/info/',
    method: 'get',
    params
  })
}
export default { add, edit, get, getCoinInfoBySlugAndArea, getAll }
