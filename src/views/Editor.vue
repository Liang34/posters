<template>
  <div class="editor" id="editor-layout-main">
    <a-spin tip="读取中" class="editor-spinner" v-if="globalStatus.loading">
    </a-spin>
    <context-menu
      @on-select="
        (id) => {
          setActive(id);
        }
      "
    />
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            <img alt="Vue logo" src="../assets/logo.png" class="logo-img" />
          </router-link>
          <input-edit :value="pageState.title" @change="titleChange">
            <h4>{{ pageState.title }}</h4>
          </input-edit>
        </div>
        <a-space class="menu">
          <a-button type="primary" @click="downLoadPoster">导出为图片</a-button>
          <a-button type="primary" @click="saveWork(true)" :loading="isSaving"
            >保存</a-button
          >
          <user-profile :user="userInfo" :smMode="true"></user-profile>
        </a-space>
      </a-layout-header>
    </a-layout>
    <a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <div class="sidebar-container">
          <components-list @on-item-click="onItemCreated"> </components-list>
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container" @mousedown="clearSelection">
          <p>画布区域</p>
          <history-area></history-area>
          <div
            class="preview-list"
            id="canvas-area"
            @click="setPageSetting"
            :class="{ active: activePanel === 'page', 'canvas-fix': canvasFix }"
          >
            <div class="body-container" :style="pageState.props">
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
      <a-layout-sider
        width="300"
        style="background: #fff"
        class="settings-panel"
      >
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
              :list="components"
              :selectedId="currentId"
              @select="
                (id) => {
                  setActive(id, true);
                }
              "
              @change="handleChange"
            >
            </layer-list>
          </a-tab-pane>
          <a-tab-pane key="page" tab="页面设置">
            <div class="page-settings">
              <props-table
                :props="pageState.props"
                mutationName="updatePage"
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
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { useStore } from "vuex";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import { message, Modal } from "ant-design-vue";
import { pickBy, mapValues } from "lodash-es";
import HistoryArea from "./HistoryArea.vue";
import EditWrapper from "../components/EditWrapper.vue";
import ComponentsList from "../components/ComponentsList.vue";
import ContextMenu from "../components/ContextMenu.vue";
import EditGroup from "../components/EditGroup.vue";
import PropsTable from "../components/PropsTable.vue";
import LayerList from "../components/LayerList.vue";
import UserProfile from "../components/UserProfile.vue";
import InputEdit from "../components/InputEdit.vue";
import mapPropsToComponents from "../propsMap";
import { GlobalDataProps } from "../store/index";
import { ComponentData } from "../store/editor";
import { initHotKeys } from "../plugins/hotKeys";
import showError from "../hooks/useShowError";
import {
  takeScreenshotAndUpload,
  UploadImgProps,
  imageDimensions,
} from "../helper";

