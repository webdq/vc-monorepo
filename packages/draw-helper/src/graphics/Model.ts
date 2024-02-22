import Graphics from './Graphics'
import ViewFrustum from './ViewFrustum'
import {
  unwrapColor,
  updateModel,
  updateLabel,
  updateAnimationEffect
} from '../utils/graphicsUpdate'
import {
  transformCartographicToCartesianArray,
  transformCartographicToCartesian
} from '../utils/graphicsValue'
import Tooltip from '../Tooltip'
import type {
  ViewFrustumOptions,
  EntityJsonData,
  GraphicsOptions,
  GraphicsEntityOptions,
  MovementData
} from '../types'
import dayjs from 'dayjs'

class Model extends Graphics {
  type = 'model'
  // 模型 url
  modelUrl: string = ''
  defaultModelUrl =
    'https://zouyaoji.top/vue-cesium/SampleData/models/CesiumAir/Cesium_Air.glb'
  constructor(
    viewer: Cesium.Viewer,
    tooltip: Tooltip,
    options: GraphicsOptions = {}
  ) {
    super(viewer, tooltip, options)
    this.modelUrl = this._options?.modelUrl ?? this.defaultModelUrl

    this.frustum = new ViewFrustum(viewer, options?.frustum)
    this._removeModelFrustumOriginFollowEvent =
      this._viewer!.clock.onTick.addEventListener(
        this.modelFrustumOriginFollow,
        this
      )

    this._marker.centerMarkerDragEvent.addEventListener((marker, cartesian) => {
      this.positions[0] = cartesian
      this.movementPathGraphics?.updateFirstPosition(cartesian)
    })
  }

  /**
   * @description: 开始绘制
   */
  start(options: GraphicsEntityOptions = {}) {
    const viewer = this._viewer!
    // 设置绘制状态
    this.setDrawingStatus(1)
    // 移除双击事件
    this.suspendInputAction()
    // 创建 handler
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    this.handler = handler
    // 监听点击，收集坐标点
    handler.setInputAction((movement: any) => {
      const cartesian = this.pickPosition(movement.position)
      if (!cartesian) return
      const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        viewer.scene,
        cartesian
      )
      this._tooltip.showAt(position, '单击左键绘制')
      // 点击添加坐标位置
      this.positions.push(cartesian)
      // 添加图形
      if (!this.entity) {
        this.entity = this.addGraphics(options)
      }
      this.complete()
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  /**
   * @description: 添加图形
   */
  addGraphics(options: GraphicsEntityOptions = {}) {
    const viewer = this._viewer!
    // 添加图形实体
    const entity = viewer.entities.add({
      type: this.type,
      name: '模型',
      position: new Cesium.CallbackProperty(() => {
        return this.positions[0]
      }, false),
      orientation: new Cesium.CallbackProperty(() => {
        const heading = Cesium.Math.toRadians(this.heading)
        const pitch = Cesium.Math.toRadians(this.pitch)
        const roll = Cesium.Math.toRadians(this.roll)
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(
          this.positions[0],
          hpr
        )
        return orientation
      }, false),
      model: {
        show: true,
        uri: this.modelUrl,
        scale: 1,
        minimumPixelSize: 60,
        incrementallyLoadTextures: true,
        runAnimations: true,
        clampAnimations: true,
        shadows: Cesium.ShadowMode.ENABLED,
        heightReference: Cesium.HeightReference.NONE,
        silhouetteColor: Cesium.Color.RED,
        silhouetteSize: 0,
        color: Cesium.Color.WHITE,
        colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
        colorBlendAmount: 0.5,
        ...(options.model || {})
      },
      label: {
        show: false,
        text: '模型',
        font: '20px sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        scale: 1,
        showBackground: false,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.5),
        backgroundPadding: new Cesium.Cartesian2(5, 5),
        pixelOffset: new Cesium.Cartesian2(0, 0),
        eyeOffset: new Cesium.Cartesian3(0, 0, 0),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        heightReference: Cesium.HeightReference.NONE,
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 0,
        ...(options.label || {})
      },
      properties: {
        graphics: this,
        ...(options.properties || {})
      },
      leftClick: () => {
        if (!this.isComplete) return
        if (!this.editable) return
        this.setEditMode(true)
        this.createMarker()
      },
      ...(options.entity || {})
    })

    this.entity = entity
    this.cacheColorPropertie()
    return entity
  }

  /**
   * @description: 更新视锥
   */
  updateFrustum(options: ViewFrustumOptions = {}) {
    if (this.frustum) {
      this.frustum?.updateOptions(options)
    }
  }

  /**
   * @description: 更新模型姿态，单位角度
   */
  updateModelHPR(heading: number, pitch: number, roll: number) {
    this.heading = heading
    this.pitch = pitch
    this.roll = roll
  }

  /**
   * @description: 重置模型姿态
   */
  resetModelHPR() {
    if (!this.entity) return
    this.entity.orientation = new Cesium.CallbackProperty(() => {
      const heading = Cesium.Math.toRadians(this.heading)
      const pitch = Cesium.Math.toRadians(this.pitch)
      const roll = Cesium.Math.toRadians(this.roll)
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        this.positions[0],
        hpr
      )
      return orientation
    }, false)
  }

  /**
   * @description: 重置模型位置
   */
  resetModelPosition() {
    if (!this.entity) return
    this.entity.position = new Cesium.CallbackProperty(() => {
      return this.positions[0]
    }, false) as any
  }

