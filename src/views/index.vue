<template>
    <div class="homepage-container">
        <a-layout :style="{ background: '#fff' }">
            <a-layout-header class="header">
                <div class="page-title">
                    <img src='../assets/logo.png'  class="logo"/>
                    海报大师
                </div>
                <user-profile :user="user" ></user-profile>
            </a-layout-header>
            <a-layout-conternt class="home-layout">
                <router-view></router-view>
            </a-layout-conternt>
            <a-layout-footer>
                © Liang版权所有 | 津TPC备
            </a-layout-footer>
        </a-layout>
    </div>
</template>

<script lang="ts">

import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/index'
import UserProfile from '../components/UserProfile.vue'
export default defineComponent({
  name: 'Index',
  components: {
    UserProfile
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const user = computed(() => store.state.user)
    console.log(user)
    return {
      user
    }
  }
})

</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  color: #fff;
}

.logo {
    width: 25px;
    margin-right: 20px;
}
</style>