export type TabType = "component" | "layer" | "page";
export default defineComponent({
  name: "Home",
  components: {
    EditWrapper,
    ComponentsList,
    EditGroup,
    LayerList,
    PropsTable,
    ContextMenu,
    UserProfile,
    InputEdit,
    HistoryArea,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const route = useRoute();
    const components = computed(() => store.state.editor.components);
    const currentId = computed(() => store.state.editor.currentElement);
    const currentEditing = computed(() => store.state.editor.currentEditing);
    const currentElement = computed<ComponentData>(
      () => store.getters.getCurrentElement
    );
    const userInfo = computed(() => store.state.user);
    const pageState = computed(() => store.state.editor.page);
    const isDirty = computed(() => store.state.editor.isDirty);
    const isChangedNotPublished = computed(
      () => store.state.editor.isChangedNotPublished
    );
    const globalStatus = computed(() => store.state.status);
    const visible = ref(false);
    const showModal = ref(false);
    const canvasFix = ref(false);
    const activePanel = ref<TabType>("component");
    // add status for saving and publishing
    const isSaving = ref(false);
    const isPublishing = ref(false);
    initHotKeys();
    showError();
    const currentWorkId = route.params.id;
    let timer: any;
    const previewURL = ref<File>();
    // 保存作品
    const saveWork = (showMessage = false) => {
      isSaving.value = true;
      return store
        .dispatch("saveWork", { id: currentWorkId })
        .then(() => {
          if (showMessage) {
            message.success("保存成功", 2);
          }
        })
        .finally(() => {
          isSaving.value = false;
        });
    };
    const takeScreenUpdate = async (checkSave = false) => {
      // remove select condition
      store.commit("setActive", "");
      activePanel.value = "component";
      // remove box shadow to fix html2canvas issue
      canvasFix.value = true;
      await nextTick();
      try {
        const rawData = await takeScreenshotAndUpload("canvas-area");
        if (rawData) {
          previewURL.value = rawData?.file;
          store.commit("updatePage", {
            key: "coverImg",
            value: rawData?.data.urls[0],
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        canvasFix.value = false;
        if (checkSave) {
          saveWork();
        }
      }
    };
    const downLoadPoster = () => {
      takeScreenUpdate().then(() => {
        if (previewURL.value) {
          const blob = new Blob([previewURL.value], {
            type: previewURL.value.type,
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = previewURL.value.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        // downloadImage(previewURL.value)
      });
    };
    onMounted(() => {
      // clear the editor store data
      store.commit("resetEditor");
      // fetch work
      if (currentWorkId) {
        store.dispatch("getWork", currentWorkId);
      }
      // start autoSave timer, per 30 secs
      timer = setInterval(() => {
        if (isDirty.value) {
          saveWork();
        }
      }, 1000 * 30);
    });
    onUnmounted(() => {
      clearInterval(timer);
    });
    onBeforeRouteLeave((to, from, next) => {
      // 离开之前截图并保存
      // 未保存，截图保存
      if (isDirty.value) {
        Modal.confirm({
          title: "作品还未保存，是否保存？",
          okText: "保存",
          okType: "primary",
          cancelText: "不保存",
          onOk: () => {
            takeScreenUpdate(true).then(() => {
              next();
            });
          },
          onCancel() {
            next();
          },
        });
        // 有修改但是未发布 截图保存
      } else if (isChangedNotPublished.value) {
        takeScreenUpdate(true).then(() => {
          next();
        });
      } else {
        next();
      }
    });
    watch(activePanel, (newValue) => {
      if (newValue !== "component") {
        store.commit("setActive", "");
      }
    });
    const onItemCreated = (component: ComponentData) => {
      // we should copy this props, not pass by ref
      store.commit("addComponentToEditor", {
        name: component.name,
        props: { ...component.props },
      });
    };
    const setActive = (id: string, notSwitchPanel = false) => {
      store.commit("setActive", id);
      if (!notSwitchPanel) {
        activePanel.value = "component";
      }
    };
    const setEditing = (id: string) => {
      store.commit("setEditing", id);
      activePanel.value = "component";
      nextTick(() => {
        const ele = document.querySelector(
          "#item-text textarea"
        ) as HTMLTextAreaElement;
        if (ele) {
          ele.focus();
        }
      });
    };
    const handleChange = (data: any) => {
      store.commit("updateComponent", data);
    };
    const setPageSetting = (e: Event) => {
      const currentTarget = e.target as HTMLElement;
      if (currentTarget.classList.contains("body-container")) {
        store.commit("setActive", "");
        activePanel.value = "page";
      }
    };
    // clear component or page selection when clicking the gray area
    const clearSelection = (e: Event) => {
      const currentTarget = e.target as HTMLElement;
      if (currentTarget.classList.contains("preview-container")) {
        store.commit("setActive", "");
        activePanel.value = "page";
      }
    };
    const updatePosition = (data: {
      left: number;
      top: number;
      id: string;
      width: number;
      height: number;
    }) => {
      const { id } = data;
      const newPair = mapValues(
        pickBy(data, (v, k) => k !== "id"),
        (value) => {
          return value + "px";
        }
      );
      const keysArr = Object.keys(newPair);
      const valuesArr = Object.values(newPair);
      store.commit("updateComponent", {
        key: keysArr,
        value: valuesArr,
        id,
        isProps: true,
      });
    };
    const titleChange = (newTitle: string) => {
      store.commit("updatePage", { key: "title", value: newTitle });
      nextTick(() => {
        saveWork();
      });
    };
    const adjustHeightOnUpload = (event: {
      data: UploadImgProps;
      key: string;
    }) => {
      // check the key is background and data is correct
      if (event.key === "backgroundImage") {
        imageDimensions(event.data.file).then((dimension) => {
          const maxWidth = 375;
          const rate = dimension.height / dimension.width;
          if (rate > 1) {
            store.commit("updatePage", {
              key: "height",
              value: rate * maxWidth + "px",
              level: "props",
            });
          }
        });
      }
    };
    return {
      previewURL,
      visible,
      showModal,
      onItemCreated,
      handleChange,
      components,
      setActive,
      setEditing,
      currentId,
      currentElement,
      currentEditing,
      mapPropsToComponents,
      updatePosition,
      setPageSetting,
      activePanel,
      pageState,
      userInfo,
      globalStatus,
      saveWork,
      downLoadPoster,
      titleChange,
      clearSelection,
      adjustHeightOnUpload,
      canvasFix,
      isSaving,
      isPublishing,
    };
  },
});
</script>

<style>
.prev {
  visibility: hidden;
}
.menu {
  display: flex;
  align-items: center;
}
.ant-btn {
  border-radius: 20px;
}
.settings-panel .ant-tabs-content-holder {
  max-height: calc(100vh - 124px);
  overflow-y: auto;
}
.ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover {
  background-color: transparent;
}
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
.preview-list.canvas-fix .p-text-component,
.preview-list.canvas-fix .p-image-component,
.preview-list.canvas-fix .p-shape-component {
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
