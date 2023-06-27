<template>
  <div class="works-list-component">
    <a-skeleton v-if="loading"/>
    <a-row :gutter="16" v-else>
      <a-col :span="6" v-for="item in list" :key="item.id" class="poster-item">
        <a-card hoverable>
          <template v-slot:cover>
            <img :src="item.coverImg"  v-if="item.coverImg" />
            <img src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png"  v-else />
            <div class="hover-item">
              <router-link :to="`/editor/${item.id}`"><a-button size="large" type="primary">继续编辑该作品</a-button></router-link>
            </div>
          </template>
          <template class="ant-card-actions" v-slot:actions>
            <router-link :to="`/editor/${item.id}`"><EditOutlined /></router-link>
            <a-dropdown >
              <EllipsisOutlined />
              <template v-slot:overlay>
                <a-menu class="overlay-dropdown">
                  <a-menu-item>
                    <a href="javascript:;" @click.prevent="copyClicked(item.id)"><CopyOutlined/> 复制</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;"  @click.prevent="deleteClicked(item.id)"><DeleteOutlined /> 删除</a>
                  </a-menu-item>
                  <a-menu-item v-if="item.coverImg">
                    <a href="javascript:;"><DownloadOutlined /> 下载图片</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <a-card-meta :title="item.title">
          </a-card-meta>
        </a-card>
        <div class="tag-list">
          <a-tag color="red" v-if="item.status === 1">
            未发布
          </a-tag>
          <a-tag color="green" v-if="item.status === 2">
            已发布
          </a-tag>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { EditOutlined, EllipsisOutlined, CopyOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { TemplateProps } from '../store/templates'
import { Modal } from 'ant-design-vue'
export default defineComponent({
  name: 'works-list',
  emits: ['on-copy', 'on-delete'],
  components: {
    EditOutlined,
    EllipsisOutlined,
    CopyOutlined,
    DeleteOutlined,
    DownloadOutlined
  },
  props: {
    list: {
      type: Array as PropType<TemplateProps[]>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    transferStatus: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const deleteClicked = (id: number) => {
      Modal.confirm({
        title: '确定要删除该作品吗？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          context.emit('on-delete', id)
        }
      })
    }
    const copyClicked = (id: number) => {
      context.emit('on-copy', id)
    }

    return {
      deleteClicked,
      copyClicked,
    }
  }
})
</script>

<style>
.poster-item {
  position: relative;
  margin-bottom: 20px;
}
.poster-item .ant-card {
  border-radius: 12px;
}
.tag-list {
  position: absolute;
  top: -4px;
  left: 6px;
}
.poster-item .ant-card-cover {
  height: 390px;
}
.poster-item .ant-card-cover > img {
  width: 100%;
}
.poster-item .ant-card-hoverable {
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
}
.poster-item .ant-card-body {
  padding: 0
}
.poster-item .ant-card-meta {
  margin: 0;
}
.poster-item .ant-card-meta-title {
  color: #333;
  padding: 10px 12px;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 0 !important;
}
.description-detail {
  display: flex;
  justify-content: space-between;
  padding: 13px 12px;
  color: #999;
}
.user-number {
  font-weight: bold;
}
.poster-title {
  height: 70px;
}
.poster-title h2 {
  margin-bottom: 0px;
}
.poster-item .ant-card-cover {
  position: relative;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.poster-item .ant-card-cover  img {
  transition: all ease-in .2s;
}
.poster-item .ant-card-cover .hover-item {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: none;
  background: rgba(0, 0, 0, .8);
  align-items: center;
  justify-content: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.poster-item:hover .hover-item {
  display: flex;
}
.poster-item:hover img {
  transform: scale(1.25);
}
.barcode-container img {
  border-radius: 0;
}
</style>
