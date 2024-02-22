import type { ExtractPropTypes, PropType, CSSProperties } from 'vue'
import type {
  VcCompassProps,
  VcDistanceLegendProps,
  VcStatusBarProps
} from 'vue-cesium/es/components'
import type {
  VcDrawingDrawEvt,
  VcDrawingEditorEvt,
  VcDrawingMouseEvt,
  VcDrawingActiveEvt
} from 'vue-cesium/es/utils/drawing-types'
import type { VcReadyObject } from 'vue-cesium/es/utils/types'

export interface MapLayer {
  id: number | string
  type?: string
  name?: string
  img?: string
  providers?: MapLayerProviders[]
  [key: string]: any
}

export interface MapLayerProviders {
  subdomains?: string[]
  url?: string
  maximumLevel?: number
  [key: string]: any
}

export type DrawingsBtnType =
  | 'pin'
  | 'point'
  | 'polyline'
  | 'polygon'
  | 'rectangle'
  | 'circle'
  | 'regular'
  | 'clear'

export interface DrawingsBtn {
  name: string
  tip: string
  icon: string
}

export type MeasurementsBtnType =
  | 'distance'
  | 'component-distance'
  | 'polyline'
  | 'horizontal'
  | 'vertical'
  | 'height'
  | 'area'
  | 'point'
  | 'rectangle'
  | 'circle'
  | 'regular'
  | 'clear'

export interface MeasurementsBtn {
  name: string
  tip: string
  icon: string
}

export const configProps = {
  cesiumPath: {
    type: String,
    default: 'https://unpkg.com/cesium@latest/Build/Cesium/Cesium.js'
  },
  accessToken: {
    type: String,
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OGE2MjZlOC1mMzhiLTRkZjQtOWEwZi1jZTE0MWY0YzhlMTAiLCJpZCI6MjU5LCJpYXQiOjE2NDM3MjU1NzZ9.ptZ5tVXvMmuWRC0WhjtYTg-17nQh14fgxBsx0HJiVXQ'
  }
}

export const viewerProps = {
  animation: {
    type: Boolean,
    default: false
  },
  timeline: {
    type: Boolean,
    default: false
  },
  shouldAnimate: {
    type: Boolean,
    default: false
  },
  homeButton: {
    type: Boolean,
    default: false
  },
  sceneModePicker: {
    type: Boolean,
    default: false
  },
  fullscreenButton: {
    type: Boolean,
    default: false
  },
  geocoder: {
    type: Boolean,
    default: false
  },
  selectionIndicator: {
    type: Boolean,
    default: false
  },
  infoBox: {
    type: Boolean,
    default: false
  },
  showCredit: {
    type: Boolean,
    default: false
  },
  removeCesiumScript: {
    type: Boolean,
    default: false
  }
}

export const mapProps = {
  terrain: {
    type: Boolean,
    default: false
  },
  terrainUrl: {
    type: [String, Object] as PropType<
      string | Promise<string> | Promise<Cesium.Resource> | Cesium.Resource
    >
  },
  requestVertexNormals: {
    type: Boolean,
    default: false
  },
  requestWaterMask: {
    type: Boolean,
    default: false
  },
  requestMetadata: {
    type: Boolean,
    default: true
  },
  mapId: {
    type: [Number, String] as PropType<number | string>
  },
  mapList: {
    type: Array as PropType<MapLayer[]>,
    default: () => []
  }
}

export const compassProps = {
  // 禁用罗盘
  compassDisable: {
    type: Boolean,
    default: false
  },
  // 显示罗盘
  compass: {
    type: Boolean,
    default: false
  },
  // 罗盘配置
  compassOpts: {
    type: Object as PropType<VcCompassProps>,
    default: () => ({})
  },
  // 罗盘样式
  compassStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({ top: 0, left: 0 })
  }
}

export const statusbarProps = {
  // 显示状态条
  statusbar: {
    type: Boolean,
    default: false
  },
  // 状态条配置
  statusbarOpts: {
    type: Object as PropType<VcStatusBarProps>,
    default: () => ({})
  },
  // 状态条样式
  statusbarStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({ bottom: 0, left: 0, right: 0 })
  },
  // 显示距离
  distance: {
    type: Boolean,
    default: false
  },
  // 距离配置
  distanceOpts: {
    type: Object as PropType<VcDistanceLegendProps>,
    default: () => ({})
  }
}

