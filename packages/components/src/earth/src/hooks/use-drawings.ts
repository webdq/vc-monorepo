import { ref, computed, type SetupContext } from 'vue'
import type {
  VcDrawingActiveEvt,
  VcDrawingDrawEvt,
  VcDrawingEditorEvt,
  VcDrawingMouseEvt
} from 'vue-cesium/es/utils/drawing-types'
import { EarthProps, EarthEmits, DrawingsBtn, DrawingsBtnType } from '../earth'

export const defaultDrawingsBtns: DrawingsBtn[] = [
  {
    name: 'pin',
    tip: '绘制图标点',
    icon: 'vc-icons-drawing-pin'
  },
  {
    name: 'point',
    tip: '绘制点',
    icon: 'vc-icons-drawing-point'
  },
  {
    name: 'polyline',
    tip: '绘制线',
    icon: 'vc-icons-drawing-polyline'
  },
  {
    name: 'polygon',
    tip: '绘制面',
    icon: 'vc-icons-drawing-polygon'
  },
  {
    name: 'rectangle',
    tip: '绘制矩形',
    icon: 'vc-icons-drawing-rectangle'
  },
  {
    name: 'circle',
    tip: '绘制圆',
    icon: 'vc-icons-drawing-circle'
  },
  {
    name: 'clear',
    tip: '清除绘制结果',
    icon: 'vc-icons-clear'
  }
]

export const useDrawings = (
  props: EarthProps,
  emit: SetupContext<EarthEmits>['emit']
) => {
  // 标绘按钮激活名称
  const drawingsBtnActiveName = ref<string>()
  // 标绘按钮列表
  const drawingsBtnList = computed<DrawingsBtn[]>(() => {
    const btns = defaultDrawingsBtns
      .filter((item) => {
        return props.drawingsBtns.includes(item.name as DrawingsBtnType)
      })
      .map((item) => {
        const tip = props?.drawingsBtnTip?.[item.name] ?? item.tip
        const icon = props?.drawingsBtnIcon?.[item.name] ?? item.icon
        return { ...item, tip, icon }
      })
    return btns
  })
  // 标绘按钮名称
  const drawingsBtnName = computed<any[]>(() =>
    drawingsBtnList.value
      .map((item) => item.name)
      .filter((item) => item !== 'clear')
  )

  // 标绘组件外层 ref
  const drawingsWrapperRef = ref<HTMLDivElement>()
  // 拖拽条 ref
  const drawingsMoveBarRef = ref<HTMLDivElement>()
  // 标绘组件 ref
  const drawingsRef = ref()

  // 标绘按钮切换
  const drawingsBtnToggle = (name?: string) => {
    const active = name !== drawingsBtnActiveName.value
    if (name === 'clear') {
      drawingsBtnActiveName.value = undefined
      drawingsRef.value?.clearAll()
    } else if (name && active) {
      drawingsBtnActiveName.value = name
      drawingsRef.value?.toggleAction(name)
      drawingsRef.value?.activate()
    } else {
      drawingsBtnActiveName.value = undefined
      drawingsRef.value?.toggleAction(name)
      drawingsRef.value?.deactivate()
    }
  }

  // 绘制时触发
  const drawingsDrawEvt = (evt: VcDrawingDrawEvt, viewer: Cesium.Viewer) => {
    if (evt.finished && props.drawingsMode === 1) {
      drawingsBtnActiveName.value = undefined
    }
    emit('drawings-draw-evt', evt, viewer)
  }
  // 点击编辑按钮时触发
  const drawingsEditorEvt = (
    evt: VcDrawingEditorEvt,
    viewer: Cesium.Viewer
  ) => {
    emit('drawings-editor-evt', evt, viewer)
  }
  // 鼠标移进、移除绘制点时触发
  const drawingsMouseEvt = (evt: VcDrawingMouseEvt, viewer: Cesium.Viewer) => {
    emit('drawings-mouse-evt', evt, viewer)
  }
  // 切换绘制 Action 时触发
  const drawingsActiveEvt = (
    evt: VcDrawingActiveEvt,
    viewer: Cesium.Viewer
  ) => {
    emit('drawings-active-evt', evt, viewer)
  }
  // 清除绘制时触发
  const drawingsClearEvt = (evt: object, viewer: Cesium.Viewer) => {
    emit('drawings-clear', evt, viewer)
  }

  return {
    drawingsBtnActiveName,
    drawingsBtnList,
    drawingsBtnName,
    drawingsRef,
    drawingsBtnToggle,
    drawingsWrapperRef,
    drawingsMoveBarRef,
    drawingsDrawEvt,
    drawingsEditorEvt,
    drawingsMouseEvt,
    drawingsActiveEvt,
    drawingsClearEvt
  }
}
