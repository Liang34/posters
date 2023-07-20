<template>
  <div class="homepage-container">
    <div class="content-container">
      <div class="my-works" v-if="isLogin && works.length > 0">
        <a-row
          type="flex"
          style="display: flex;"
          justify="space-between"
          align="middle"
          class="content-title"
        >
          <h2>我的作品</h2>
          <router-link to="/mywork">查看我的所有作品</router-link>
        </a-row>
        <a-row :gutter="16">
          <template-list :list="works"></template-list>
        </a-row>
      </div>
      <div class="create-works" v-else>
        <h2>暂无作品</h2>
        <a-button type="primary" size="large" @click="createDesign">
          创建你的第一个设计 🎉
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from "vue";
import { useStore } from "vuex";
import { GlobalDataProps } from "../store/index";
import TemplateList from "../components/TemplateList.vue";
import useLoadMore from "../hooks/useLoadMore";
import useCreateDesign from '../hooks/useCreateDesign'
export default defineComponent({
  components: {
    TemplateList,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const searchText = ref("");
    const isLogin = computed(() => store.state.user.isLogin);
    const works = computed(() => store.state.works.works);
    const templates = computed(() => store.state.works.templates);
    const total = computed(() => store.state.works.totalTemplates);
    const loading = computed(() => store.state.status.loading);
    const currentSearchText = computed(() => store.state.works.searchText);
    const createDesign = useCreateDesign()
    const { loadMorePage, isLastPage } = useLoadMore("fetchTemplates", total, {
      pageIndex: 0,
      pageSize: 8,
      title: searchText.value,
    });
    const onSearch = () => {
      const title = searchText.value.trim();
      if (title !== "" || currentSearchText.value !== "") {
        store.dispatch("fetchTemplates", { title, pageIndex: 0, pageSize: 8 });
      }
    };
    const clearSearch = () => {
      store.dispatch("fetchTemplates", {
        title: "",
        pageIndex: 0,
        pageSize: 8,
      });
    };
    onMounted(() => {
      if (isLogin.value) {
        store.dispatch("fetchWorks", { pageIndex: 0, pageSize: 4 });
      }
      store.dispatch("fetchTemplates", { pageIndex: 0, pageSize: 8 });
    });
    return {
      isLogin,
      works,
      templates,
      loadMorePage,
      loading,
      isLastPage,
      searchText,
      onSearch,
      currentSearchText,
      clearSearch,
      createDesign
    };
  },
});
</script>

<style>
.ant-row{
  display: block;
}
.create-works {
  height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.banner {
  display: flex;
  position: relative;
  height: 450px;
  width: 100%;
  overflow: hidden;
}
.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.banner-text {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.banner-text .ant-input-search {
  width: 40%;
  box-shadow: 0px 12px 24px 0px rgba(30, 29, 32, 0.8);
}
.banner-text .ant-input {
  height: 40px;
  font-size: 17px;
  padding: 7px 15px;
  padding-right: 30px;
  border: 2px solid #3e7fff;
  border-right-width: 0px;
}
.banner-text .ant-input-search-button {
  height: 40px;
  border: 2px solid #3e7fff;
  border-left-width: 0px;
  display: flex;
  align-items: center;
}
.banner-text .ant-input-search-button svg {
  font-size: 25px;
}
.text-headline {
  text-shadow: 0 0 1px rgba(68, 92, 116, 0.02), 0 2px 8px rgba(57, 76, 96, 0.15);
  font-size: 2rem;
}
.text-link {
  color: #ffffff;
}
.text-link:hover {
  color: #ffffff;
  text-decoration: underline;
}
.feature-item {
  text-align: center;
  padding: 20px 0;
}
.feature-item .anticon {
  font-size: 60px;
}
.feature-item p {
  color: #666;
}
.feature-item h3 {
  margin: 5px 0;
  font-size: 19px;
  color: #333;
}
.welcome-container {
  background: #f2f2f2;
}
.welcome-container-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.hot-title {
  margin: 0 auto;
  padding: 20px 0;
}
.hot-title p {
  text-align: center;
  font-size: 16px;
  color: #666;
}
.hot-template {
  font-size: 22px;
  color: #333;
}
.hot-template::before,
.hot-template::after {
  content: "";
  display: inline-block;
  width: 57px;
  height: 1px;
  margin: 0 26px;
  background-color: #d8d8d8;
  vertical-align: middle;
}
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.poster-item {
  position: relative;
  margin-bottom: 20px;
}
.content-title {
  min-height: 70px;
}
.content-title h2 {
  margin-bottom: 0px;
}
</style>
