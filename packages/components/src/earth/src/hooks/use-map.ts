import { ref, computed, watch } from 'vue'
import type { EarthProps } from '../earth'

export const useMap = (props: EarthProps) => {
  // 选中的地图 id
  const currentMapId = ref<string | number | undefined>(props.mapId)
  watch(
    () => props.mapId,
    (val) => {
      currentMapId.value = val
    }
  )
  // 选中的地图对象
  const mapSelected = computed(
    () => props?.mapList?.find((item) => item?.id === currentMapId.value)
  )
  // 地图配置
  const mapConfig = computed<any>(() => {
    const config = mapSelected.value?.mapConfig ?? {}
    if (!config.projectionTransforms && config.projectionTransforms !== false) {
      if (isAMap.value || isTencentMap.value) {
        config.projectionTransforms = { from: 'GCJ02', to: 'WGS84' }
      }
      if (isBaiduMap.value) {
        config.projectionTransforms = { form: 'BD09', to: 'WGS84' }
      }
    }
    return config
  })
  // 标记配置
  const labelConfig = computed<any>(() => mapSelected.value?.labelConfig ?? {})
  // 显示地图标记
  const showMapLabel = computed<boolean>(() => !!mapSelected.value?.labelConfig)
  // 高德地图
  const isAMap = computed<boolean>(() => mapSelected.value?.type === 'amap')
  // 百度地图
  const isBaiduMap = computed<boolean>(
    () => mapSelected.value?.type === 'baidu'
  )
  // 腾讯地图
  const isTencentMap = computed<boolean>(
    () => mapSelected.value?.type === 'tencent'
  )
  // 天地图
  const isTiandituMap = computed<boolean>(
    () => mapSelected.value?.type === 'tianditu'
  )
  // 必应地图
  const isBingMap = computed<boolean>(() => mapSelected.value?.type === 'bing')
  // tms地图
  const isTmsMap = computed<boolean>(() => mapSelected.value?.type === 'tms')

  return {
    mapSelected,
    mapConfig,
    labelConfig,
    showMapLabel,
    isAMap,
    isBaiduMap,
    isTencentMap,
    isTiandituMap,
    isBingMap,
    isTmsMap
  }
}
