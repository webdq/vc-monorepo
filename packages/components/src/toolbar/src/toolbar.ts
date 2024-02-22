import type { ExtractPropTypes, PropType, CSSProperties } from 'vue'
import type { MapLayer } from '../../earth/src/earth'

export type ToolbarBtnType =
  | 'geocoder'
  | 'position'
  | 'layer'
  | 'home'
  | 'zoom-in'
  | 'zoom-out'
  | 'mode'
  | 'geolocation'
  | 'setting'
  | 'fullscreen'
  | 'debug'

export interface ToolbarPosition {
  left?: string | number
  right?: string | number
  top?: string | number
  bottom?: string | number
}

export type FetchGeocode = (val?: string) => any

export const toolbarProps = {
  // 禁用
  disableToolbar: {
    type: Boolean
  },
  // 方向
  toolbarDirection: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'vertical'
  },
  // 样式
  toolbarStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  // 工具按钮
  toolbarBtns: {
    type: Array as PropType<ToolbarBtnType[]>,
    default: () => [
      'geocoder',
      'position',
      'layer',
      'home',
      'zoom-in',
      'zoom-out',
      'mode',
      'geolocation',
      'setting',
      'fullscreen'
    ]
  },
  // cesium token
  accessToken: {
    type: String
  },
  // 在线查询 geocoder
  geocoderOnline: {
    type: Boolean,
    default: true
  },
  // 查询 geocode 方法
  fetchGeocode: {
    type: Function as PropType<FetchGeocode>
  },
  // 地图 id
  mapId: {
    type: [Number, String] as PropType<number | string>
  },
  // 地图列表
  mapList: {
    type: Array as PropType<MapLayer[]>,
    default: () => []
  },
  // 缩放数量
  zoomAmount: {
    type: Number,
    default: 2
  },
  // 缩放时间
  zoomDuration: {
    type: Number,
    default: 0.1
  }
} as const

export type ToolbarProps = ExtractPropTypes<typeof toolbarProps>

export const toolbarEmits = {
  'update:mapId': (id?: number | string) => true,
  mapChange: (id?: number | string) => true
}

export type ToolbarEmits = typeof toolbarEmits
