import { ref } from 'vue'
import { debounce } from 'lodash-es'
import { nanoid } from 'nanoid'
import type { ToolbarProps } from '../toolbar'
import type { VcViewerProvider } from 'vue-cesium/es/utils/types'

export const useGeocode = (props: ToolbarProps, $vc: VcViewerProvider) => {
  // 显示地理编码输入框
  const showGeocodeInput = ref(false)
  // 点击搜索按钮
  const geocodeClick = () => {
    showGeocodeInput.value = !showGeocodeInput.value
  }
  // 地理编码搜索值
  const geocodeValue = ref<string | number>()
  // 地理编码列表
  const geocodeList = ref<any[]>([])
  // 搜索地理编码
  const geocodeSearch = debounce((value) => {
    if (value.trim() === '') return
    if (props.geocoderOnline) {
      getGeocodeOnline(value)
    } else {
      getGeocodeLocal(value)
    }
  }, 500)
  // 本地搜索地理编码
  const getGeocodeLocal = async (value: string) => {
    const data = await props?.fetchGeocode?.(value)
    geocodeList.value = data
  }
  // 在线搜索地理编码
  const getGeocodeOnline = async (value: string) => {
    const geocoder = new Cesium.IonGeocoderService({
      scene: $vc.viewer.scene,
      accessToken: props.accessToken
    })
    const list = await geocoder.geocode(value)
    const data =
      list?.map((item) => {
        return {
          code: nanoid(),
          name: item.displayName,
          destination: item.destination
        }
      }) ?? []
    geocodeList.value = data
  }
  // 选择地理编码
  const geocodeSelect = (value: any) => {
    const geo = geocodeList.value.find((item) => item.code === value)

    if (geo) {
      let longitude: number
      let latitude: number
      let height: number
      if (props.geocoderOnline) {
        const rectangle = Cesium.Rectangle.fromRadians(
          geo.destination.west,
          geo.destination.south,
          geo.destination.east,
          geo.destination.north
        )
        const cartographic = Cesium.Rectangle.center(rectangle)
        longitude = Cesium.Math.toDegrees(cartographic.longitude)
        latitude = Cesium.Math.toDegrees(cartographic.latitude)
        height = 100000
      } else {
        longitude = geo.longitude
        latitude = geo.latitude
        height = geo.height ?? 100000
      }
      const destination = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
      )

      $vc.viewer.camera.flyTo({
        destination,
        duration: 1
      })
    }
  }

  return {
    showGeocodeInput,
    geocodeClick,
    geocodeValue,
    geocodeList,
    geocodeSearch,
    getGeocodeLocal,
    getGeocodeOnline,
    geocodeSelect
  }
}