export const drawingsProps = {
  // 显示标绘组件
  drawings: {
    type: Boolean,
    default: false
  },
  // 显示标绘组件拖拽条
  drawingsMoveBar: {
    type: Boolean,
    default: true
  },
  // 标绘组件 left 距离
  drawingsLeft: {
    type: Number,
    default: 0
  },
  // 标绘组件 top 距离
  drawingsTop: {
    type: Number,
    default: 0
  },
  // 标绘按钮名称
  drawingsBtns: {
    type: Array as PropType<DrawingsBtnType[]>,
    default: () => [
      'pin',
      'point',
      'polyline',
      'polygon',
      'rectangle',
      'circle',
      'regular',
      'clear'
    ]
  },
  // 标绘按钮提示文字
  drawingsBtnTip: {
    type: Object as PropType<Record<string, string>>
  },
  // 标绘按钮图标
  drawingsBtnIcon: {
    type: Object as PropType<Record<string, string>>
  },
  // 绘制组件的位置
  drawingsPosition: {
    type: String as PropType<
      | 'top'
      | 'left'
      | 'right'
      | 'bottom'
      | 'bottom-left'
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
    >,
    default: 'top-left'
  },
  // 位置的偏移量
  drawingsOffset: {
    type: Array as PropType<unknown> as PropType<[number, number]>,
    default: () => [0, 0]
  },
  // 绘制交互模式，0 代表连续绘制，1 代表绘制一次就结束
  drawingsMode: {
    type: Number as PropType<0 | 1>,
    default: 1
  },
  // 绘制实例激活时的颜色
  drawingsActiveColor: {
    type: String,
    default: 'positive'
  },
  // 绘制结果对象是否可编辑
  drawingsEditable: {
    type: Boolean,
    default: false
  },
  // 绘制结果对象是否贴地或模型。仅线、面对象生效
  drawingsClampToGround: {
    type: Boolean,
    default: false
  },
  // 绘制组件浮动按钮的样式选项
  drawingsMainFabOpts: {
    type: Object as PropType<any>
  },
  // 其他绘制按钮的公共样式选项
  drawingsFabActionOpts: {
    type: Object as PropType<any>
  },
  // 图标点绘制按钮的样式选项
  drawingsPinActionOpts: {
    type: Object as PropType<any>
  },
  // 图标点绘制参数
  drawingsPinDrawingOpts: {
    type: Object as PropType<any>
  },
  // 点绘制按钮的样式选项
  drawingsPointActionOpts: {
    type: Object as PropType<any>
  },
  // 点绘制参数
  drawingsPointDrawingOpts: {
    type: Object as PropType<any>
  },
  // 线绘制按钮的样式选项
  drawingsPolylineActionOpts: {
    type: Object as PropType<any>
  },
  // 线绘制参数
  drawingsPolylineDrawingOpts: {
    type: Object as PropType<any>
  },
  // 面绘制按钮的样式选项
  drawingsPolygonActionOpts: {
    type: Object as PropType<any>
  },
  // 面绘制参数
  drawingsPolygonDrawingOpts: {
    type: Object as PropType<any>
  },
  // 矩形绘制按钮的样式选项
  drawingsRectangleActionOpts: {
    type: Object as PropType<any>
  },
  // 矩形绘制参数
  drawingsRectangleDrawingOpts: {
    type: Object as PropType<any>
  },
  // 圆绘制按钮的样式选项
  drawingsCircleActionOpts: {
    type: Object as PropType<any>
  },
  // 圆绘制参数
  drawingsCircleDrawingOpts: {
    type: Object as PropType<any>
  },
  // 正多边形绘制按钮的样式选项
  drawingsRegularActionOpts: {
    type: Object as PropType<any>
  },
  // 正多边形绘制参数
  drawingsRegularDrawingOpts: {
    type: Object as PropType<any>
  },
  // 清除按钮的样式选项
  drawingsClearActionOpts: {
    type: Object as PropType<any>
  }
}

