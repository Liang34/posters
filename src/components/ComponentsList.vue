<template>
  <div class="create-component-list">
    <a-tabs>
      <a-tab-pane key="1">
        <template v-slot:tab>
          <span>
            <FieldStringOutlined />
            文本
          </span>
        </template>
        <div
          v-for="(item, index) in textList" :key="index"
          @click="onItemClick(item)" class="component-item"
        >
          <div class="component-wrapper">
            <component :is="item.name" v-bind="item.props"  :style="generateResetCss(item.name)" class="inside-component"/>
            <span v-if="item.text" class="tip-text">{{item.text}}</span>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2">
        <template v-slot:tab>
          <span>
            <FileImageOutlined />
            图片
          </span>
        </template>
        <uploader
          action="/utils/upload-img"
          @file-uploaded="(uploaded) => { handleFileUploaded(uploaded) }"
          :beforeUpload="commonUploadCheck"
        >
          <div class="uploader-container">
            <FileImageOutlined />
            <h4>上传图片</h4>
          </div>
          <template #loading>
            <div class="uploader-container">
              <LoadingOutlined spin/>
              <h4>上传中</h4>
            </div>
          </template>
          <template #uploaded>
            <div class="uploader-container">
              <FileImageOutlined/>
              <h4>上传图片</h4>
            </div>
          </template>
        </uploader>
        <div class="image-list">
          <div
            v-for="(item, index) in imageList" :key="index"
            @click="onItemClick(item)" class="component-item item-image"
          >
            <div class="component-wrapper">
              <component :is="item.name" v-bind="item.props"  :style="generateResetCss(item.name)" class="inside-component"/>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3">
        <template v-slot:tab>
          <span>
            <BuildOutlined />
            形状
          </span>
        </template>
        <div
          v-for="(item, index) in shapeList" :key="index"
          @click="onItemClick(item)" class="component-item"
        >
          <div class="component-wrapper">
            <component :is="item.name" v-bind="item.props"  :style="generateResetCss(item.name)" class="inside-component"/>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue'
