import type { Ref } from 'vue'
import { useDraggable } from '@vueuse/core'

export const useElDraggable = (
  parentRef: Ref<HTMLDivElement | undefined>,
  wapperRef: Ref<HTMLDivElement | undefined>,
  barRef: Ref<HTMLDivElement | undefined>,
  left: number,
  top: number
) => {
  const { style } = useDraggable(wapperRef, {
    initialValue: {
      x: left,
      y: top
    },
    preventDefault: true,
    stopPropagation: true,
    containerElement: parentRef,
    handle: barRef
  })

  return {
    style
  }
}
