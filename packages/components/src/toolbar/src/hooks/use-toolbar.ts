import { computed } from 'vue'
import type { ToolbarProps } from '../toolbar'
import type { VcViewerProvider } from 'vue-cesium/es/utils/types'

export const useToolbarButton = (props: ToolbarProps) => {
  const showGeocoderButton = computed(
    () => props?.toolbarBtns?.includes('geocoder')
  )
  const showPositionButton = computed(
    () => props?.toolbarBtns?.includes('position')
  )
  const showLayerButton = computed(() => props?.toolbarBtns?.includes('layer'))
  const showHomeButton = computed(() => props?.toolbarBtns?.includes('home'))
  const showZoomInButton = computed(
    () => props?.toolbarBtns?.includes('zoom-in')
  )
  const showZoomOutButton = computed(
    () => props?.toolbarBtns?.includes('zoom-out')
  )
  const showSceneModeButton = computed(
    () => props?.toolbarBtns?.includes('mode')
  )
  const showGeolocationButton = computed(
    () => props?.toolbarBtns?.includes('geolocation')
  )
  const showSettingButton = computed(
    () => props?.toolbarBtns?.includes('setting')
  )
  const showFullscreenButton = computed(
    () => props?.toolbarBtns?.includes('fullscreen')
  )
  const showDebugButton = computed(() => props?.toolbarBtns?.includes('debug'))

  return {
    showGeocoderButton,
    showPositionButton,
    showLayerButton,
    showHomeButton,
    showZoomInButton,
    showZoomOutButton,
    showSceneModeButton,
    showGeolocationButton,
    showSettingButton,
    showFullscreenButton,
    showDebugButton
  }
}

export const useToolbarHandle = ($vc: VcViewerProvider) => {
  // 点击home按钮
  const homeClick = () => {
    $vc.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(107.07, 31.05, 10000000)
    })
  }

  // 点击定位按钮
  const geolocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          $vc.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              position?.coords?.longitude,
              position?.coords?.latitude,
              position?.coords?.altitude ?? 100000
            )
          })
        }
      )
    }
  }

  // 全屏
  const fullscreenClick = () => {
    const flag = Cesium.Fullscreen.fullscreen
    if (flag) {
      Cesium.Fullscreen.exitFullscreen()
    } else {
      Cesium.Fullscreen.requestFullscreen(document.body)
    }
  }

  // 加载 debug
  const debugClick = () => {
    if (!$vc.viewer.cesiumInspector) {
      $vc.viewer.extend(Cesium.viewerCesiumInspectorMixin)
    } else {
      let display = $vc.viewer.cesiumInspector.container.style.display
      display = display === 'block' || display === '' ? 'none' : 'block'
      $vc.viewer.cesiumInspector.container.style.display = display
    }
    if (!$vc.viewer.cesium3DTilesInspector) {
      $vc.viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin)
    } else {
      let display = $vc.viewer.cesium3DTilesInspector.container.style.display
      display = display === 'block' || display === '' ? 'none' : 'block'
      $vc.viewer.cesium3DTilesInspector.container.style.display = display
    }
    const debugShowFramesPerSecond = $vc.viewer.scene.debugShowFramesPerSecond
    $vc.viewer.scene.debugShowFramesPerSecond = !debugShowFramesPerSecond
  }

  return {
    homeClick,
    geolocationClick,
    fullscreenClick,
    debugClick
  }
}
