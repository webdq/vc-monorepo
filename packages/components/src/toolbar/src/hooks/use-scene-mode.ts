import { ref, computed } from 'vue'
import { TableOutlined, GlobalOutlined } from '@ant-design/icons-vue'
import type { VcViewerProvider } from 'vue-cesium/es/utils/types'

const SceneModeIconMap = {
  1: TableOutlined,
  2: TableOutlined,
  3: GlobalOutlined
}

export const useSceneMode = ($vc: VcViewerProvider) => {
  // 显示视图选项
  const sceneModeVisible = ref(false)
  // 当前视图类型
  const sceneMode = ref(3)
  // 点击视图
  const sceneModeClick = () => {
    sceneModeVisible.value = !sceneModeVisible.value
  }
  // 视图切换
  const sceneModeChange = (type: number) => {
    sceneMode.value = type
    sceneModeVisible.value = false
    switch (sceneMode.value) {
      case 1:
        return $vc.viewer.scene.morphToColumbusView()
      case 2:
        return $vc.viewer.scene.morphTo2D()
      case 3:
        return $vc.viewer.scene.morphTo3D()
    }
  }
  // 当前视图显示的 icon
  const currentViewIcon = computed(() => {
    return SceneModeIconMap[sceneMode.value as keyof typeof SceneModeIconMap]
  })
  // 显示2.5D视图按钮
  const is25D = computed(
    () => sceneMode.value === Cesium.SceneMode.COLUMBUS_VIEW
  )
  // 显示2D视图按钮
  const is2D = computed(() => sceneMode.value === Cesium.SceneMode.SCENE2D)
  // 显示3D视图按钮
  const is3D = computed(() => sceneMode.value === Cesium.SceneMode.SCENE3D)

  return {
    sceneModeVisible,
    sceneMode,
    sceneModeClick,
    sceneModeChange,
    currentViewIcon,
    is25D,
    is2D,
    is3D
  }
}
