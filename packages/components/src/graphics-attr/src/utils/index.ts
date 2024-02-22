import { vec3 } from 'gl-matrix'
import { toRaw, isProxy } from 'vue'

interface Point {
  x: number
  y: number
  z: number
  [key: string]: any
}
interface Position {
  latitude: number
  longitude: number
  height: number
}
/**
 * @description: 计算面积
 */
export const measureArea = (points: Point[]) => {
  const { centerX, centerY, centerZ } = points.reduce(
    (prev, current) => {
      return {
        centerX: prev.centerX + current.x,
        centerY: prev.centerY + current.y,
        centerZ: prev.centerZ + current.z
      }
    },
    { centerX: 0, centerY: 0, centerZ: 0 }
  )
  const divX = centerX / points.length
  const divY = centerY / points.length
  const divZ = centerZ / points.length
  const centerVec = vec3.fromValues(divX, divY, divZ)
  const vecs = points.map((item) => vec3.fromValues(item.x, item.y, item.z))
  const newVecs = vecs.map((vec) => vec3.sub(vec3.create(), vec, centerVec))
  const length = newVecs.reduce((prev, current, index) => {
    let nextVecIndex = index + 1
    if (nextVecIndex >= newVecs.length) {
      nextVecIndex = 0
    }
    const nextVec = newVecs[nextVecIndex]
    const vec = vec3.cross(vec3.create(), current, nextVec)
    return prev + vec3.length(vec)
  }, 0)
  return length / 2
}
/**
 * @description: 计算距离
 */
export const measureLine = (points: Point[]) => {
  const vecs = points.map((item) => vec3.fromValues(item.x, item.y, item.z))
  const newVecs = vecs
    .map((vec, index) => {
      const nextVecIndex = index + 1
      if (nextVecIndex >= vecs.length) {
        return false
      }
      return vec3.sub(vec3.create(), vec, vecs[nextVecIndex])
    })
    .filter(Boolean) as vec3[]
  const length = newVecs.reduce((prev, current) => {
    return prev + vec3.length(current)
  }, 0)
  return length
}
/**
 * @description: 笛卡尔坐标转换为经纬度坐标
 */
export const cartesianToDegrees = (cartesian: Cesium.Cartesian3) => {
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude)
  const longitude = Cesium.Math.toDegrees(cartographic.longitude)
  const height = cartographic.height
  return { latitude, longitude, height }
}
/**
 * @description: 笛卡尔坐标转换为经纬度坐标
 */
export const cartesianToDegreesArray = (cartesians: Cesium.Cartesian3[]) => {
  const result = cartesians.map((cartesian) => cartesianToDegrees(cartesian))
  return result
}
/**
 * @description: 经纬度坐标转换为笛卡尔坐标
 */
export const degreesToCartesian = (position: Position) => {
  const cartesian = Cesium.Cartesian3.fromDegrees(
    position.longitude,
    position.latitude,
    position.height
  )
  return cartesian
}
/**
 * @description: 经纬度坐标转换为笛卡尔坐标
 */
export const degreesToCartesianArray = (positions: Position[]) => {
  const result = positions.map((pos) => degreesToCartesian(pos))
  return result
}
/**
 * @description: 转换为原始对象
 */
export const toRawObject = (object: any) => {
  const result: any = {}
  Object.keys(object).forEach((key) => {
    result[key] = isProxy(object[key]) ? toRaw(object[key]) : object[key]
  })
  return result
}
