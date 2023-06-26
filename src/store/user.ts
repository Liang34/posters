import axios from 'axios'
import { Module } from 'vuex'
import { GlobalDataProps } from './index' 
import { RespData } from './respTypes'
import { getUserInfo, login } from '@/service/user'
import request from '@/service/fetch';

// 用户信息
export interface UserDataProps {
  username?: string;
  id?: string;
  phoneNumber?: string;
  nickName?: string;
  description?: string;
  updatedAt?: string;
  createdAt?: string;
  iat?: number;
  exp?: number;
  picture?: string;
  gender?: string;
}

// 用户状态
export interface UserProps {
  isLogin: boolean;
  token?: string;
  data: UserDataProps;
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
    data: {},
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    login(state, rawData: RespData<{ token: string }>) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      request.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    fetchCurrentUser(state, rawData: RespData<UserDataProps>) {
      state.isLogin = true
      state.data = { ...rawData.data }
    },
    logout(state) {
      state.token = ''
      state.isLogin = false
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    login: ({ commit }, payload) => {
      return login(payload).then(rawData => {
        commit('login', rawData);
      })
    },
    fetchCurrentUser: ({ commit }) => {
        return getUserInfo().then(rawData => {
            commit('fetchCurrentUser', rawData);
        })
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        console.log('hello')
        return dispatch('fetchCurrentUser')
      })
    }   
  }
};

export default user;
