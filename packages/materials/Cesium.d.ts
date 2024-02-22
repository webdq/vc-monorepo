/// <reference types="vue-cesium/Cesium" />

declare namespace Cesium {
  export function createPropertyDescriptor(
    name: string,
    configurable?: boolean,
    createPropertyCallback?: any
  ): any

  namespace Property {
    export function equals(left: any, right: any): boolean
    export function getValueOrClonedDefault(
      property?: any,
      time?: any,
      valueDefault?: any,
      result?: any
    ): any
    export function getValueOrDefault(
      property?: any,
      time?: any,
      valueDefault?: any,
      result?: any
    ): any
  }

  namespace Material {
    const _materialCache: any
    let CircleBlurType: string
    let CircleDiffuseType: string
    let CircleFadeType: string
    let CirclePulseType: string
    let CircleScanType: string
    let CircleSpiralType: string
    let CircleVaryType: string
    let CircleWaveType: string
    let EllipsoidElectricType: string
    let EllipsoidTrailType: string
    let PolylineFlickerType: string
    let PolylineFlowType: string
    let PolylineImageTrailType: string
    let PolylineLightingTrailType: string
    let PolylineTrailType: string
    let RadarLineType: string
    let RadarScanType: string
    let RadarSweepType: string
    let RadarWaveType: string
    let WallImageTrailType: string
    let WallLineTrailType: string
    let WallTrailType: string
  }

  export interface CircleBlurOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface CircleDiffuseOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface CircleFadeOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface CirclePulseOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface CircleScanOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface CircleSpiralOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface CircleVaryOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface CircleWaveOptions {
    color?: Cesium.Color
    speed?: number
    count?: number
    gradient?: number
  }

  export interface EllipsoidElectricOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface EllipsoidTrailOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface PolylineFlickerOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface PolylineFlowOptions {
    color?: Cesium.Color
    speed?: number
    percent?: number
    gradient?: number
  }

  export interface PolylineImageTrailOptions {
    color?: Cesium.Color
    speed?: number
    image?: string
    repeat?: {
      x?: number
      y?: number
    }
  }

  export interface PolylineLightingTrailOptions {
    color?: Cesium.Color
    speed?: number
    image?: string
  }

  export interface PolylineTrailOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface RadarLineOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface RadarScanOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface RadarSweepOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface RadarWaveOptions {
    color?: Cesium.Color
    speed?: number
  }

  export interface WallImageTrailOptions {
    color?: Cesium.Color
    speed?: number
    image?: string
    repeat?: {
      x?: number
      y?: number
    }
  }

  export interface WallLineTrailOptions {
    color?: Cesium.Color
    speed?: number
    image?: string
    repeat?: {
      x?: number
      y?: number
    }
  }

  export interface WallTrailOptions {
    color?: Cesium.Color
    speed?: number
    image?: string
  }

  export class CircleBlurMaterialProperty {
    constructor(options?: Cesium.CircleBlurOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class CircleDiffuseMaterialProperty {
    constructor(options?: Cesium.CircleDiffuseOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class CircleFadeMaterialProperty {
    constructor(options?: Cesium.CircleFadeOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class CirclePulseMaterialProperty {
    constructor(options?: Cesium.CirclePulseOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class CircleScanMaterialProperty {
    constructor(options?: Cesium.CircleScanOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class CircleSpiralMaterialProperty {
    constructor(options?: Cesium.CircleSpiralOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class CircleVaryMaterialProperty {
    constructor(options?: Cesium.CircleVaryOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class CircleWaveMaterialProperty {
    constructor(options?: Cesium.CircleWaveOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    count: number
    gradient: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }

  export class EllipsoidElectricMaterialProperty {
    constructor(options?: Cesium.EllipsoidElectricOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class EllipsoidTrailMaterialProperty {
    constructor(options?: Cesium.EllipsoidTrailOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }

  export class PolylineFlickerMaterialProperty {
    constructor(options?: Cesium.PolylineFlickerOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class PolylineFlowMaterialProperty {
    constructor(options?: Cesium.PolylineFlowOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    percent: number
    gradient: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class PolylineImageTrailMaterialProperty {
    constructor(options?: Cesium.PolylineImageTrailOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    image: string
    repeat: any
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class PolylineLightingTrailMaterialProperty {
    constructor(options?: Cesium.PolylineLightingTrailOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    image: string
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class PolylineTrailMaterialProperty {
    constructor(options?: Cesium.PolylineTrailOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }

  export class RadarLineMaterialProperty {
    constructor(options?: Cesium.RadarLineOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class RadarScanMaterialProperty {
    constructor(options?: Cesium.RadarScanOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class RadarSweepMaterialProperty {
    constructor(options?: Cesium.RadarSweepOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class RadarWaveMaterialProperty {
    constructor(options?: Cesium.RadarWaveOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }

  export class WallImageTrailMaterialProperty {
    constructor(options?: Cesium.WallImageTrailOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    image: string
    repeat: any
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class WallLineTrailMaterialProperty {
    constructor(options?: Cesium.WallLineTrailOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    image: string
    repeat: any
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
  export class WallTrailMaterialProperty {
    constructor(options?: Cesium.WallTrailOptions)
    isConstant: boolean
    definitionChanged: Cesium.Event
    color: Cesium.Color
    speed: number
    image: string
    getType(): string
    getValue(time: Cesium.JulianDate, result?: any): any
    equals(other: any): boolean
  }
}
