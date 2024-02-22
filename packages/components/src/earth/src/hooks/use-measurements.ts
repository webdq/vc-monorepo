import { ref, computed, type SetupContext } from 'vue'
import type {
  VcDrawingActiveEvt,
  VcDrawingDrawEvt,
  VcDrawingEditorEvt,
  VcDrawingMouseEvt
} from 'vue-cesium/es/utils/drawing-types'
import type {
  EarthProps,
  EarthEmits,
  MeasurementsBtn,
  MeasurementsBtnType
} from '../earth'

export const defaultMeasurementsBtns: MeasurementsBtn[] = [
  {
    name: 'distance',
    tip: '距离量算',
    icon: 'vc-icons-measure-distance'
  },
  {
    name: 'component-distance',
    tip: '三角量算',
    icon: 'vc-icons-measure-component-distance'
  },
  {
    name: 'polyline',
    tip: '折线距离量算',
    icon: 'vc-icons-measure-polyline-distance'
  },
  {
    name: 'horizontal',
    tip: '水平距离量算',
    icon: 'vc-icons-measure-horizontal-distance'
  },
  {
    name: 'vertical',
    tip: '垂直距离量算',
    icon: 'vc-icons-measure-vertical-distance'
  },
  {
    name: 'height',
    tip: '地表高度量算',
    icon: 'vc-icons-measure-height-from-terrain'
  },
  {
    name: 'area',
    tip: '面积量算',
    icon: 'vc-icons-measure-area'
  },
  {
    name: 'point',
    tip: '坐标量算',
    icon: 'vc-icons-measure-point-coordinates'
  },
  {
    name: 'rectangle',
    tip: '矩形量算',
    icon: 'vc-icons-drawing-rectangle'
  },
  {
    name: 'circle',
    tip: '圆形量算',
    icon: 'vc-icons-drawing-circle'
  },
  {
    name: 'regular',
    tip: '正多边形量算',
    icon: 'vc-icons-drawing-regular'
  },
  {
    name: 'clear',
    tip: '清除量算结果',
    icon: 'vc-icons-clear'
  }
]

export const useMeasurements = (
  props: EarthProps,
  emit: SetupContext<EarthEmits>['emit']
) => {
  // 测量按钮激活名称
  const measurementsBtnActiveName = ref<string>()
  // 过滤测量按钮列表
  const btns = defaultMeasurementsBtns
    .filter((item) => {
      return props.measurementsBtns.includes(item.name as MeasurementsBtnType)
    })
    .map((item) => {
      const tip = props?.measurementsBtnTip?.[item.name] ?? item.tip
      const icon = props?.measurementsBtnIcon?.[item.name] ?? item.icon
      return { ...item, tip, icon }
    })
  // 测量按钮列表
  const measurementsBtnList = ref<MeasurementsBtn[]>(btns)
  // 测量按钮名称
  const measurementsBtnName = computed<any[]>(() =>
    measurementsBtnList.value
      .map((item) => item.name)
      .filter((item) => item !== 'clear')
  )

  // 测量组件外层 ref
  const measurementsWrapperRef = ref<HTMLDivElement>()
  // 拖拽条 ref
  const measurementsMoveBarRef = ref<HTMLDivElement>()
  // 测量组件 ref
  const measurementsRef = ref()

  // 量算按钮切换
  const measurementsBtnToggle = (name?: string) => {
    const active = name !== measurementsBtnActiveName.value
    if (name === 'clear') {
      measurementsBtnActiveName.value = undefined
      measurementsRef.value?.clearAll()
    } else if (name && active) {
      measurementsBtnActiveName.value = name
      measurementsRef.value?.toggleAction(name)
      measurementsRef.value?.activate()
    } else {
      measurementsBtnActiveName.value = undefined
      measurementsRef.value?.toggleAction(name)
      measurementsRef.value?.deactivate()
    }
  }

  // 量算绘制时触发
  const measurementsDrawEvt = (
    evt: VcDrawingDrawEvt,
    viewer: Cesium.Viewer
  ) => {
    if (evt.finished && props.measurementsMode === 1) {
      measurementsBtnActiveName.value = undefined
    }
    emit('measurements-draw-evt', evt, viewer)
  }
  // 点击编辑按钮时触发
  const measurementsEditorEvt = (
    evt: VcDrawingEditorEvt,
    viewer: Cesium.Viewer
  ) => {
    emit('measurements-editor-evt', evt, viewer)
  }
  // 鼠标移进、移除绘制点时触发
  const measurementsMouseEvt = (
    evt: VcDrawingMouseEvt,
    viewer: Cesium.Viewer
  ) => {
    emit('measurements-mouse-evt', evt, viewer)
  }
  // 切换量算 Action 时触发
  const measurementsActiveEvt = (
    evt: VcDrawingActiveEvt,
    viewer: Cesium.Viewer
  ) => {
    emit('measurements-active-evt', evt, viewer)
  }
  // 清除绘制时触发
  const measurementsClearEvt = (evt: object, viewer: Cesium.Viewer) => {
    emit('measurements-clear', evt, viewer)
  }

  return {
    measurementsBtnActiveName,
    measurementsBtnList,
    measurementsBtnName,
    measurementsBtnToggle,
    measurementsWrapperRef,
    measurementsMoveBarRef,
    measurementsRef,
    measurementsDrawEvt,
    measurementsEditorEvt,
    measurementsMouseEvt,
    measurementsActiveEvt,
    measurementsClearEvt
  }
}