  /**
   * @description: 计算模型方向
   */
  computeModelOrientation() {
    const pos1 = this.positions[0]
    let pos2 = this.positions[1]
    if (!pos1) return
    if (!pos2) {
      pos2 = pos1.clone()
    }

    let heading = 0
    let pitch = 0
    const roll = Cesium.Math.toRadians(this.roll)

    // 是否是相同点位
    const isSamePos = Cesium.Cartesian3.equals(pos1, pos2)

    if (!isSamePos) {
      // 计算从 pos1 指向 pos2 的方向（世界坐标）
      const direction = Cesium.Cartesian3.subtract(
        pos2,
        pos1,
        new Cesium.Cartesian3()
      )
      Cesium.Cartesian3.normalize(direction, direction)

      // 获取 pos1 点的东北上（ENU）坐标系
      const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(pos1)
      const enuInverseMatrix = Cesium.Matrix4.inverse(
        enuMatrix,
        new Cesium.Matrix4()
      )

      // 将方向向量转换到 ENU 坐标系中
      const directionInENU = Cesium.Matrix4.multiplyByPointAsVector(
        enuInverseMatrix,
        direction,
        new Cesium.Cartesian3()
      )

      // 计算偏航角 heading (在 ENU 坐标系中，east是x轴，north是y轴)
      const angle = Math.atan2(directionInENU.y, directionInENU.x)
      const angle2 = Math.asin(
        directionInENU.z / Cesium.Cartesian3.magnitude(direction)
      )

      heading = Cesium.Math.TWO_PI - Cesium.Math.zeroToTwoPi(angle)
      pitch = Cesium.Math.TWO_PI - Cesium.Math.zeroToTwoPi(angle2)
    }

    // 构建朝向（Heading）、俯仰（Pitch）和翻滚（Roll）对象
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)

    // 将朝向对象转换为四元数
    const quaternion = Cesium.Transforms.headingPitchRollQuaternion(pos1, hpr)

    return quaternion
  }

  /**
   * @description: 更新模型移动
   */
  updateMovement(availability = false) {
    if (!this.movementData) return
    const { startDate: date1, stopDate: date2 } = this.movementData
    const startDate = dayjs(date1).toDate()
    const stopDate = dayjs(date2).toDate()
    // 开始时间
    const start = Cesium.JulianDate.fromDate(startDate)
    // 结束时间
    const stop = Cesium.JulianDate.fromDate(stopDate)
    // 坐标点集合
    const positions = this.movementPathGraphics?.getPositions() ?? []
    // 分割时间
    const times = this.splitTime(startDate, stopDate, positions.length)
    // 创建采样属性
    const property = new Cesium.SampledPositionProperty()
    // 添加采样时间和坐标
    property.addSamples(times, positions)
    // 设置算法
    property.setInterpolationOptions({
      interpolationDegree: 2,
      interpolationAlgorithm: Cesium.LinearApproximation
    })
    this.entity!.position = property
    this.entity!.orientation = new Cesium.VelocityOrientationProperty(property)

    if (availability) {
      this.entity!.availability = new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start,
          stop
        })
      ])
    }
  }

  /**
   * @description: 更新第一个坐标位置
   */
  updateFirstPosition(cartesian: Cesium.Cartesian3) {
    this.positions[0] = cartesian.clone()
    const marker = this._marker.getMarkerByIndex(0)
    if (marker) {
      marker.position = new Cesium.ConstantPositionProperty(cartesian.clone())
    }
  }

  /**
   * @description: 更新模型移动路径数据
   */
  setModelMovement(data: MovementData) {
    const pathEntity = this._viewer!.entities.getById(data?.pathId ?? '')
    const movementPathGraphics = pathEntity?.properties?.graphics?._value

    if (movementPathGraphics) {
      if (this.movementPathGraphics !== movementPathGraphics) {
        movementPathGraphics?.unbindModelGraphics(this)
      }
      if (movementPathGraphics.entity) {
        movementPathGraphics.entity.show = data?.showPath
      }
      const cartesians = this.convertDegreesToCartesianArray(
        data?.degress ?? []
      )
      movementPathGraphics?.bindModelGraphics(this)
      movementPathGraphics?.updatePositions(cartesians)
      this.updateFirstPosition(movementPathGraphics.positions[0])
      this.movementPathGraphics = movementPathGraphics
    }

    this.movementData = { ...data }
  }

  /**
   * @description: 删除模型移动路径
   */
  removeModelMovement() {
    this.movementPathGraphics?.unbindModelGraphics(this)
    this.movementPathGraphics = undefined
    this.movementData = undefined

    this.resetModelPosition()
    this.resetModelHPR()
    this.entity!.availability = undefined
  }

  /**
   * @description: 显示视锥
   */
  showFrustum() {
    this.frustum?.toggleFrustum(true)
  }

  /**
   * @description: 隐藏视锥
   */
  hideFrustum() {
    this.frustum?.toggleFrustum(false)
  }

  /**
   * @description: 加载数据
   */
  loadData(data: EntityJsonData, options: GraphicsEntityOptions = {}) {
    this.positions = transformCartographicToCartesianArray(
      data?.position?.cartographicDegrees
    )
    const { id, name, show, heading, pitch, roll, frustum } = data
    this.heading = heading || 0
    this.pitch = pitch || 0
    this.roll = roll || 0
    this.addGraphics({ ...options, entity: { id, name, show } })
    this.setDrawingStatus(2)
    updateModel(this.entity?.model, data)
    updateLabel(this.entity?.label, data)
    updateAnimationEffect(this, data)
    if (frustum) {
      const origin = transformCartographicToCartesian(
        frustum?.origin?.cartographicDegrees
      )
      const color = unwrapColor(frustum?.color?.rgba)
      const outlineColor = unwrapColor(frustum?.outlineColor?.rgba)
      this.updateFrustum({
        ...frustum,
        origin,
        color,
        outlineColor
      })
    }

    if (data.movementData) {
      setTimeout(() => {
        this.setModelMovement(data.movementData)
        this.updateMovement()
      })
    }
  }
}

export default Model
