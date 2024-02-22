<template>
  <div class="graphics-attr">
    <div class="ga-header">
      <a-space>
        <a-button type="primary" @click="handleFly">
          <template #icon><send-outlined /></template>
          <span>飞行到标绘元素</span>
        </a-button>

        <a-button type="primary" @click="handleRemove">
          <template #icon><delete-outlined /></template>
          <span>删除标绘元素</span>
        </a-button>
      </a-space>
    </div>
    <div class="ga-body">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane v-for="item in tabs" :key="item.value" :tab="item.label">
        </a-tab-pane>
      </a-tabs>

      <template v-if="showGraphicsAttrTab">
        <component
          :is="componentId"
          v-model:data="formData"
          :mark-icon-images="markIconImages"
          @updateAttr="updateAttr"
        ></component>
      </template>
      <template v-if="showTextAttrTab">
        <label-graphics-attrs
          v-model:data="labelData"
          @updateAttr="updateAttr"
        ></label-graphics-attrs>
      </template>
      <template v-if="showAnimationTab">
        <animation-effect
          v-model:data="animationData"
          :graphics-type="type"
          @saveClick="saveAnimationClick"
          @previewClick="previewAnimationClick"
          @removeClick="removeAnimationClick"
        ></animation-effect>
      </template>
      <template v-if="showModelTab">
        <model-entity
          v-model:model-position-data="modelPositionData"
          v-model:model-orientation-data="modelOrientationData"
          v-model:frustum-data="frustumData"
          @update:modelPositionData="updateModelPositionData"
          @update:modelOrientationData="updateModelOrientationData"
          @update:frustumData="updateFrustumData"
        ></model-entity>
      </template>
      <template v-if="showSignalLineTab">
        <signal-line
          v-model:data="signalLineData"
          @saveClick="saveSignalLineClick"
          @previewClick="previewSignalLineClick"
          @removeClick="removeSignalLineClick"
        ></signal-line>
      </template>
      <template v-if="showMovementTab">
        <movement-path
          v-model:data="movementData"
          @saveClick="saveMovementPathClick"
          @previewClick="previewMovementPathClick"
          @removeClick="removeMovementPathClick"
        ></movement-path>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Space as ASpace, Button as AButton } from 'ant-design-vue'
import { SendOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import LabelGraphicsAttrs from './graphics/label-attr.vue'
import PinGraphicsAttrs from './graphics/pin-attr.vue'
import PointGraphicsAttrs from './graphics/point-attr.vue'
import PolylineGraphicsAttrs from './graphics/polyline-attr.vue'
import PolygonGraphicsAttrs from './graphics/polygon-attr.vue'
import CircleGraphicsAttrs from './graphics/circle-attr.vue'
import RectangleGraphicsAttrs from './graphics/rectangle-attr.vue'
import ModelGraphicsAttrs from './graphics/model-attr.vue'
import AnimationEffect from './components/animation-effect.vue'
import ModelEntity from './components/model-entity.vue'
import SignalLine from './components/signal-line.vue'
import MovementPath from './components/movement-path.vue'
import { graphicsAttrProps, graphicsAttrEmits } from './graphics-attr'
import { useTab } from './hooks/use-tab'
import { useGraphics } from './hooks/use-graphics'

const GraphicsMap = {
  label: LabelGraphicsAttrs,
  billboard: PinGraphicsAttrs,
  pin: PinGraphicsAttrs,
  point: PointGraphicsAttrs,
  polyline: PolylineGraphicsAttrs,
  polygon: PolygonGraphicsAttrs,
  circle: CircleGraphicsAttrs,
  rectangle: RectangleGraphicsAttrs,
  model: ModelGraphicsAttrs
}

defineOptions({
  name: 'VcGraphicsAttr'
})

const emit = defineEmits(graphicsAttrEmits)

const props = defineProps(graphicsAttrProps)

const {
  type,
  activeKey,
  tabs,
  setTabByIndex,
  setTabByKey,
  updateType,
  showGraphicsAttrTab,
  showTextAttrTab,
  showAnimationTab,
  showModelTab,
  showSignalLineTab,
  showMovementTab
} = useTab(props)

const {
  updateGraphics,
  formData,
  labelData,
  animationData,
  frustumData,
  modelPositionData,
  modelOrientationData,
  movementData,
  signalLineData,
  updateFormData,
  updateModelPositionData,
  updateModelOrientationData,
  updateFrustumData,
  updateAttr,
  handleFly,
  handleRemove,
  removeAnimationClick,
  previewAnimationClick,
  saveAnimationClick,
  saveMovementPathClick,
  previewMovementPathClick,
  removeMovementPathClick,
  saveSignalLineClick,
  previewSignalLineClick,
  removeSignalLineClick
} = useGraphics(props, emit)

// 设置标绘元素
const setGraphics = (drawingEl: any) => {
  updateType(drawingEl.type)
  updateGraphics(drawingEl)
}

// 标绘元素类型对应的组件
const componentId = computed(
  () =>
    GraphicsMap[type.value as keyof typeof GraphicsMap] || PolygonGraphicsAttrs
)

defineExpose({
  setTabByIndex,
  setTabByKey,
  setGraphics,
  updateFormData
})
</script>

<style lang="less" scoped>
.graphics-attr {
  .ga-header {
    margin-bottom: 10px;
    text-align: right;
  }
  .ga-body {
  }
}
</style>
