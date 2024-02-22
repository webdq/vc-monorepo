import { ref, computed, watch, type SetupContext } from 'vue'
import type { ToolbarProps, ToolbarEmits } from '../toolbar'

export const useMapLayer = (
  props: ToolbarProps,
  emit: SetupContext<ToolbarEmits>['emit']
) => {
  // 选中的地图 id
  const currentMapId = ref<any>(props.mapId)
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
  // 切换地图
  const mapClick = (id: string | number) => {
    currentMapId.value = id
    emit('update:mapId', id)
    emit('mapChange', id)
  }

  return {
    currentMapId,
    mapSelected,
    mapClick
  }
}
