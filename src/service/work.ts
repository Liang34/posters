/**
 * 获取作品
 */
import request from './fetch';

export function getTemplate(payload: any) {
    return request({
        url: '/works',
        method: 'get',
        params: {...payload}
    })
}

export function getPublicTemplate(payload: any) {
    return request({
        url: '/templates',
        method: 'get',
        params:{...payload}
    })
}

export function createWork(data) {
    return request({
        url: '/works',
        method: 'post',
        data
    })
}

export function deleteWork(id) {
    return request({
        url: `/works/${id}`,
        method: 'delete',
    })
}