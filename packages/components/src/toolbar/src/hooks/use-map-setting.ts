import { ref } from 'vue'
import type { VcViewerProvider } from 'vue-cesium/es/utils/types'

export const useMapSetting = ($vc: VcViewerProvider) => {
  // 地形夸张
  const terrainExaggeration = ref(1)
  const terrainExaggerationChange = () => {
    if ($vc.viewer.scene.verticalExaggeration !== undefined) {
      $vc.viewer.scene.verticalExaggeration = terrainExaggeration.value
    } else {
      $vc.viewer.scene.globe.terrainExaggeration = terrainExaggeration.value
    }
  }
  // 深度检测
  const depthTestAgainstTerrain = ref(false)
  const depthTestAgainstTerrainChange = () => {
    $vc.viewer.scene.globe.depthTestAgainstTerrain =
      depthTestAgainstTerrain.value
  }
  // 光照
  const enableLighting = ref(false)
  const enableLightingChange = () => {
    $vc.viewer.scene.globe.enableLighting = enableLighting.value
  }
  // 地球阴影
  const viewerShadows = ref(false)
  const viewerShadowsChange = () => {
    $vc.viewer.shadows = viewerShadows.value
  }
  // 地形阴影
  const terrainShadows = ref(0)
  const terrainShadowsChange = () => {
    $vc.viewer.terrainShadows = terrainShadows.value
  }
  // 实体阴影
  const entityShadows = ref(0)
  const entityShadowsChange = () => {
    $vc.viewer.terrainShadows = terrainShadows.value
    const entities = $vc.viewer.entities.values
    const len = entities.length
    for (let i = 0; i < len; i++) {
      const entity = entities[i]
      const visual = entity.model || entity.box || entity.ellipsoid
      if (visual) {
        visual.shadows = new Cesium.ConstantProperty(entityShadows.value)
      }
    }
  }
  // 抗锯齿
  const fxaa = ref(true)
  const fxaaChange = () => {
    $vc.viewer.scene.postProcessStages.fxaa.enabled = fxaa.value
    $vc.viewer.scene.msaaSamples = fxaa.value ? 4 : 1
  }

  return {
    terrainExaggeration,
    terrainExaggerationChange,
    depthTestAgainstTerrain,
    depthTestAgainstTerrainChange,
    enableLighting,
    enableLightingChange,
    viewerShadows,
    viewerShadowsChange,
    terrainShadows,
    terrainShadowsChange,
    entityShadows,
    entityShadowsChange,
    fxaa,
    fxaaChange
  }
}
