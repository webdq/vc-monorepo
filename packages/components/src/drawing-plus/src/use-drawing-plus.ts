import { ref, computed, type Ref } from 'vue'
import { useDraggable } from '@vueuse/core'
import type {
  DrawingPlusProps,
  DrawingPlusBtn,
  DrawingPlusBtnType
} from './drawing-plus'

export const defaultDrawingBtns: DrawingPlusBtn[] = [
  {
    name: 'billboard',
    tip: '绘制标牌',
    icon: 'ri:image-fill'
  },
  {
    name: 'pin',
    tip: '绘制标记',
    icon: 'gis:poi'
  },
  {
    name: 'point',
    tip: '绘制点',
    icon: 'tabler:point-filled'
  },
  {
    name: 'polyline',
    tip: '绘制线',
    icon: 'tabler:line'
  },
  {
    name: 'polygon',
    tip: '绘制面',
    icon: 'gis:polygon-pt'
  },
  {
    name: 'rectangle',
    tip: '绘制矩形',
    icon: 'icon-park-outline:anchor'
  },
  {
    name: 'circle',
    tip: '绘制圆',
    icon: 'lucide:circle-dot'
  },
  {
    name: 'fineArrow',
    tip: '绘制直线箭头',
    icon: 'mdi:arrow-up-bold'
  },
  {
    name: 'attackArrow',
    tip: '绘制攻击箭头',
    icon: 'fluent:arrow-redo-24-filled'
  },
  {
    name: 'tailedAttackArrow',
    tip: '绘制燕尾箭头',
    icon: 'tabler:arrow-merge'
  },
  {
    name: 'doubleArrow',
    tip: '绘制双箭头',
    icon: 'tabler:arrow-fork'
  },
  {
    name: 'gatheringPlace',
    tip: '绘制集结地',
    icon: 'mdi:vector-ellipse'
  },
  {
    name: 'model',
    tip: '绘制模型',
    icon: 'cil:3d'
  },
  {
    name: 'clear',
    tip: '清除标绘',
    icon: 'grommet-icons:clear-option'
  }
]

export const useDrawingPlusBtn = (props: DrawingPlusProps) => {
  // 过滤标绘按钮列表
  const btns = defaultDrawingBtns
    .filter((item) => {
      return props.drawingPlusBtns.includes(item.name as DrawingPlusBtnType)
    })
    .map((item) => {
      const tip = props?.drawingPlusBtnTip?.[item.name] ?? item.tip
      const icon = props?.drawingPlusBtnIcon?.[item.name] ?? item.icon
      return { ...item, tip, icon }
    })
  // 标绘按钮列表
  const drawingBtnList = ref<DrawingPlusBtn[]>(btns)
  // 标绘按钮名称
  const drawingBtnName = computed(() =>
    drawingBtnList.value.map((item) => item.name)
  )
  return {
    drawingBtnList,
    drawingBtnName
  }
}

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