export const measurementsProps = {
  // 显示测量组件
  measurements: {
    type: Boolean,
    default: false
  },
  // 显示测量组件拖拽条
  measurementsMoveBar: {
    type: Boolean,
    default: true
  },
  // 测量组件 left 距离
  measurementsLeft: {
    type: Number,
    default: 0
  },
  // 测量组件 top 距离
  measurementsTop: {
    type: Number,
    default: 0
  },
  // 测量按钮名称
  measurementsBtns: {
    type: Array as PropType<MeasurementsBtnType[]>,
    default: () => [
      'point',
      'polyline',
      'circle',
      'rectangle',
      'regular',
      'distance',
      'component-distance',
      'horizontal',
      'vertical',
      'height',
      'area',
      'clear'
    ]
  },
  // 测量按钮提示文字
  measurementsBtnTip: {
    type: Object as PropType<Record<string, string>>
  },
  // 测量按钮图标
  measurementsBtnIcon: {
    type: Object as PropType<Record<string, string>>
  },
  // 量算组件的位置
  measurementsPosition: {
    type: String as PropType<
      | 'top'
      | 'left'
      | 'right'
      | 'bottom'
      | 'bottom-left'
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
    >,
    default: 'bottom-left'
  },
  // 量算组件基于位置的偏移量
  measurementsOffset: {
    type: Array as PropType<unknown> as PropType<[number, number]>,
    default: () => [0, 0]
  },
  // 绘制的量算结果是否可见
  measurementsShow: {
    type: Boolean,
    default: true
  },
  // 绘制交互模式，0 代表连续绘制，1 代表绘制一次就结束
  measurementsMode: {
    type: Number as PropType<0 | 1>,
    default: 1
  },
  // 量算实例激活时的颜色
  measurementsActiveColor: {
    type: String,
    default: 'positive'
  },
  // 量算结果对象是否可编辑
  measurementsEditable: {
    type: Boolean,
    default: false
  },
  // 量算组件浮动按钮的样式风格选项
  measurementsMainFabOpts: {
    type: Object as PropType<any>
  },
  // 其他量算按钮的公共样式选项
  measurementsFabActionOpts: {
    type: Object as PropType<any>
  },
  // 距离量算按钮的样式风格选项
  measurementsDistanceActionOpts: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  // 距离量算参数
  measurementsDistanceMeasurementOpts: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  // 三角量算按钮的样式风格选项
  measurementsComponentDistanceActionOpts: {
    type: Object as PropType<any>
  },
  // 三角量算参数
  measurementsComponentDistanceMeasurementOpts: {
    type: Object as PropType<any>
  },
  // 折线距离量算按钮的样式风格选项
  measurementsPolylineActionOpts: {
    type: Object as PropType<any>
  },
  // 折线距离量算参数
  measurementsPolylineMeasurementOpts: {
    type: Object as PropType<any>
  },
  // 水平距离量算按钮的样式风格选项
  measurementsHorizontalActionOpts: {
    type: Object as PropType<any>
  },
  // 水平距离量算参数
  measurementsHorizontalMeasurementOpts: {
    type: Object as PropType<any>
  },
  // 垂直距离量算按钮的样式风格选项
  measurementsVerticalActionOpts: {
    type: Object as PropType<any>
  },
  // 垂直距离量算参数
  measurementsVerticalMeasurementOpts: {
    type: Object as PropType<any>
  },
  // 高度量算按钮的样式风格选项
  measurementsHeightActionOpts: {
    type: Object as PropType<any>
  },
  // 高度量算参数
  measurementsHeightMeasurementOpts: {
    type: Object as PropType<any>
  },
  // 面积量算按钮的样式风格选项
  measurementsAreaActionOpts: {
    type: Object as PropType<any>
  },
  // 面积量算参数
  measurementsAreaMeasurementOpts: {
    type: Object as PropType<any>
  },
  // 坐标量算按钮的样式风格选项
  measurementsPointActionOpts: {
    type: Object as PropType<any>
  },
  // 坐标量算参数
  measurementsPointMeasurementOpts: {
    type: Object as PropType<any>
  },
  // 矩形量算按钮的样式风格选项
  measurementsRectangleActionOpts: {
    type: Object as PropType<any>
  },
  // 矩形量算参数
  measurementsRectangleMeasurementOpts: {
    type: Object as PropType<any>
  },
  // 圆形量算按钮的样式风格选项
  measurementsCircleActionOpts: {
    type: Object as PropType<any>
  },
  // 圆形量算参数
  measurementsCircleMeasurementOpts: {
    type: Object as PropType<any>
  },
  // 正多边形量算按钮的样式风格选项
  measurementsRegularActionOpts: {
    type: Object as PropType<any>
  },
  // 正多边形量算参数
  measurementsRegularMeasurementOpts: {
    type: Object as PropType<any>
  },
  // 清除按钮的样式风格选项
  measurementsClearActionOpts: {
    type: Object as PropType<any>
  }
}

export const earthProps = {
  ...configProps,
  ...viewerProps,
  ...mapProps,
  ...compassProps,
  ...statusbarProps,
  ...drawingsProps,
  ...measurementsProps
} as const

export type EarthProps = ExtractPropTypes<typeof earthProps>

export const earthEmits = {
  'viewer-ready': (readyObj: VcReadyObject) => true,
  'drawings-draw-evt': (evt: VcDrawingDrawEvt, viewer: Cesium.Viewer) => true,
  'drawings-editor-evt': (evt: VcDrawingEditorEvt, viewer: Cesium.Viewer) =>
    true,
  'drawings-mouse-evt': (evt: VcDrawingMouseEvt, viewer: Cesium.Viewer) => true,
  'drawings-active-evt': (evt: VcDrawingActiveEvt, viewer: Cesium.Viewer) =>
    true,
  'drawings-clear': (evt: object, viewer: Cesium.Viewer) => true,
  'measurements-draw-evt': (evt: VcDrawingDrawEvt, viewer: Cesium.Viewer) =>
    true,
  'measurements-editor-evt': (evt: VcDrawingEditorEvt, viewer: Cesium.Viewer) =>
    true,
  'measurements-mouse-evt': (evt: VcDrawingMouseEvt, viewer: Cesium.Viewer) =>
    true,
  'measurements-active-evt': (evt: VcDrawingActiveEvt, viewer: Cesium.Viewer) =>
    true,
  'measurements-clear': (evt: object, viewer: Cesium.Viewer) => true
}

export type EarthEmits = typeof earthEmits
