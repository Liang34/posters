import store from '@/store';
import axios from 'axios'

const fetch = axios.create({
    // withCredentials: true,
    timeout: 50000,
    baseURL: 'http://124.71.170.85:3000/api'
})
fetch.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
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
        store.commit('setLoading', { status: false })
        if (axiosRes.data.errno !== 0) {
            store.commit('setError', { status: true, message: axiosRes.data.message })
            return Promise.reject(axiosRes.data)
        }
        return axiosRes.data
    },
    (e) => {
        const error = e.response ? e.response.data : e.message
        store.commit('setError', { status: true, message: error })
        store.commit('setLoading', { status: false })
        return e.response;
    }
)

export default fetch;