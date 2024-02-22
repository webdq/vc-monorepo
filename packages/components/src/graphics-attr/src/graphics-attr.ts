import type { ExtractPropTypes, PropType } from 'vue'

export interface MarkIconImage {
  name?: string
  extension?: string
  image?: string
  imageUrl?: string
  [key: string]: any
}

export const graphicsAttrProps = {
  markIconImages: {
    type: Array,
    default: () => [] as PropType<MarkIconImage[]>
  },
  hideGraphicsAttrTab: {
    type: Boolean,
    default: false
  },
  hideTextAttrTab: {
    type: Boolean,
    default: false
  },
  hideAnimationTab: {
    type: Boolean,
    default: false
  },
  hideModelTab: {
    type: Boolean,
    default: false
  },
  hideSignalLineTab: {
    type: Boolean,
    default: false
  },
  hideMovementTab: {
    type: Boolean,
    default: false
  }
}

export type GraphicsAttrProps = ExtractPropTypes<typeof graphicsAttrProps>

export const graphicsAttrEmits = {
  graphicsFly: (entity: Cesium.Entity) => true,
  graphicsRemove: (drawingElId: string) => true,
  updateAttr: (entity: Cesium.Entity, type: string, key: string, value: any) =>
    true,
  saveAnimationClick: (graphics: any, entity: any, data: any) => true,
  previewAnimationClick: (graphics: any, entity: any, data: any) => true,
  removeAnimationClick: (graphics: any, entity: any) => true,
  saveMovementPathClick: (graphics: any, entity: any, data: any) => true,
  previewMovementPathClick: (graphics: any, entity: any, data: any) => true,
  removeMovementPathClick: (graphics: any, entity: any) => true,
  saveSignalLineClick: (graphics: any, entity: any, data: any) => true,
  previewSignalLineClick: (graphics: any, entity: any, data: any) => true,
  removeSignalLineClick: (graphics: any, entity: any) => true
}

export type GraphicsAttrEmits = typeof graphicsAttrEmits
