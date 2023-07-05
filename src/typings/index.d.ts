// 响应数据格式
export interface RespData<T = {}> {
    errno: number;
    data: T;
    message?: string;
    payload?: any;
}