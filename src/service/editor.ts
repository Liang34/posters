import request from './fetch'
// 获取作品
export function getWork(id: string) {
    return request({
        url: `/works/${id}`,
        method: 'get',
    });
}

// 保存作品
export function saveWork({data, id}) {
    return request({
        url: `/works/${id}`,
        method: 'patch',
        data
    })
}