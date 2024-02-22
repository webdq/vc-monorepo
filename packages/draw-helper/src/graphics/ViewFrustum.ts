import type { ViewFrustumOptions } from '../types'

const deaultOptions: ViewFrustumOptions = {
  show: false,
  fov: 90,
  aspectWidth: 100,
  aspectHeight: 100,
  aspectRatio: 1,
  near: 0.01,
  far: 10000.0,
  xOffset: 0,
  yOffset: 0,
  origin: new Cesium.Cartesian3(0, 0, 0),
  orientation: new Cesium.Quaternion(0, 0, 1, 0),
  vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
  color: new Cesium.Color(1.0, 1.0, 1.0, 0.3),
  outlineColor: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
  heading: 0,
  pitch: 0,
  roll: 0
}

class ViewFrustum {
  // 视图对象
  _viewer: Cesium.Viewer | null
  // 是否显示视锥
  show = false
  // 视锥的角度
  fov: number = 90
  // 视锥的宽
  aspectWidth: number = 100
  // 视锥的高
  aspectHeight: number = 100
  // 视锥的宽高比
  aspectRatio: number = 1
  // 近平面的距离
  near: number = 0.01
  // 远平面的距离
  far: number = 10000.0
  // x方向上的偏移量
  xOffset: number = 0
  // y方向上的偏移量
  yOffset: number = 0
  // 视锥原点位置
  origin: Cesium.Cartesian3 = new Cesium.Cartesian3(0, 0, 0)
  // 视锥方向
  orientation: Cesium.Quaternion = new Cesium.Quaternion(0, 0, 1, 0)
  // 顶点格式
  vertexFormat?: Cesium.VertexFormat = Cesium.VertexFormat.POSITION_ONLY
  // 颜色
  color: Cesium.Color = new Cesium.Color(1.0, 1.0, 1.0, 0.3)
  // 边框颜色
  outlineColor: Cesium.Color = new Cesium.Color(1.0, 0.0, 0.0, 1.0)
  // 偏航角
  heading: number = 0
  // 俯仰角
  pitch: number = 0
  // 翻滚角
  roll: number = 0
  // 视锥的角度，单位弧度
  fovRadians?: number
  // 偏航角，单位弧度
  headingRadians?: number
  // 俯仰角，单位弧度
  pitchRadians?: number
  // 翻滚角，单位弧度
  rollRadians?: number
  // 视锥图元
  frustumPrimitive?: Cesium.Primitive
  // 视锥边框图元
  outlinePrimitive?: Cesium.Primitive
  // 是否已销毁
  isDestroyed = false

  constructor(viewer: Cesium.Viewer, options: ViewFrustumOptions = {}) {
    this._viewer = viewer
    this.handleOptions(options)

    if (this.show) {
      this.add()
    }
  }

  /**
   * @description: 处理参数
   */
  handleOptions(options: ViewFrustumOptions) {
    const {
      show,
      fov,
      aspectWidth,
      aspectHeight,
      near,
      far,
      xOffset,
      yOffset,
      origin,
      vertexFormat,
      color,
      outlineColor,
      heading,
      pitch,
      roll
    } = options

    this.show = Cesium.defaultValue(show, deaultOptions.show)
    this.fov = Cesium.defaultValue(fov, deaultOptions.fov)
    this.aspectWidth = Cesium.defaultValue(
      aspectWidth,
      deaultOptions.aspectWidth
    )
    this.aspectHeight = Cesium.defaultValue(
      aspectHeight,
      deaultOptions.aspectHeight
    )
    this.near = Cesium.defaultValue(near, deaultOptions.near)
    this.far = Cesium.defaultValue(far, deaultOptions.far)
    this.xOffset = Cesium.defaultValue(xOffset, deaultOptions.xOffset)
    this.yOffset = Cesium.defaultValue(yOffset, deaultOptions.yOffset)
    this.origin = Cesium.defaultValue(origin, deaultOptions.origin)
    this.vertexFormat = Cesium.defaultValue(
      vertexFormat,
      deaultOptions.vertexFormat
    )
    this.color = Cesium.defaultValue(color, deaultOptions.color)
    this.outlineColor = Cesium.defaultValue(
      outlineColor,
      deaultOptions.outlineColor
    )
    this.heading = Cesium.defaultValue(heading, deaultOptions.heading)
    this.pitch = Cesium.defaultValue(pitch, deaultOptions.pitch)
    this.roll = Cesium.defaultValue(roll, deaultOptions.roll)

    this.fovRadians = Cesium.Math.toRadians(this.fov)
    this.headingRadians = Cesium.Math.toRadians(this.heading)
    this.pitchRadians = Cesium.Math.toRadians(this.pitch)
    this.rollRadians = Cesium.Math.toRadians(this.roll)

    this.updateOrientation()
    this.updateAspectRatio()
  }

  /**
   * @description: 更新视锥体
   */
  update() {
    this.clear()
    this.add()
  }

  /**
   * @description: 创建视锥体和轮廓线
   */
  add() {
    this.addFrustum()
    this.addOutline()
  }

  /**
   * @description: 清除视锥体和轮廓线
   */
  clear() {
    this.clearFrustum()
    this.clearOutline()
  }

  /**
   * @description: 清除视锥体
   */
  clearFrustum() {
    const viewer = this._viewer!
    if (this.frustumPrimitive) {
      viewer.scene.primitives.remove(this.frustumPrimitive)
      this.frustumPrimitive = undefined
    }
  }

  /**
   * @description: 清除轮廓线
   */
  clearOutline() {
    const viewer = this._viewer!
    if (this.outlinePrimitive) {
      viewer.scene.primitives.remove(this.outlinePrimitive)
      this.outlinePrimitive = undefined
    }
  }

