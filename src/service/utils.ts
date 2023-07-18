import { UploadImgProps } from '@/helper'
import request from './fetch'
// 通用接口
// 文件上传
export function uploadImgs(data): Promise<UploadImgProps> {
    return request({
        url: '/utils/upload-img',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}