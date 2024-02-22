import type { ExtractPropTypes, PropType } from 'vue'

export type DrawingPlusBtnType =
  | 'billboard'
  | 'pin'
  | 'point'
  | 'polyline'
  | 'polygon'
  | 'rectangle'
  | 'circle'
  | 'fineArrow'
  | 'attackArrow'
  | 'tailedAttackArrow'
  | 'doubleArrow'
  | 'gatheringPlace'
  | 'model'
  | 'clear'

export interface DrawingPlusBtn {
  name: string
  tip: string
  icon: string
}

export const drawingPlusProps = {
  // 显示标绘组件拖拽条
  drawingMoveBar: {
    type: Boolean,
    default: true
  },
  // 标绘按钮名称
  drawingPlusBtns: {
    type: Array as PropType<DrawingPlusBtnType[]>,
    default: () => [
      'billboard',
      'pin',
      'point',
      'polyline',
      'polygon',
      'rectangle',
      'circle',
      'fineArrow',
      'attackArrow',
      'tailedAttackArrow',
      'doubleArrow',
      'gatheringPlace',
      'model',
      'clear'
    ]
  },
  // 标绘按钮提示文字
  drawingPlusBtnTip: {
    type: Object as PropType<Record<string, string>>
  },
  // 标绘按钮图标
  drawingPlusBtnIcon: {
    type: Object as PropType<Record<string, string>>
  },
  // 标绘组件 left 距离
  drawingPlusLeft: {
    type: Number,
    default: 0
  },
  // 标绘组件 top 距离
  drawingPlusTop: {
    type: Number,
    default: 0
  },
  // 标牌图片地址
  billboardUrl: {
    type: String
  },
  // 标记图片地址
  pinUrl: {
    type: String
  },
  // 模型地址
  modelUrl: {
    type: String
  }
} as const

export type DrawingPlusProps = ExtractPropTypes<typeof drawingPlusProps>
