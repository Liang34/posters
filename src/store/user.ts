import axios from "axios";
import { Module } from "vuex";


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
    picture?: string;// 头像
    gender?: string;// 性别
}

export interface UserProps {
    isLogin: boolean;
    token?: string;
    data: UserDataProps;
  }