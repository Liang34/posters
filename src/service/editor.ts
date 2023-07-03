import request from './fetch'

export function getWork(id: string) {
    return request({
        url: `/works/${id}`,
        method: 'get',
    });
}