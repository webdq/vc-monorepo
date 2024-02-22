<template>
  <div ref="drawingPlusRef" class="drawing-plus" :style="style">
    <div class="drawing-btn-wrapper">
      <div
        v-if="drawingMoveBar"
        ref="drawingPlusMoveBarRef"
        class="drawing-move-bar"
      >
        <slot v-if="$slots['drawing-move-bar']" name="drawing-move-bar"></slot>
        <span v-else>标绘</span>
      </div>
      <div class="drawing-btn-group">
        <a-tooltip
          v-for="item in drawingBtnList"
          :key="item.name"
          :title="item.tip"
          placement="right"
        >
          <a-button
            :class="[
              'drawing-btn',
              btnActiveName === item.name ? 'drawing-btn-active' : ''
            ]"
            @click="drawingBtnToggle(item.name)"
          >
            <slot
              v-if="$slots[`drawing-icon-${item.name}`]"
              :name="`drawing-icon-${item.name}`"
            ></slot>
            <Icon v-else :icon="item.icon"></Icon>
          </a-button>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'
import { Button as AButton, Tooltip as ATooltip } from 'ant-design-vue'
import { useVueCesium } from 'vue-cesium'
import { useDrawingPlusBtn, useElDraggable } from './use-drawing-plus'
import { drawingPlusProps } from './drawing-plus'
import DrawHelper from '@webdq/vc-draw-helper'
import type {
  GraphicsEntityOptions,
  GraphicsJsonData,
  GraphicsType
} from '@webdq/vc-draw-helper'
import { Icon } from '@iconify/vue'
import { useParentElement } from '@vueuse/core'

const emit = defineEmits([
  'drawingBtnActive',
  'drawingMarkerDrag',
  'drawingMarkerDragEnd',
  'drawingElUpdate',
  'drawingElComplete',
  'drawingElChange'
])

const props = defineProps(drawingPlusProps)

defineOptions({
  name: 'VcDrawingPlus'
})

const $vc = useVueCesium()

// 标绘工具
let drawHelper: DrawHelper
// 标绘外层 ref
const drawingPlusRef = ref<HTMLDivElement>()
// 标绘移动条 ref
const drawingPlusMoveBarRef = ref<HTMLDivElement>()
const drawingPlusParentRef = useParentElement(
  drawingPlusRef
) as Ref<HTMLDivElement>
// 标绘显示的按钮
const { drawingBtnList } = useDrawingPlusBtn(props)
// 标绘组件拖拽
const { style } = useElDraggable(
  drawingPlusParentRef,
  drawingPlusRef,
  drawingPlusMoveBarRef,
  props.drawingPlusLeft,
  props.drawingPlusTop
)
// 当前激活的按钮
const btnActiveName = ref<string>()
// 处理开始绘制
const handleStartDrawing = (type: string, options?: GraphicsEntityOptions) => {
  drawHelper?.startDrawing(type, options)
}
// 处理结束绘制
const handleStopDrawing = () => {
  drawHelper?.stopDrawing()
}
// 切换标绘按钮
const drawingBtnToggle = (name?: string, options?: GraphicsEntityOptions) => {
  const active = name !== btnActiveName.value
  if (name === 'clear') {
    btnActiveName.value = undefined
    handleStopDrawing()
    drawingClearClick()
    emit('drawingBtnActive', name, false)
  } else if (name && active) {
    btnActiveName.value = name
    handleStartDrawing(name, options)
    emit('drawingBtnActive', name, active)
  } else {
    btnActiveName.value = undefined
    handleStopDrawing()
    emit('drawingBtnActive', name, active)
  }
}
// 清空绘制
const drawingClearClick = () => {
  drawHelper?.clear()
}
// 初始化绘制
const drawInit = async () => {
  const readyObj = await $vc.creatingPromise
  const viewer = readyObj.viewer
  if (!viewer) return
  drawHelper = new DrawHelper(viewer, {
    modelUrl: props.modelUrl,
    pinUrl: props.pinUrl,
    billboardUrl: props.billboardUrl,
    onMarkerDrag: (graphics: GraphicsType) => {
      emit('drawingMarkerDrag', graphics)
    },
    onMarkerDragEnd: (graphics: GraphicsType) => {
      emit('drawingMarkerDragEnd', graphics)
      if (graphics.isComplete) {
        emit('drawingElUpdate', graphics)
      }
    },
    onChange: (graphics?: GraphicsType) => {
      emit('drawingElChange', graphics)
    },
    onComplete: (graphics: GraphicsType) => {
      drawingBtnToggle(undefined)
      emit('drawingElComplete', graphics)
    }
  })
}

// 获取图形数据
const getDrawingData = () => {
  const data = drawHelper?.getData()
  return data
}
// 加载图形数据
const setDrawingData = (data: GraphicsJsonData[]) => {
  const graphics = drawHelper?.loadData(data)
  return graphics
}
// 清空
const clear = (types?: string | string[]) => {
  drawHelper?.clear(types)
}
// 获取标绘工具
const getDrawHelper = () => {
  return drawHelper
}

onMounted(async () => {
  await drawInit()
})
onBeforeUnmount(() => {
  drawHelper?.destroy()
})

defineExpose({
  drawingBtnToggle,
  getDrawHelper,
  getDrawingData,
  setDrawingData,
  clear
})
</script>

<style lang="less" scoped>
.drawing-plus {
  --drawing-bar-bg-color: rgba(4, 92, 217, 0.7);
  --drawing-btn-bg-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  z-index: 1;
  .drawing-btn-wrapper {
    border: 1px solid var(--drawing-bar-bg-color);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    width: 30px;
    .drawing-move-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      min-height: 35px;
      padding: 2px;
      background-color: var(--drawing-bar-bg-color);
      color: #fff;
      border: 0;
      border-radius: 0;
      font-size: 12px;
      text-align: center;
      cursor: move;
    }
    .drawing-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 30px;
      padding: 4px;
      background-color: var(--drawing-btn-bg-color);
      color: #fff;
      border: 0;
      border-radius: 0;
      font-size: 16px;
      & + .drawing-btn {
        border-top: 1px solid var(--drawing-bar-bg-color);
      }
      &.drawing-btn-active {
        background-color: var(--drawing-bar-bg-color);
      }
    }
  }
}
</style>
