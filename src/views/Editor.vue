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
          组件列表
          <components-list
            :list="defaultTextTemplates"
            @onItemClick="addItem"
          />
          <img id="test-image" :style="{ width: '300px' }" />
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <!-- <history-area></history-area> -->
          <div
            class="preview-list"
            id="canvas-area"
            :class="{ 'canvas-fix': canvasFix }"
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
              <!-- <edit-wrapper
                @setActive="setActive"
                @update-position="updatePosition"
                v-for="component in components"
                :key="component.id"
                :id="component.id"
                :hidden="component.isHidden"
                :props="component.props"
                :active="component.id === (currentElement && currentElement.id)"
              >
                <component :is="component.name" v-bind="component.props" />
              </edit-wrapper> -->
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        width="300"
        style="background: #fff"
        class="settings-panel"
      >
        图层模块
        <!-- <a-tabs type="card" v-model:activeKey="activePanel">
            <a-tab-pane key="component" tab="属性设置" class="no-top-radius">
              <div v-if="currentElement">
              <edit-group
                v-if="!currentElement.isLocked"
                :props="currentElement.props"
                @change="handleChange"
              ></edit-group>
              <div v-else>
                <a-empty>
                  <template #description>
                    <p>该元素被锁定，无法编辑</p>
                  </template>
                </a-empty>
              </div>
              </div>
              <pre>
                {{currentElement && currentElement.props}}
              </pre>
            </a-tab-pane>
            <a-tab-pane key="layer" tab="图层设置">
              <layer-list
                :list="components"
                :selectedId="currentElement && currentElement.id"
                @change="handleChange"
                @select="setActive"
              >
              </layer-list>
            </a-tab-pane>
            <a-tab-pane key="page" tab="页面设置">
              <props-table :props="page.props" @change="pageChange"></props-table>
            </a-tab-pane>
          </a-tabs> -->
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { GlobalDataProps } from "@/store";
import { defineComponent, computed, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import InlineEdit from "@/components/InlineEdit.vue";
import defaultTextTemplates from "../defaultTemplates";
import componentsList from "@/components/ComponentsList.vue";
import PText from "@/components/P-TEXT.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import { pickBy } from "lodash-es";

export default defineComponent({
  components: {
    InlineEdit,
    componentsList,
    PText,
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
    // 设置当前的拖拽对象
    const setActive = (id: string, notSwitchPanel = false) => {
      store.commit('setActive', id)
      if (!notSwitchPanel) {
        // activePanel.value = 'component'
      }
    }
    // 添加组件到画布中
    const addItem = (component: unknown) => {
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
    const currentEditing = computed(() => store.state.editor.currentElement)
    const currentId = computed(() => store.state.editor.currentElement)
    const setEditing = (id: string) => {
      store.commit('setEditing', id)
      // activePanel.value = 'component'
      nextTick(() => {
        const ele = document.querySelector('#item-text textarea') as HTMLTextAreaElement
        if (ele) {
          ele.focus()
        }
      })
    }
    return {
      addItem,
      userInfo,
      page,
      titleChange,
      components,
      defaultTextTemplates,
      updatePosition,
      setActive,
      currentEditing,
      currentId,
      setEditing
    };
  },
});
</script>

<style>
.editor-container .preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.editor-container .preview-list {
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
.page-title {
  display: flex;
}
.page-title .inline-edit span {
  font-weight: 500;
  margin-left: 10px;
  font-size: 16px;
}
.preview-list.canvas-fix .edit-wrapper > * {
  box-shadow: none !important;
}
.preview-list.canvas-fix {
  position: absolute;
  max-height: none;
}
</style>
