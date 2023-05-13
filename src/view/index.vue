<template>
    <div class="homepage-container">
        <a-layout :style="{ background: '#fff' }">
            <a-layout-header class="header">
                <div class="page-title">
                    <img src='../assets/logo.png'  class="logo"/>
                    海报大师
                </div>
                <user-profile ></user-profile>
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

import { defineComponent } from 'vue';
import UserProfile from '@/components/UserProfile.vue';

export default defineComponent({
    name: 'index',
    components: {
        UserProfile
    }
});
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