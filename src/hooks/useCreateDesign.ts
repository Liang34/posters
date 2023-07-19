import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { GlobalDataProps } from '../store/index'

function useCreateDesign () {
  const store = useStore<GlobalDataProps>()
  const router = useRouter()
  const userInfo = computed(() => store.state.user)
  const createDesign = () => {
    if (userInfo.value.isLogin) {
      const payload = {
        title: '未命名作品',
        desc: '未命名作品',
      }
      store.dispatch('createWork', payload).then(({ data }) => {
        router.push(`/editor/${data.id}`)
      })
    } else {
      router.push('/login')
    }
  }
  return createDesign
}

export default useCreateDesign
