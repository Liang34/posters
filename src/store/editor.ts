import axios from 'axios'
import { Module, Mutation } from 'vuex'
import { GlobalDataProps } from './index' 
import { RespData } from './respTypes'
// import { v4 as uuidv4 } from 'uuid'
import request from '@/service/fetch';
import { getWork } from '@/service/editor'
import { RespWorkData, ListData, RespListData } from './respTypes'

export const testComponents: ComponentData[] = [
  { id: '1', name: 'p-text', layerName:'图层1', props: { text: 'hello', fontSize: '20px', color: '#000000', 'lineHeight': '1', textAlign: 'left', fontFamily: '', width: '100px', height: '100px', backgroundColor: '#efefef', left: '100px', top: '150px' }},
  { id: 'uuidv4()', name: 'p-text', layerName:'图层2', props: { text: 'hello2', fontSize: '10px', fontWeight: 'bold', 'lineHeight': '2', textAlign: 'left', fontFamily: '' }},
  { id: 'u1uidv4()', name: 'p-text', layerName:'图层3', props: { text: 'hello3', fontSize: '15px', actionType: 'url', url: 'https://www.baidu.com', 'lineHeight': '3', textAlign: 'left', fontFamily: '' }},
  { id: 'uuiddddv4()', name: 'p-image', layerName:'图层4', props: {  src: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f3e3a17c305b1070f455202.jpg', width: '100px' }},
]
export interface ComponentData {
  // 这个元素的 属性，属性请详见下面
  props: any;
  // id，uuid v4 生成
  id: string;
  // 业务组件库名称 l-text，l-image 等等 
  name: 'p-text' | 'p-image' | 'p-shape';
  // 图层是否隐藏
  isHidden?: boolean;
  // 图层是否锁定
  isLocked?: boolean;
  // 图层名称
  layerName?: string;
}
export interface UpdateComponentData {
  key: string;
  value: string | string[];
  id: string;
  isRoot?: boolean;
}
// 编辑器的参数
export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 当前被选中的组件 id
  currentElement: string;
  // 当前正在 inline editing 的组件?????????????????????
  currentEditing: string;
  // 当然最后保存的时候还有有一些项目信息，这里并没有写出，等做到的时候再补充
  page: PageData;
  // 当前被复制的组件
  // copiedComponent?: ComponentData;
  // 当前操作的历史记录
  // histories: HistoryProps[];
  // 当前历史记录的操作位置
  historyIndex: number;
  // 开始更新时的缓存值
  cachedOldValues: any;
  // 保存最多历史条目记录数
  maxHistoryNumber: number;
  // 数据是否有修改
  isDirty: boolean;
  // 当前 work 的 channels
  // channels: ChannelProps[];
}
export interface PageProps {
  backgroundColor: string;
  backgroundImage: string;
  backgroundRepeat: string;
  backgroundSize: string;
  height: string;
}
// 当前海报的参数
export interface PageData {
  id?: number;
  props?: PageProps;
  title?: string;
  desc?: string;
  coverImg?: string;
  uuid?: string;
  setting?: { [key: string]: any };
  isTemplate?: boolean;
  isHot?: boolean;
  isNew?: boolean;
  author?: string;
  copiedCount?: number;
  status?: number;
  user? : {
    gender: string;
    nickName: string;
    picture: string;
    userName: string;
  };
}
// 查看是否存在修改
const setDirtyWrapper = (callback: Mutation<EditorProps>) => {
  return (state: EditorProps, payload: any) => {
    state.isDirty = true
    callback(state, payload)
  }
}
const pageDefaultProps = { backgroundColor: '#ffffff', backgroundImage: '', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '560px' }
const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    currentEditing: '',
    page: {
      props: pageDefaultProps,
      title: 'test title'
    },
    // histories: [],
    historyIndex: -1,
    cachedOldValues: null,
    maxHistoryNumber: 5,
    isDirty: false,
    // channels: []
  },
  mutations: {
    fetchWork(state, { data }: RespWorkData) {
      const { content, ...rest } = data
      state.page = { ...state.page, ...rest }
      if (content.props) {
        state.page.props = content.props
      }
      // state.components = content.components
    },
    updatePage: () => {
      return {}
    },
    // updatePage: setDirtyWrapper((state, { key, value, isRoot, isSetting }) => {
    //   if (isRoot) {
    //     state.page[key as keyof PageData] = value
    //   } else if (isSetting) {
    //     state.page.setting = {
    //       ...state.page.setting,
    //       [key]: value
    //     }
    //   } else {
    //     if (state.page.props) {
    //       state.page.props[key as keyof PageProps] = value
    //     }
    //   }
    // }),
    addComponent: setDirtyWrapper((state, component: ComponentData) => {
      component.layerName = '图层' + (state.components.length + 1)
      state.components.push(component)
      // pushHistory(state, {
      //   id: uuidv4(),
      //   componentId: component.id,
      //   type: 'add',
      //   data: cloneDeep(component)
      // })
    }),
    updateComponent: setDirtyWrapper((state, { key, value, id, isRoot }: UpdateComponentData) => {
      const updatedComponent = state.components.find((component) => component.id === (id || state.currentElement))
      if (updatedComponent) {
        if (isRoot) {
          // https://github.com/microsoft/TypeScript/issues/31663
          (updatedComponent as any)[key as string] = value
        } else {
          const oldValue = Array.isArray(key) ? key.map(key => updatedComponent.props[key]) : updatedComponent.props[key]
          if (!state.cachedOldValues) {
            state.cachedOldValues = oldValue
          }
          // pushHistoryDebounce(state,  { key, value, id })
          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName, index) => {
              updatedComponent.props[keyName] = value[index]
            })
          } else if (typeof key ==='string' && typeof value === 'string') {
            updatedComponent.props[key] = value
          }
        }
        
      }
    }),
    setActive (state, id) {
      state.currentElement = id
    },
  },
  actions: {
    fetchWork: ({ commit }, payload: string) => {
      getWork(payload).then(rawData => {
        commit('fetchWork', rawData )
      })
    },
    updatePage: () => {
      return {}
    },
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find((component) => component.id === state.currentElement)
    },
  }
};

export default editor;
