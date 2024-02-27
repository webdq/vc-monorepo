<template>
  <div class="page">
    <vc-earth
      :cesium-path="cesiumPath"
      :access-token="accessToken"
      statusbar
      distance
      timeline
      animation
      @viewer-ready="viewerReady"
    >
      <vc-toolbar
        toolbar-direction="vertical"
        :toolbar-btns="[
          'geocoder',
          'position',
          'layer',
          'home',
          'zoom-in',
          'zoom-out',
          'mode',
          'geolocation',
          'setting',
          'fullscreen',
          'debug'
        ]"
      ></vc-toolbar>
      <vc-drawing-plus
        ref="vcDrawingPlusRef"
        :drawing-plus-left="100"
        :drawing-plus-top="150"
        :drawing-plus-btn-tip="drawingPlusBtnTip"
        :pin-url="pinUrl"
        :billboard-url="billboardUrl"
        :model-url="modelUrl"
        @drawingBtnActive="drawingBtnActive"
        @drawingMarkerDrag="drawingMarkerDrag"
        @drawingMarkerDragEnd="drawingMarkerDragEnd"
        @drawingElComplete="drawingElComplete"
        @drawingElChange="drawingElChange"
      >
        <template #drawing-move-bar>标绘111</template>
        <template #drawing-icon-billboard>billboard</template>
        <template #drawing-icon-pin>pin</template>
        <template #drawing-icon-point>point</template>
        <template #drawing-icon-polyline>polyline</template>
        <template #drawing-icon-polygon>polygon</template>
        <template #drawing-icon-rectangle>rectangle</template>
        <template #drawing-icon-circle>circle</template>
        <template #drawing-icon-fineArrow>fineArrow</template>
        <template #drawing-icon-attackArrow>attackArrow</template>
        <template #drawing-icon-tailedAttackArrow>tailedAttackArrow</template>
        <template #drawing-icon-doubleArrow>doubleArrow</template>
        <template #drawing-icon-gatheringPlace>gatheringPlace</template>
        <template #drawing-icon-model>model</template>
        <template #drawing-icon-clear>clear</template>
      </vc-drawing-plus>
    </vc-earth>

    <graphics-attr-modal
      ref="graphicsAttrModalRef"
      @graphicsFly="graphicsFly"
      @graphicsRemove="graphicsRemove"
      @updateAttr="updateAttr"
    ></graphics-attr-modal>

    <div class="bar">
      <div>
        <a-button @click="getDrawingData">获取标绘数据</a-button>
        <a-button @click="setDrawingData">加载标绘数据</a-button>
      </div>
      <a-textarea v-model:value="drawingJson" :rows="5"></a-textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { Button as AButton, Textarea as ATextarea } from 'ant-design-vue'
import GraphicsAttrModal from '../components/graphics-attr-modal.vue'

const cesiumPath = inject<string>('cesiumPath')
const accessToken = inject<string>('accessToken')

const viewerReady = (readyObj: any) => {
  const viewer = readyObj.viewer
  window.__cesium_viewer__ = viewer
}

const pinUrl = ref('http://192.168.110.105:18888/lib/MarkImages/pin.png')
const billboardUrl = ref(
  'http://192.168.110.105:18888/lib/MarkImages/billboard.png'
)
const modelUrl = ref(
  'http://192.168.110.105:18888/lib/models/CesiumAir/Cesium_Air.glb'
)

// 标绘组件 ref
const vcDrawingPlusRef = ref()
// 标绘按钮提示文字
const drawingPlusBtnTip = ref({
  billboard: '标牌',
  pin: '标记',
  point: '点',
  polyline: '线',
  polygon: '面',
  rectangle: '矩形',
  circle: '圆',
  fineArrow: '直线箭头',
  attackArrow: '攻击箭头',
  tailedAttackArrow: '燕尾箭头',
  doubleArrow: '双箭头',
  gatheringPlace: '集结地',
  model: '模型',
  clear: '清除'
})
// 标绘JSON数据
const drawingJson = ref('')
// 获取标绘数据
const getDrawingData = () => {
  const data = vcDrawingPlusRef.value?.getDrawingData()
  drawingJson.value = JSON.stringify(data)
}
// 加载标绘数据
const setDrawingData = () => {
  const data = JSON.parse(drawingJson.value)
  vcDrawingPlusRef.value?.setDrawingData(data)
}
// 标绘按钮切换
const drawingBtnActive = (name: string, active: boolean) => {
  // console.log('drawingBtnActive', name, active)
}
// 标绘元素拖拽
const drawingMarkerDrag = (graphics: any) => {
  // console.log('drawingMarkerDrag', graphics)
  if (graphics.type === 'circle') {
    const r = graphics.entity.ellipse.semiMinorAxis.getValue(
      Cesium.JulianDate.now()
    )
    graphicsAttrModalRef.value?.vcGraphicsAttrRef?.updateFormData('radius', r)
  }
}
// 标绘元素拖拽结束
const drawingMarkerDragEnd = (graphics: any) => {
  // console.log('drawingMarkerDragEnd', graphics)
}
// 标绘完成
const drawingElComplete = (graphics: any) => {
  // console.log('drawingElComplete', graphics)
  graphics.entity.properties.addProperty('name1', 'name1')
  graphics.entity.properties.addProperty('name2', 'name2')
}
// 标绘元素切换
const drawingElChange = (graphics?: any) => {
  if (graphics) {
    graphicsAttrModalRef.value?.show(graphics)
  } else {
    graphicsAttrModalRef.value?.hide()
  }
}
// 标绘元素属性弹窗组件 ref
const graphicsAttrModalRef = ref()
// 更新标绘元素属性
const updateAttr = (
  entity: Cesium.Entity,
  type: string,
  key: string,
  value: any
) => {
  console.log('updateAttr --> ', entity, type, key, value)
}
// 飞行到标绘元素
const graphicsFly = (entity: Cesium.Entity) => {
  console.log('graphicsFly --> ', entity)
  const viewer = window.__cesium_viewer__
  viewer.flyTo(entity)
}
// 删除标绘元素
const graphicsRemove = (drawingElId: string) => {
  console.log('graphicsRemove --> ', drawingElId)
  const drawHelper = vcDrawingPlusRef.value?.getDrawHelper()
  drawHelper?.clearById(drawingElId)
}
</script>

<style scoped lang="less">
.page {
  width: 100%;
  height: 100%;
  position: relative;
  .bar {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }
}
</style>
