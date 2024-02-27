<template>
  <a-modal
    v-model:visible="visible"
    title="属性编辑"
    :footer="false"
    :keyboard="false"
    :mask-closable="false"
  >
    <div class="graphics-attr-wrapper">
      <vc-graphics-attr
        ref="vcGraphicsAttrRef"
        :mark-icon-images="markIconImages"
        :hide-animation-tab="hideAnimationTab"
        @graphicsFly="graphicsFly"
        @graphicsRemove="graphicsRemove"
        @updateAttr="updateAttr"
        @updateAnimationData="updateAnimationData"
        @updateAnimationPlay="updateAnimationPlay"
        @removeAnimationData="removeAnimationData"
      >
        <template #body>
          <button>button</button>
        </template>
      </vc-graphics-attr>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Modal as AModal } from 'ant-design-vue'

const emit = defineEmits([
  'graphicsFly',
  'graphicsRemove',
  'updateAttr',
  'updateAnimationData',
  'updateAnimationPlay',
  'removeAnimationData'
])

const vcGraphicsAttrRef = ref()
const visible = ref(false)
const hideAnimationTab = ref(false)

const markIconImages = ref<any[]>([
  {
    name: '一级机场',
    extension: 'png',
    image: '一级机场.png',
    imageUrl: 'http://192.168.110.105:18888/lib/MarkImages/一级机场.png'
  },
  {
    name: '三级机场',
    extension: 'png',
    image: '三级机场.png',
    imageUrl: 'http://192.168.110.105:18888/lib/MarkImages/三级机场.png'
  },
  {
    name: '三角-1',
    extension: 'png',
    image: '三角-1.png',
    imageUrl: 'http://192.168.110.105:18888/lib/MarkImages/三角-1.png'
  }
])
const updateAttr = (
  entity: Cesium.Entity,
  type: string,
  key: string,
  value: any
) => {
  emit('updateAttr', entity, type, key, value)
}
const graphicsFly = (entity: Cesium.Entity) => {
  emit('graphicsFly', entity)
}
const graphicsRemove = (drawingElId: string) => {
  hide()
  emit('graphicsRemove', drawingElId)
}
const updateAnimationData = (graphics: any, entity: any, data: any) => {
  emit('updateAnimationData', graphics, entity, data)
}
const updateAnimationPlay = (startDate: string, stopDate: string) => {
  emit('updateAnimationPlay', startDate, stopDate)
}
const removeAnimationData = (graphics: any, entity: any) => {
  emit('removeAnimationData', graphics, entity)
}
// 显示弹窗
const show = (graphics: any) => {
  visible.value = true
  nextTick(() => {
    vcGraphicsAttrRef.value?.setGraphics(graphics)
  })
}
// 关闭弹窗
const hide = () => {
  visible.value = false
}

defineExpose({
  vcGraphicsAttrRef,
  show,
  hide
})
</script>

<style scoped lang="less">
.graphics-attr-wrapper {
  height: 450px;
  overflow-y: auto;
}
</style>
