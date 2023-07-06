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