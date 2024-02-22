import { ref } from 'vue'
import { isFinite } from 'lodash-es'
import type { VcViewerProvider } from 'vue-cesium/es/utils/types'

export const usePosition = ($vc: VcViewerProvider) => {
  // 是否显示位置查询
  const positionVisible = ref(false)
  // 位置查询经度
  const positionLongitude = ref<number>()
  // 位置查询纬度
  const positionLatitude = ref<number>()
  // 位置查询高度
  const positionHeight = ref<number>(1000000)
  // 点击位置查询
  const positionClick = async () => {
    if (!isFinite(positionLongitude.value)) {
      return
    }
    if (!isFinite(positionLatitude.value)) {
      return
    }
    if (!isFinite(positionHeight.value)) {
      return
    }
    $vc.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        positionLongitude.value!,
        positionLatitude.value!,
        positionHeight.value
      )
    })
  }

  return {
    positionVisible,
    positionLongitude,
    positionLatitude,
    positionHeight,
    positionClick
  }
}
