import axios from 'axios'

const fetch = axios.create({
    withCredentials: true,
    timeout: 50000,
    baseURL: '/api'
})
fetch.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)

fetch.interceptors.response.use(
    (axiosRes) => {
        if (axiosRes.data.result !== 0) {
            return axiosRes.data
        } else {
            return axiosRes.data
        }
    },
    (axiosErr) => {
        return axiosErr.response;
    }
)

export default fetch;