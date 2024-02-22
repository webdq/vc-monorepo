import Pin from './graphics/Pin'
import Point from './graphics/Point'
import Polyline from './graphics/Polyline'
import Polygon from './graphics/Polygon'
import Circle from './graphics/Circle'
import Rectangle from './graphics/Rectangle'
import FineArrow from './graphics/FineArrow'
import AttackArrow from './graphics/AttackArrow'
import TailedAttackArrow from './graphics/TailedAttackArrow'
import DoubleArrow from './graphics/DoubleArrow'
import GatheringPlace from './graphics/GatheringPlace'
import ViewFrustum from './graphics/ViewFrustum'

export type GraphicsType =
  | Pin
  | Point
  | Polyline
  | Polygon
  | Circle
  | Rectangle
  | FineArrow
  | AttackArrow
  | TailedAttackArrow
  | DoubleArrow
  | GatheringPlace

export type GraphicsClassType =
  | typeof Pin
  | typeof Point
  | typeof Polyline
  | typeof Polygon
  | typeof Circle
  | typeof Rectangle
  | typeof FineArrow
  | typeof AttackArrow
  | typeof TailedAttackArrow
  | typeof DoubleArrow
  | typeof GatheringPlace

export type GraphicsMapType<T = GraphicsType> = Map<string, T>

export type DrawHelperOptions = {
  id?: string
  frustum?: ViewFrustumOptions
  billboardUrl?: string
  pinUrl?: string
  modelUrl?: string
  headHeightFactor?: number
  headWidthFactor?: number
  neckHeightFactor?: number
  neckWidthFactor?: number
  headTailFactor?: number
  tailWidthFactor?: number
  swallowTailFactor?: number
  fittingCount?: number
  t?: number
  onChange?: (graphics?: GraphicsType) => void
  onComplete?: (graphics: GraphicsType) => void
  onMarkerLeftDown?: (
    graphics: GraphicsType,
    entity: Cesium.Entity,
    marker: Cesium.Entity,
    cartesian: Cesium.Cartesian3
  ) => void
  onMarkerDragStart?: (
    graphics: GraphicsType,
    entity: Cesium.Entity,
    marker: Cesium.Entity,
    cartesian: Cesium.Cartesian3
  ) => void
  onMarkerDrag?: (
    graphics: GraphicsType,
    entity: Cesium.Entity,
    marker: Cesium.Entity,
    cartesian: Cesium.Cartesian3,
    cartesian2?: Cesium.Cartesian3
  ) => void
  onMarkerDragEnd?: (
    graphics: GraphicsType,
    entity: Cesium.Entity,
    marker: Cesium.Entity,
    cartesian: Cesium.Cartesian3
  ) => void
}

export type GraphicsOptions = DrawHelperOptions

export interface GraphicsEntityOptions {
  entity?: any
  properties?: any
  label?: any
  billboard?: any
  point?: any
  ellipse?: any
  polyline?: any
  polygon?: any
  rectangle?: any
  model?: any
  [key: string]: any
}

export type CleanupFn = () => void

export interface GraphicsJsonData {
  id: string
  type: string
  entity: EntityJsonData
  [key: string]: any
}

export interface EntityJsonData {
  id?: string
  type?: string
  name?: string
  show?: boolean
  position?: {
    cartesian?: number[]
    cartographicDegrees?: number[]
  }
  orientation?: any
  billboard?: any
  box?: any
  corridor?: any
  cylinder?: any
  ellipse?: any
  ellipsoid?: any
  label?: any
  model?: any
  path?: any
  plane?: any
  point?: any
  polygon?: any
  polyline?: any
  properties?: any
  polylineVolume?: any
  rectangle?: any
  wall?: any
  frustum?: any
  animationEffect?: AnimationEffectJson
  [key: string]: any
}

export interface ViewFrustumOptions {
  show?: boolean
  fov?: number
  aspectWidth?: number
  aspectHeight?: number
  aspectRatio?: number
  near?: number
  far?: number
  xOffset?: number
  yOffset?: number
  origin?: Cesium.Cartesian3
  orientation?: Cesium.Quaternion
  vertexFormat?: Cesium.VertexFormat
  color?: Cesium.Color
  outlineColor?: Cesium.Color
  heading?: number
  pitch?: number
  roll?: number
  [key: string]: any
}

export interface AnimationEffect {
  type?: string
  startDate?: string
  stopDate?: string
  speed?: number
  degress?: any[]
  positions?: any[]
  flashColor1?: string
  flashColor2?: string
  [key: string]: any
}

export interface AnimationEffectJson {
  type?: string
  startDate?: string
  stopDate?: string
  speed?: number
  degress?: { longitude: number; latitude: number; height: number }[]
  positions?: any[]
  flashColor1?: { color: { rgba: number[] } }
  flashColor2?: { color: { rgba: number[] } }
  [key: string]: any
}

export interface SignalLineData {
  startDate?: string
  stopDate?: string
  entityIds?: string[]
  [key: string]: any
}

export interface MovementData {
  showPath?: boolean
  pathId?: string
  modelId?: string
  startDate?: string
  stopDate?: string
  speed?: number
  degress?: any[]
  positions?: any[]
  [key: string]: any
}
