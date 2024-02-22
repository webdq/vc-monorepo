import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { EarthProps } from '../earth'
import { useElementSize } from '@vueuse/core'
import { debounce } from 'lodash-es'

const defaultCompassOpts = {
  position: 'right',
  outerOptions: {
    size: '60px',
    color: '#3f4854',
    background: 'transparent'
  },
  innerOptions: {
    size: '20px',
    color: '#fff',
    background: 'transparent'
  },
  markerOptions: {
    size: '60px',
    color: '#4ea1ff'
  }
}
const defaultStatusbarOpts = {
  showPerformanceInfo: false
}
const defaultDistanceOpts = {}

export const useEarth = (props: EarthProps) => {
  const earthRef = ref<HTMLDivElement>()
  const viewerRef = ref()

  const compassOpts = computed<any>(() => {
    return { ...defaultCompassOpts, ...props.compassOpts }
  })
  const statusbarOpts = computed<any>(() => {
    return { ...defaultStatusbarOpts, ...props.statusbarOpts }
  })
  const distanceOpts = computed<any>(() => {
    return { ...defaultDistanceOpts, ...props.distanceOpts }
  })

  let timer: any
  const statusbarElStyle = ref<any>({ bottom: 0, left: 0, right: 0 })

  const updateStatusbarElStyle = async (viewer: Cesium.Viewer) => {
    let left: string = '0px'
    let bottom: string = '0px'
    const animationContainer = viewer?.animation?.container
    const timelineContainer = viewer?.timeline?.container
    if (props.animation && animationContainer) {
      const { width } = useElementSize(animationContainer as any)
      left = width.value + 'px'
    }
    if (props.timeline && timelineContainer) {
      const { height } = useElementSize(timelineContainer as any)
      bottom = height.value + 'px'
    }
    statusbarElStyle.value = { bottom, left, right: '0px' }
  }

  const getAnimationContainer = () => {
    timer = setInterval(async () => {
      const readyObj = await viewerRef.value?.creatingPromise
      if (readyObj) {
        updateStatusbarElStyle(readyObj.viewer)
        clearTimer()
      }
    }, 1000)
  }

  const windowResize = debounce(() => {
    if (props.animation) {
      getAnimationContainer()
    }
  }, 500)

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  watch(
    () => [props.animation, props.timeline],
    () => {
      getAnimationContainer()
    }
  )

  onMounted(() => {
    window.addEventListener('resize', windowResize)
    getAnimationContainer()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', windowResize)
    clearTimer()
  })

  return {
    earthRef,
    viewerRef,
    updateStatusbarElStyle,
    compassOpts,
    statusbarOpts,
    distanceOpts,
    statusbarElStyle
  }
}