import { FileImageOutlined, LoadingOutlined, FieldStringOutlined, BuildOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import Uploader from './Uploader.vue'
import { componentsDefaultProps } from '../defaultProps'
import { commonUploadCheck, imageDimensions, UploadImgProps } from '../helper'
const textDefaultProps = componentsDefaultProps['p-text'].props
const imageDefaultProps = componentsDefaultProps['p-image'].props
const shapeDefaultProps = componentsDefaultProps['p-shape'].props
interface CreateComponentType {
  name: string;
  text?: string;
  type?: string;
  props: { [key: string]: string };
}
const generateResetCss = (name: string) => {
  return {
    position: 'static',
    ...((name !== 'p-shape') && { height: '' })
  }
}
// the component name list
const textPropsList = [
  {
    text: '大标题',
    fontSize: '30px',
    fontWeight: 'bold',
    tag: 'h2'
  },
  {
    text: '楷体副标题',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: '"KaiTi","STKaiti"',
    tag: 'h2'
  },
  {
    text: '正文内容',
    tag: 'p'
  },
  {
    text: '宋体正文内容',
    tag: 'p',
    fontFamily: '"SimSun","STSong"'
  },
  {
    text: 'Arial style',
    tag: 'p',
    fontFamily: '"Arial", sans-serif'
  },
  {
    text: 'Comic Sans',
    tag: 'p',
    fontFamily: '"Comic Sans MS"'
  },
  {
    text: 'Courier New',
    tag: 'p',
    fontFamily: '"Courier New", monospace'
  },
  {
    text: 'Times New Roman',
    tag: 'p',
    fontFamily: '"Times New Roman", serif'
  },
  {
    text: '链接内容',
    color: '#1890ff',
    textDecoration: 'underline',
    tag: 'p'
  },
  {
    text: '按钮内容',
    color: '#ffffff',
    backgroundColor: '#1890ff',
    borderWidth: '1px',
    borderColor: '#1890ff',
    borderStyle: 'solid',
    borderRadius: '2px',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
    width: '100px',
    tag: 'button',
    textAlign: 'center'
  }
]
const textList: CreateComponentType[] = textPropsList.map((prop) => {
  return {
    name: 'p-text',
    props: {
      ...textDefaultProps,
      ...(prop as any)
    }
  }
})
const imgSourceList = [
  'http://poster-master.oss-cn-guangzhou.aliyuncs.com/upload-files/R-C-881385.jpg',
  'http://poster-master.oss-cn-guangzhou.aliyuncs.com/upload-files/R-C-801484.jpg',
  'http://poster-master.oss-cn-guangzhou.aliyuncs.com/upload-files/20210526104042573-518814.jpg',
  'http://poster-master.oss-cn-guangzhou.aliyuncs.com/upload-files/OIP-C-904361.jpg',
  'http://poster-master.oss-cn-guangzhou.aliyuncs.com/upload-files/OIP-C-195744.jpg',
  'http://poster-master.oss-cn-guangzhou.aliyuncs.com/upload-files/screenshot20230718-470612.png',
  'http://poster-master.oss-cn-guangzhou.aliyuncs.com/upload-files/OIP-C-895012.jpg',
  'http://poster-master.oss-cn-guangzhou.aliyuncs.com/upload-files/R-C-607634.jpg'
]
const imageList: CreateComponentType[] = imgSourceList.map((url) => {
  return {
    name: 'p-image',
    props: {
      ...imageDefaultProps,
      imageSrc: url,
      width: '150px'
    }
  }
})
const shapePropsList = [
  {
    backgroundColor: '#efefef',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    width: '100px',
    height: '50px'
  },
  {
    backgroundColor: '#efefef',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: '100px',
    width: '100px',
    height: '100px'
  },
  {
    backgroundColor: '#efefef',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    width: '100px',
    height: '100px'
  },
  {
    backgroundColor: '#36cfc9',
    width: '100px',
    height: '50px'
  },
  {
    backgroundColor: '#40a9ff',
    borderRadius: '100px',
    width: '100px',
    height: '100px'
  },
  {
    backgroundColor: '#9254de',
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    width: '100px',
    height: '100px'
  }
]
const shapeList: CreateComponentType[] = shapePropsList.map((prop) => {
  return {
    name: 'p-shape',
    props: {
      ...shapeDefaultProps,
      ...(prop as any)
    }
  }
})

export default defineComponent({
  components: {
    Uploader,
    FileImageOutlined,
    LoadingOutlined,
    FieldStringOutlined,
    BuildOutlined
  },
  name: 'components-list',
  emits: ['on-item-click'],
  setup (props, context) {
    const onItemClick = (data: CreateComponentType) => {
      if (data.type !== 'upload') {
        context.emit('on-item-click', data)
      }
    }
    const handleFileUploaded = (uploadedData: UploadImgProps) => {
      const data = {
        name: 'p-image',
        props: {
          ...imageDefaultProps
        }
      } as CreateComponentType
      message.success('上传成功')
      data.props.imageSrc = uploadedData.data.urls[0]
      imageDimensions(uploadedData.data.file).then(dimension => {
        const maxWidth = 300
        data.props.width = ((dimension.width > maxWidth) ? maxWidth : dimension.width) + 'px'
        context.emit('on-item-click', data)
      })
    }
    return {
      textList,
      imageList,
      shapeList,
      onItemClick,
      commonUploadCheck,
      handleFileUploaded,
      generateResetCss
    }
  }
})
</script>

<style>
.component-wrapper {
  width: 100px;
  position: relative;
  display: flex;
  align-items: center;
}
.tip-text {
  position: absolute;
  text-align: center;
  top: 50%;
  width: 100%;
  margin-top: -10px;
}
.inside-component {
  width: 100px !important;
}
.image-list {
  display: flex;
  flex-wrap: wrap;
  width: 220px;
  margin: 20px auto;
}
.image-list img {
  max-height: 150px;
  object-fit: contain;
}
.item-image {
  margin-right: 10px;
}
.component-item {
  margin-bottom: 15px;
  cursor: pointer;
  display: flex;
  justify-content: center;
}
.create-component-list .uploader-container {
  padding: 10px;
  color: #ffffff;
  background: #1890ff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.create-component-list .uploader-container:hover {
  background: #40a9ff;
}
.create-component-list .uploader-container h4 {
  color: #ffffff;
  margin-bottom: 0;
  margin-left: 10px;
}
.create-component-list .ant-tabs-tab {
  margin: 0;
}
.ant-tabs-tab {
  flex: 1;
}
.ant-tabs-nav-list {
  width: 100%;
}
</style>
