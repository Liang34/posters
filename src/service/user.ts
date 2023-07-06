import request from './fetch';
// 获取邮箱验证码
export function getVeriCode(emailAddress: string) {
    return request({
        url: '/users/genVeriCode',
        method: 'post',
        data: {
            emailAddress
        }
    });
}
// 登录
export function login(data: {emailAddress: string; veriCode: string }) {
    return request({
        url: '/users/loginByPhoneNumber',
        method: 'post',
        data
    })
}
// 获取用户信息
export function getUserInfo() {
    return request({
        url: '/users/getUserInfo',
        method: 'get',
    })
}
// 更新用户信息
export function updateUserInfo(data) {
    return request({
        url: '/users/updateUserInfo',
        method: 'patch',
        data
    })
}