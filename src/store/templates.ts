/**
 * 作品模板
 */
import { Module } from 'vuex'
import { GlobalDataProps, } from './index'
import { getTemplate } from '@/service/template';
// import { RespListData, RespData } from './respTypes'
// import { PageData } from './editor'
// any --- pageData
export type TemplateProps = Required<Omit<any, 'props' | 'setting'>>

export interface TemplatesProps {
  data: TemplateProps[];
  totalTemplates: number;
  works: TemplateProps[];
  totalWorks: number;
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: [],
    totalTemplates: 0,
    works: [],
    totalWorks: 0
  },
  mutations: {
    fetchTemplates(state, rawData: any) {
      const { count, list } = rawData.data
      state.data = [ ...state.data, ...list ]
      state.totalTemplates = count
    },
    fetchWorks(state, rawData: any) {
      const { count, list } = rawData.data
      state.works = list
      state.totalWorks = count
    },
    fetchTemplate(state, rawData: any) {
      state.data = [rawData.data]
    }
  },
  actions: {
    // fetchTemplates: actionWrapper('/templates', 'fetchTemplates'),
    // fetchWorks: actionWrapper('/works', 'fetchWorks'),
    fetchWorks: ({ commit }, payload) => {
      return getTemplate(payload).then(rawData => {
        commit('fetchWorks', rawData)
      })
    }
    // fetchTemplate: actionWrapper('/templates/:id', 'fetchTemplate')
  },
  getters: {
    getTemplateById: (state, getters, rootState) => (id: number) => {
      return state.data.find(t => t.id === id)
    }
  }
}

export default templates