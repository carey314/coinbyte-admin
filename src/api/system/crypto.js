import request from '@/utils/request'

export function add(data) {
  const cloneData = deepClone(data)
  toJSON(cloneData, ['moreExtendJson', 'questionJson', 'socialMediaJson'], true)
  return request({
    url: 'api/coin/info',
    method: 'post',
    data: cloneData
  })
}

export function edit(data) {
  const cloneData = deepClone(data)
  console.log(cloneData)
  toJSON(cloneData, ['moreExtendJson', 'questionJson', 'socialMediaJson'], true)
  return request({
    url: '/api/coin/info',
    method: 'put',
    data: cloneData
  })
}

export function get(id) {
  return request({
    url: `/api/coin/info/${id}`,
    method: 'get'
  }).then(res => {
    toJSON(res, ['moreExtendJson', 'questionJson', 'socialMediaJson'], false)
    return res
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

export function getType() {
  return request({
    url: 'api/coin/info/type',
    method: 'get'
  })
}

export default { add, edit, get, getCoinInfoBySlugAndArea, getAll, getType }

function toJSON(data, attrs, toString) {
  try {
    for (let i = 0; i < attrs.length; i++) {
      if (toString) {
        if (data[attrs[i]]) {
          data[attrs[i]] = JSON.stringify(data[attrs[i]])
        }
      } else {
        if (data[attrs[i]]) {
          data[attrs[i]] = JSON.parse(data[attrs[i]])
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  const newObj = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepClone(obj[key])
    }
  }
  return newObj
}
