<template>
  <div class="editor-container">
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            <img alt="海报大师" src="../assets/logo.png" class="logo" />
          </router-link>
          <inline-edit :value="page.title" @change="titleChange" />
        </div>
        <a-menu
          :selectable="false"
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="1">
            <a-button type="primary" @click="preview">预览和设置</a-button>
          </a-menu-item>
          <a-menu-item key="2">
            <a-button type="primary" @click="saveWork" :loading="saveIsLoading"
              >保存</a-button
            >
          </a-menu-item>
          <a-menu-item key="3">
            <a-button type="primary" @click="publish" :loading="isPublishing"
              >发布</a-button
            >
          </a-menu-item>
          <a-menu-item key="4">
            <user-profile :user="userInfo"></user-profile>
          </a-menu-item>
        </a-menu>
      </a-layout-header>
    </a-layout>
    <a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <div class="sidebar-container">
          <components-list @on-item-click="addItem"></components-list>
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <!-- <history-area></history-area> -->
          <div
            class="preview-list"
            id="canvas-area"
            @click="setPageSetting"
            :class="{ active: activePanel === 'page', 'canvas-fix': canvasFix }"
          >
            <div class="body-container" :style="page.props">
              <div v-for="item in components" :key="item.id">
                <EditWrapper
                  v-if="!item.isHidden"
                  :id="item.id"
                  :editing="currentEditing"
                  @active="setActive"
                  @editing="setEditing"
                  @update-position="updatePosition"
                  :active="currentId === item.id"
                  :props="item.props"
                >
                  <component
                    :is="item.name"
                    v-bind="item.props"
                    :isEditing="true"
                  />
                </EditWrapper>
              </div>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <!-- 图层 -->
      <a-layout-sider width="300" style="background: #fff" class="settings-panel">
        <a-tabs type="card" v-model:activeKey="activePanel">
          <a-tab-pane key="component" tab="属性设置" class="no-top-radius">
            <div v-if="currentElement">
              <div v-if="!currentElement.isLocked">
                <edit-group :props="currentElement.props"></edit-group>
              </div>
              <div v-else>
                <a-empty>
                  <template #description>
                    <p>该元素被锁定，无法编辑</p>
                  </template>
                </a-empty>
              </div>
            </div>
            <div v-else>
              <a-empty>
                <template #description>
                  <p>在画布中选择元素并开始编辑</p>
                </template>
              </a-empty>
            </div>
          </a-tab-pane>
          <a-tab-pane key="layer" tab="图层设置">
            <layer-list
              :list="components" :selectedId="currentId"
              @select="(id) => { setActive(id, true) }"
              @change="handleChange"
            >
            </layer-list>
          </a-tab-pane>
          <a-tab-pane key="page" tab="页面设置">
            <div class="page-settings">
              <props-table
                :props="pageState.props" mutationName="updatePage"
                :mutationExtraData="{ level: 'props' }"
                @updated="adjustHeightOnUpload"
              >
              </props-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { GlobalDataProps } from "@/store";
import { defineComponent, computed, onMounted, nextTick, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import InlineEdit from "@/components/InlineEdit.vue";
import componentsList from "@/components/ComponentsList.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import { pickBy } from "lodash-es";
import { ComponentData } from "@/store/editor";
export type TabType = 'component' | 'layer' | 'page'
export default defineComponent({
  components: {
    InlineEdit,
    componentsList,
    EditWrapper,
  },
  setup() {
    const route = useRoute();
    const store = useStore<GlobalDataProps>();
    // 当前的海报id
    const currentWorkId = route.params.id;
    onMounted(() => {
      if (currentWorkId) {
        store.dispatch("fetchWork", currentWorkId);
      }
    });
    const titleChange = (newTitle: string) => {
      store.commit("updatePage", {
        key: "title",
        value: newTitle,
        isRoot: true,
      });
    };
    const page = computed(() => store.state.editor.page);
    const userInfo = computed(() => store.state.user);
    const components = computed(() => store.state.editor.components);
    const activePanel = ref<TabType>('component')
    // 设置当前的拖拽对象
    const setActive = (id: string, notSwitchPanel = false) => {
      store.commit("setActive", id);
      if (!notSwitchPanel) {
        activePanel.value = 'component'
      }
    };
    // 添加组件到画布中
    const addItem = (component: ComponentData) => {
      store.commit("addComponent", component);
    };
    // 更新组件信息
    const updatePosition = (data: {
      left: number;
      top: number;
      id: string;
    }) => {
      const { id } = data;
      const updatedData = pickBy<number>(data, (v, k) => k !== "id");
      const keysArr = Object.keys(updatedData);
      const valuesArr = Object.values(updatedData).map((v) => v + "px");
      store.commit("updateComponent", { key: keysArr, value: valuesArr, id });
    };
    const currentEditing = computed(() => store.state.editor.currentElement);
    const currentId = computed(() => store.state.editor.currentElement);
    const currentElement = computed<ComponentData>(() => store.getters.getCurrentElement)
    const setEditing = (id: string) => {
      store.commit("setEditing", id);
      // activePanel.value = 'component'
      nextTick(() => {
        const ele = document.querySelector(
          "#item-text textarea"
        ) as HTMLTextAreaElement;
        if (ele) {
          ele.focus();
        }
      });
    };
    return {
      currentElement,
      addItem,
      userInfo,
      page,
      titleChange,
      components,
      updatePosition,
      setActive,
      currentEditing,
      currentId,
      setEditing,
    };
  },
});
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
}
.header .logo-img {
  margin-right: 20px;
  height: 40px;
}
.page-title {
  display: flex;
}
.header h4 {
  color: #ffffff;
}
.editor-spinner {
  position: fixed;
  right: 50%;
  top: 10px;
}
.preview-container {
  padding: 24px;
  margin: 0;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
.preview-list.active {
  border: 1px solid #1890ff;
}
.preview-list.canvas-fix .l-text-component,
.preview-list.canvas-fix .l-image-component,
.preview-list.canvas-fix .l-shape-component {
  box-shadow: none !important;
}
.preview-list.canvas-fix {
  position: absolute;
  max-height: none;
}
.sidebar-container {
  padding: 20px;
}
.body-container {
  width: 100%;
  height: 100%;
  background-size: cover;
}
.page-settings {
  padding: 16px;
}
.settings-panel .ant-tabs-top-content {
  max-height: calc(100vh - 68px - 56px);
  overflow-y: auto;
}
.final-preview {
  position: absolute;
  width: calc(100% - 400px);
  height: 100%;
  background: transparent;
  top: 0;
  left: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.final-preview-inner {
  width: 430px;
  height: 870px;
  padding: 60px 28px;
  position: relative;
  /* background: url('~@/assets/phone-back.png') no-repeat; */
  background-size: cover;
}
.final-preview-inner .preview-title {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
}
.iframe-container {
  width: 100%;
  height: 706px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iframe-placeholder {
  /* background: url('~@/assets/loading.svg') 50% 50% no-repeat; */
  background-size: 50px;
}
.settings-panel .ant-list-bordered {
  border-radius: 0;
}
.settings-panel .ant-collapse {
  border-radius: 0;
}
.ant-collapse-header,
.ant-collapse-item {
  border-radius: 0 !important;
}
.settings-panel .ant-tabs-tab {
  border-radius: 0 !important;
}
</style>
