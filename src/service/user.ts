import request from './fetch';

export function getVeriCode(emailAddress: string) {
    return request({
        url: '/users/genVeriCode',
        method: 'post',
        data: {
            emailAddress
        }
    });
}

export function login(data: {emailAddress: string; veriCode: string }) {
    return request({
        url: '/users/loginByPhoneNumber',
        method: 'post',
        data
    })
}

export function getUserInfo() {
    return request({
        url: '/users/getUserInfo',
        method: 'get',
    })
}