  /**
   * @description: 创建视锥体
   */
  addFrustum() {
    if (this.frustumPrimitive) return
    const viewer = this._viewer!
    const frustum = new Cesium.PerspectiveFrustum({
      // 视场的角度(FOV)，单位为弧度
      fov: this.fovRadians,
      // 视锥的宽高比
      aspectRatio: this.aspectRatio,
      // 近平面的距离
      near: this.near,
      // 远平面的距离
      far: this.far,
      // x方向上的偏移量
      xOffset: this.xOffset,
      // y方向上的偏移量
      yOffset: this.yOffset
    })
    const geometry = new Cesium.FrustumGeometry({
      frustum,
      origin: this.origin,
      orientation: this.orientation,
      vertexFormat: this.vertexFormat
    })
    const geometryInstances = new Cesium.GeometryInstance({
      id: Cesium.createGuid(),
      geometry,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(this.color)
      }
    })
    const primitive = new Cesium.Primitive({
      show: this.show,
      geometryInstances,
      releaseGeometryInstances: true,
      appearance: new Cesium.PerInstanceColorAppearance({
        closed: true,
        flat: true
      }),
      asynchronous: false
    })
    this.frustumPrimitive = viewer.scene.primitives.add(primitive)
  }

  /**
   * @description: 创建轮廓线
   */
  addOutline() {
    if (this.outlinePrimitive) return
    const viewer = this._viewer!
    const frustum = new Cesium.PerspectiveFrustum({
      // 视场的角度(FOV)，单位为弧度
      fov: this.fovRadians,
      // 视锥的宽高比
      aspectRatio: this.aspectRatio,
      // 近平面的距离
      near: this.near,
      // 远平面的距离
      far: this.far,
      // x方向上的偏移量
      xOffset: this.xOffset,
      // y方向上的偏移量
      yOffset: this.yOffset
    })
    const geometry = new Cesium.FrustumOutlineGeometry({
      frustum,
      origin: this.origin,
      orientation: this.orientation
    })
    const geometryInstances = new Cesium.GeometryInstance({
      id: Cesium.createGuid(),
      geometry,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          this.outlineColor
        )
      }
    })
    const primitive = new Cesium.Primitive({
      show: this.show,
      geometryInstances,
      releaseGeometryInstances: true,
      appearance: new Cesium.PerInstanceColorAppearance({
        closed: true,
        flat: true
      }),
      asynchronous: false
    })
    this.outlinePrimitive = viewer.scene.primitives.add(primitive)
  }

  /**
   * @description: 显示视锥
   */
  toggleFrustum(val: boolean) {
    if (this.frustumPrimitive) {
      this.frustumPrimitive.show = val
    }
    if (this.outlinePrimitive) {
      this.outlinePrimitive.show = val
    }
    this.show = val
  }

  /**
   * @description: 显示视锥
   */
  showFrustum() {
    this.toggleFrustum(true)
  }

  /**
   * @description: 隐藏视锥
   */
  hideFrustum() {
    this.toggleFrustum(false)
  }

  /**
   * @description: 更新视锥原点方向
   */
  updateOrientation() {
    if (this.origin) {
      const hpr = new Cesium.HeadingPitchRoll(
        this.headingRadians,
        this.pitchRadians,
        this.rollRadians
      )
      const quaternion = Cesium.Transforms.headingPitchRollQuaternion(
        this.origin,
        hpr
      )
      this.orientation = quaternion
    }
  }

  /**
   * @description: 更新视锥的宽高比
   */
  updateAspectRatio() {
    const aspectWidth = this.aspectWidth
    const aspectHeight = this.aspectHeight
    const val =
      aspectWidth === null ||
      aspectWidth === undefined ||
      aspectHeight === null ||
      aspectHeight === undefined ||
      aspectHeight === 0
        ? 1
        : aspectWidth / aspectHeight
    this.aspectRatio = val
  }

  /**
   * @description: 更新选项
   */
  updateOptions(options: ViewFrustumOptions = {}) {
    this.handleOptions(options)
    this.update()
  }

  setFov(val: number) {
    this.fov = val
    this.fovRadians = Cesium.Math.toRadians(val)
  }
  setAspectWidth(val: number) {
    this.aspectWidth = val
    this.updateAspectRatio()
  }
  setAspectHeight(val: number) {
    this.aspectHeight = val
    this.updateAspectRatio()
  }
  setNear(val: number) {
    this.near = val
  }
  setFar(val: number) {
    this.far = val
  }
  setXOffset(val: number) {
    this.xOffset = val
  }
  setYOffset(val: number) {
    this.yOffset = val
  }
  setOrigin(val: Cesium.Cartesian3) {
    this.origin = val
    this.updateOrientation()
  }
  setHeading(heading: number) {
    this.heading = heading
    this.headingRadians = Cesium.Math.toRadians(heading)
    this.updateOrientation()
  }
  setPitch(pitch: number) {
    this.pitch = pitch
    this.pitchRadians = Cesium.Math.toRadians(pitch)
    this.updateOrientation()
  }
  setRoll(roll: number) {
    this.roll = roll
    this.rollRadians = Cesium.Math.toRadians(roll)
    this.updateOrientation()
  }
  setVertexFormat(val: Cesium.VertexFormat) {
    this.vertexFormat = val
  }
  setColor(val: Cesium.Color) {
    this.color = val
  }
  setOutlineColor(val: Cesium.Color) {
    this.outlineColor = val
  }

  /**
   * @description: 销毁
   */
  destroy() {
    if (this.isDestroyed) return
    this.clear()
    this._viewer = null
    this.isDestroyed = true
  }
}

export default ViewFrustum
