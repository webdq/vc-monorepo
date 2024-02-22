import Model from './Model'
import Polyline from './Polyline'
import Marker from './Marker'
import ViewFrustum from './ViewFrustum'
import Tooltip from '../Tooltip'
import type {
  EntityJsonData,
  AnimationEffect,
  GraphicsOptions,
  GraphicsEntityOptions,
  SignalLineData,
  MovementData
} from '../types'
import dayjs from 'dayjs'
import Decimal from 'decimal.js'

class Graphics {
  // 视图对象
  _viewer: Cesium.Viewer | null
  // 提示框对象
  _tooltip: Tooltip
  // 选项参数
  _options: GraphicsOptions = {}
  // id
  _id: string = ''
  // 类型
  type: string = ''
  // 绘制状态 0 未开始 1 绘制中 2 绘制完成
  _drawingStatus = 0
  // 全局 handler
  _globeHandler?: Cesium.ScreenSpaceEventHandler
  // 缓存屏幕空间双击事件方法
  _screenSpaceLeftDoubleClickFn: any

  // 绘制的 handler
  handler?: Cesium.ScreenSpaceEventHandler
  // 图形实体
  entity?: Cesium.Entity
  // 坐标点位置集合
  positions: Cesium.Cartesian3[] = []
  // 是否已经创建标记点
  isMarkerCreated = false
  // 编辑模式
  editMode = false
  // 是否可编辑
  editable = true
  // 图形首尾点循环连接
  loop = false
  // 是否已销毁
  isDestroyed = false

  // 管理标记点
  _marker: Marker
  _removeMarkerLeftDownEvent?: Cesium.Event.RemoveCallback
  _removeMarkerDragStartEvent?: Cesium.Event.RemoveCallback
  _removeMarkerDragEvent?: Cesium.Event.RemoveCallback
  _removeMarkerDragEndEvent?: Cesium.Event.RemoveCallback
  _removeCenterMarkerDragEvent?: Cesium.Event.RemoveCallback
  _removeCirleMarkerDragEvent?: Cesium.Event.RemoveCallback
  _removeHalfMarkerLeftDownEvent?: Cesium.Event.RemoveCallback
  _removeMarkerMouseInEvent?: Cesium.Event.RemoveCallback
  _removeMarkerMouseOutEvent?: Cesium.Event.RemoveCallback

  // 动画效果数据
  animationEffect?: AnimationEffect
  // 默认颜色
  defaultColor = Cesium.Color.fromCssColorString('rgba(255, 165, 0, 0.5)')
  // 默认边框颜色
  defaultOutlineColor = Cesium.Color.fromCssColorString('#51ff00')
  // 缓存的颜色
  cacheColor?: any = Cesium.Color.RED.clone()
  // 缓存的边框颜色
  cacheOutlineColor?: any = Cesium.Color.BLACK.clone()

  // 信号线实体集合
  signalLineData?: SignalLineData
  signalLineEntityList: Cesium.Entity[] = []
  // 移除信号线跟随监听的事件
  _removeSignalLineFollowEvent?: Cesium.Event.RemoveCallback

  // 模型移动路径的数据
  movementData?: MovementData
  movementPathGraphics?: Polyline
  movementModelGraphicsMap: Map<string, Model> = new Map()

  // 偏航角
  heading = 0
  // 俯仰角
  pitch = 0
  // 翻滚角
  roll = 0
  // 视锥
  frustum?: ViewFrustum
  // 移除模型视锥原点跟随监听的事件
  _removeModelFrustumOriginFollowEvent?: Cesium.Event.RemoveCallback

  // 绘制完事件
  drawCompleteEvent: Cesium.Event = new Cesium.Event()
  // 选中图形元素事件
  graphicsActiveEvent: Cesium.Event = new Cesium.Event()

  constructor(
    viewer: Cesium.Viewer,
    tooltip: Tooltip,
    options: GraphicsOptions = {}
  ) {
    this._viewer = viewer
    this._tooltip = tooltip
    this._options = Object.assign({}, options)
    this._id = options?.id || Cesium.createGuid()
    this._marker = new Marker(viewer, this)

    this.addMarkerEventListener()
  }

  /**
   * @description: 监听标记点事件
   */
  addMarkerEventListener() {
    //  标记点按下
    this._removeMarkerLeftDownEvent =
      this._marker.markerLeftDownEvent.addEventListener((marker, cartesian) => {
        this._tooltip.setVisible(false)
        this.enableRotation(false)
        this._options?.onMarkerLeftDown?.(this, this.entity!, marker, cartesian)
      })
    // 标记点拖拽开始
    this._removeMarkerDragStartEvent =
      this._marker.markerDragStartEvent.addEventListener(
        (marker, cartesian) => {
          this._options?.onMarkerDragStart?.(
            this,
            this.entity!,
            marker,
            cartesian
          )
        }
      )
    // 标记点拖拽
    this._removeMarkerDragEvent = this._marker.markerDragEvent.addEventListener(
      (marker, position_index, cartesian) => {
        this.positions[position_index] = cartesian
        this._options?.onMarkerDrag?.(this, this.entity!, marker, cartesian)
      }
    )
    // 标记点拖拽结束
    this._removeMarkerDragEndEvent =
      this._marker.markerDragEndEvent.addEventListener((marker, cartesian) => {
        this.enableRotation(true)
        this._options?.onMarkerDragEnd?.(this, this.entity!, marker, cartesian)
      })
    // 中心标记点拖拽
    this._removeCenterMarkerDragEvent =
      this._marker.centerMarkerDragEvent.addEventListener(
        (marker, cartesian) => {
          this.positions[0] = cartesian
          this._options?.onMarkerDrag?.(this, this.entity!, marker, cartesian)
        }
      )
    // 圆形中心点拖拽
    this._removeCirleMarkerDragEvent =
      this._marker.cirleMarkerDragEvent.addEventListener(
        (marker, cartesian, cartesian2) => {
          this.positions[0] = cartesian
          this.positions[1] = cartesian2
          this._options?.onMarkerDrag?.(
            this,
            this.entity!,
            marker,
            cartesian,
            cartesian2
          )
        }
      )
    // 半标记点按下
    this._removeHalfMarkerLeftDownEvent =
      this._marker.halfMarkerLeftDownEvent.addEventListener(
        (position_index, cartesian) => {
          this.positions.splice(position_index, 0, cartesian)
        }
      )
    // 标记点移入
    this._removeMarkerMouseInEvent =
      this._marker.markerMouseInEvent.addEventListener((marker, cartesian) => {
        if (!cartesian) return
        const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          this._viewer!.scene,
          cartesian
        )
        let message = ''
        if (marker.name === 'center_marker') {
          message = '按下左键后移动中心点'
        } else if (marker.name === 'half_marker') {
          message = '按下左键后移动，生成新的点'
        } else if (marker.name === 'marker') {
          message = '按下左键后移动点'
        }
        this._tooltip.showAt(position, message)
      })
    // 标记点移出
    this._removeMarkerMouseOutEvent =
      this._marker.markerMouseOutEvent.addEventListener(() => {
        this._tooltip.setVisible(false)
      })
  }

  /**
   * @description: 移除标记点事件
   */
  removeMarkerEventListener() {
    this._removeMarkerLeftDownEvent?.()
    this._removeMarkerDragStartEvent?.()
    this._removeMarkerDragEvent?.()
    this._removeMarkerDragEndEvent?.()
    this._removeCenterMarkerDragEvent?.()
    this._removeCirleMarkerDragEvent?.()
    this._removeHalfMarkerLeftDownEvent?.()
    this._removeMarkerMouseInEvent?.()
    this._removeMarkerMouseOutEvent?.()
  }

  get id() {
    return this._id
  }

  get options() {
    return this._options
  }

  get tooltip() {
    return this._tooltip
  }

  get marker() {
    return this._marker
  }

  get isDrawing() {
    return this._drawingStatus === 1
  }

  get isComplete() {
    return this._drawingStatus === 2
  }

  get drawingStatus() {
    return this._drawingStatus
  }

  get isArrow() {
    return (
      this.type === 'attackArrow' ||
      this.type === 'doubleArrow' ||
      this.type === 'fineArrow' ||
      this.type === 'gatheringPlace' ||
      this.type === 'tailedAttackArrow'
    )
  }

  /**
   * @description: 开始绘制
   */
  start(options: GraphicsEntityOptions = {}) {}
  /**
   * @description: 完成绘制
   */
  complete() {
    this._tooltip.setVisible(false)
    this.setDrawingStatus(2)
    this.clear()
    this.drawCompleteEvent.raiseEvent(this as any, this.entity as any)
  }
  /**
   * @description: 终止绘制
   */
  discontinue() {
    this.removeGraphicsEntity()
    this.clear()
  }
  /**
   * @description: 添加图形
   */
  addGraphics(options: GraphicsEntityOptions = {}) {
    return new Cesium.Entity()
  }
  /**
   * @description: 加载数据
   */
  loadData(data: EntityJsonData, options: GraphicsEntityOptions = {}) {}

  /**
   * @description: 设置标绘的状态
   */
  setDrawingStatus(val: number) {
    this._drawingStatus = val
  }

  /**
   * @description: 设置是否可编辑
   */
  setEditable(val: boolean) {
    this.editable = val
  }

  /**
   * @description: 设置形状的编辑状态
   */
  setEditMode(editMode: boolean) {
    if (editMode) {
      this.graphicsActiveEvent.raiseEvent(this as any)
    }
    if (this.editMode === editMode) return
    if (editMode) {
      // 创建全局 handler，设置未拾取到元素取消选中状态
      this.createGlobeHandler()
    } else {
      this.clear()
    }
    this.editMode = editMode
  }

  /**
   * @description: 创建标记点
   */
  createMarker(isCreateHalfMarker = false) {
    if (this.isMarkerCreated) return
    // 所有点位置
    const positions = this.positions
    // 是否首尾连接
    const loop = this.loop

    if (this.type === 'model') {
      this._marker.addMarker(this.positions[0], {
        name: 'center_marker',
        properties: {
          marker_index: 0,
          position_index: 0
        }
      })
    } else if (this.type === 'circle') {
      // 创建中心标记点
      this._marker.addMarker(this.positions[0], {
        name: 'center_marker',
        properties: {
          marker_index: 0,
          position_index: 0
        }
      })
      // 创建标记点
      this._marker.addMarker(this.positions[1], {
        name: 'marker',
        properties: {
          marker_index: 1,
          position_index: 1
        }
      })
    } else {
      for (let i = 0; i < positions.length; i++) {
        // 点的坐标
        const cartesian = positions[i]
        // 创建标记点
        this._marker.addMarker(cartesian, {
          name: 'marker',
          properties: {
            marker_index: i * 2,
            position_index: i
          }
        })

        // 创建半标记点
        if (isCreateHalfMarker) {
          if (i < positions.length - 1 || loop) {
            // 左边坐标位置的索引
            const leftIndex = i
            // 右边坐标位置的索引
            const rightIndex = i === positions.length - 1 && loop ? 0 : i + 1
            // 获取中间点的坐标
            const cartesian = Cesium.Cartesian3.midpoint(
              positions[leftIndex],
              positions[rightIndex],
              new Cesium.Cartesian3()
            )
            // 创建半标记点
            this._marker.addMarker(cartesian, {
              name: 'half_marker',
              properties: {
                marker_index: i * 2 + 1,
                marker_left_position_index: leftIndex,
                marker_right_position_index: rightIndex,
                marker_position_index: [leftIndex, rightIndex]
              }
            })
          }
        }
      }
    }

    this.isMarkerCreated = true
  }

  /**
   * @description: 拾取坐标转换
   */
  pickPosition(position: Cesium.Cartesian2) {
    const scene = this._viewer?.scene
    if (!position || !scene) return
    const ray = scene.camera.getPickRay(position)
    if (!ray) return
    const cartesian = scene.globe.pick(ray, scene)
    return cartesian
  }

  /**
   * @description: 更新所有坐标位置
   */
  updatePositions(cartesians: Cesium.Cartesian3[]) {
    const list = cartesians.map((cartesian) => cartesian.clone())
    this.positions = list
  }

  /**
   * @description: 获取所有坐标位置
   */
  getPositions() {
    const positions =
      this.positions[0] && this.loop
        ? [...this.positions, this.positions[0]]
        : [...this.positions]
    return positions
  }

  /**
   * @description: 计算圆形外轮廓点位
   */
  calcOutlinePositions(point: Cesium.Cartesian3, radius: number) {
    const circle = new Cesium.CircleOutlineGeometry({
      center: point,
      radius: radius,
      granularity: Cesium.Math.RADIANS_PER_DEGREE
    })
    const geometry = Cesium.CircleOutlineGeometry.createGeometry(circle)

    const arr = [].slice.call(geometry?.attributes?.position?.values || [])
    const length = arr.length / 3
    const positionList = []
    let i = 0,
      j = 0,
      k = 0
    for (i = 0; i < length; i++) {
      positionList[i] = []
      for (j = 0; j < 3; j++) {
        positionList[i][j] = arr[k]
        k++
        if (k > arr.length - 1) {
          break
        }
      }
    }
    const positions = []
    for (i = 0; i < positionList.length; i++) {
      positions.push(
        new Cesium.Cartesian3(
          positionList[i][0],
          positionList[i][1],
          positionList[i][2]
        )
      )
    }
    return positions
  }

  /**
   * @description: 缓存颜色属性
   */
  cacheColorPropertie() {
    if (!this.entity) return

    if (this.type === 'billboard' || this.type === 'pin') {
      this.cacheColor = this.entity?.billboard?.color
      // 监听属性更新
      this.entity?.billboard?.definitionChanged.addEventListener(
        (_: any, name: string, value: any) => {
          if (name === 'color' && !this.animationEffect) {
            this.cacheColor = value
          }
        }
      )
    }
    if (this.type === 'point') {
      this.cacheColor = this.entity?.point?.color
      this.cacheOutlineColor = this.entity?.point?.outlineColor
      // 监听属性更新
      this.entity?.point?.definitionChanged.addEventListener(
        (_: any, name: string, value: any) => {
          if (name === 'color' && !this.animationEffect) {
            this.cacheColor = value
          }
          if (name === 'outlineColor' && !this.animationEffect) {
            this.cacheOutlineColor = value
          }
        }
      )
    }
    if (this.type === 'polyline') {
      this.cacheColor = this.entity?.polyline?.material
      // 监听属性更新
      this.entity?.polyline?.definitionChanged.addEventListener(
        (_: any, name: string, value: any) => {
          if (name === 'material' && !this.animationEffect) {
            this.cacheColor = value
          }
        }
      )
    }
    if (this.type === 'rectangle') {
      this.cacheColor = this.entity?.rectangle?.material
      this.cacheOutlineColor = this.entity?.polyline?.material
      // 监听属性更新
      this.entity?.rectangle?.definitionChanged.addEventListener(
        (_: any, name: string, value: any) => {
          if (name === 'material' && !this.animationEffect) {
            this.cacheColor = value
          }
        }
      )
      this.entity?.polyline?.definitionChanged.addEventListener(
        (_: any, name: string, value: any) => {
          if (name === 'material' && !this.animationEffect) {
            this.cacheOutlineColor = value
          }
        }
      )
    }
    if (this.type === 'circle') {
      this.cacheColor = this.entity?.ellipse?.material
      this.cacheOutlineColor = this.entity?.polyline?.material
      // 监听属性更新
      this.entity?.ellipse?.definitionChanged.addEventListener(
        (_: any, name: string, value: any) => {
          if (name === 'material' && !this.animationEffect) {
            this.cacheColor = value
          }
        }
      )
      this.entity?.polyline?.definitionChanged.addEventListener(
        (_: any, name: string, value: any) => {
          if (name === 'material' && !this.animationEffect) {
            this.cacheOutlineColor = value
          }
        }
      )
    }
    if (this.type === 'polygon' || this.isArrow) {
      this.cacheColor = this.entity?.polygon?.material
      this.cacheOutlineColor = this.entity?.polyline?.material
      // 监听属性更新
      this.entity?.polygon?.definitionChanged.addEventListener(
        (_: any, name: string, value: any) => {
          if (name === 'material' && !this.animationEffect) {
            this.cacheColor = value
          }
        }
      )
      this.entity?.polyline?.definitionChanged.addEventListener(
        (_: any, name: string, value: any) => {
          if (name === 'material' && !this.animationEffect) {
            this.cacheOutlineColor = value
          }
        }
      )
    }
    if (this.type === 'model') {
      this.cacheColor = this.entity?.model?.color
      // 监听属性更新
      this.entity?.model?.definitionChanged.addEventListener(
        (_: any, name: string, value: any) => {
          if (name === 'color' && !this.animationEffect) {
            this.cacheColor = value
          }
        }
      )
    }
  }

  /**
   * @description: 检查箭头坐标点集合长度
   */
  checkArrowGrowPositionLength() {
    if (
      (this.type === 'attackArrow' ||
        this.type === 'gatheringPlace' ||
        this.type === 'tailedAttackArrow') &&
      this.positions.length < 3
    ) {
      return false
    }
    if (this.type === 'doubleArrow' && this.positions.length < 4) {
      return false
    }
    if (this.type === 'fineArrow' && this.positions.length < 2) {
      return false
    }
    return true
  }

  /**
   * @description: 分割时间
   */
  splitTime(startDate: Date, stopDate: Date, len: number = 0) {
    if (len < 1) return []
    const start = dayjs(startDate)
    const stop = dayjs(stopDate)
    const startValue = start.valueOf()
    const stopValue = stop.valueOf()
    const val = stopValue - startValue
    const avg = Decimal.div(val, len - 1)
    const result: Cesium.JulianDate[] = []
    for (let i = 0; i < len; i++) {
      const ms = Decimal.mul(avg, i).toNumber()
      const date = start.add(ms, 'ms').toDate()
      result.push(Cesium.JulianDate.fromDate(date))
    }
    result[len - 1] = Cesium.JulianDate.fromDate(stop.toDate())
    return result
  }

  /**
   * @description: 闪烁效果
   */
  flash(
    startDate: Date,
    stopDate: Date,
    animationEffect: AnimationEffect,
    availability = false
  ) {
    if (this.animationEffect) this.removeAnimationEffect()
    // 开始时间
    const start = Cesium.JulianDate.fromDate(startDate)
    // 结束时间
    const stop = Cesium.JulianDate.fromDate(stopDate)
    const flashColor1 = animationEffect?.flashColor1 || '#FF0000'
    const flashColor2 = animationEffect?.flashColor2 || '#0000FF'
    const color1 = Cesium.Color.fromCssColorString(flashColor1)
    const color2 = Cesium.Color.fromCssColorString(flashColor2)
    const callback = new Cesium.CallbackProperty((time) => {
      // 秒数取整
      const s = Math.floor(time.secondsOfDay)
      // 每隔2秒切换颜色
      const color = s % 2 === 0 ? color1 : color2
      return color.clone()
    }, false)
    // 先标记状态,否则会触发图形属性修改监听事件
    this.animationEffect = animationEffect
    if (this.entity) {
      if (this.type === 'billboard' || this.type === 'pin') {
        this.entity.billboard!.color = callback
      }
      if (this.type === 'point') {
        this.entity.point!.color = callback
        this.entity.point!.outlineColor = callback
      }
      if (this.type === 'polyline') {
        this.entity.polyline!.material = new Cesium.ColorMaterialProperty(
          callback
        )
      }
      if (this.type === 'rectangle') {
        this.entity.rectangle!.material = new Cesium.ColorMaterialProperty(
          callback
        )
        this.entity.polyline!.material = new Cesium.ColorMaterialProperty(
          callback
        )
      }
      if (this.type === 'circle') {
        this.entity.ellipse!.material = new Cesium.ColorMaterialProperty(
          callback
        )
        this.entity.polyline!.material = new Cesium.ColorMaterialProperty(
          callback
        )
      }
      if (this.type === 'polygon' || this.isArrow) {
        this.entity.polygon!.material = new Cesium.ColorMaterialProperty(
          callback
        )
        this.entity.polyline!.material = new Cesium.ColorMaterialProperty(
          callback
        )
      }
      if (this.type === 'model') {
        this.entity.model!.color = callback
      }
    }

    if (availability) {
      if (this.entity) {
        this.entity.availability = new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start,
            stop
          })
        ])
      }
    }
  }

  /**
   * @description: 淡入淡出效果
   */
  fade(
    startDate: Date,
    stopDate: Date,
    animationEffect: AnimationEffect,
    availability = false
  ) {
    if (this.animationEffect) this.removeAnimationEffect()
    // 开始时间
    const start = Cesium.JulianDate.fromDate(startDate)
    // 结束时间
    const stop = Cesium.JulianDate.fromDate(stopDate)
    // 递增递减透明值
    const a = 1 / 60
    // 透明值
    let x = 0
    // 透明的颜色
    const color = Cesium.Color.RED.clone()
    const callback = new Cesium.CallbackProperty((time: Cesium.JulianDate) => {
      if (Cesium.JulianDate.lessThanOrEquals(time, start)) x = 0
      if (Cesium.JulianDate.greaterThanOrEquals(time, stop)) x = 1
      const s = Math.floor(time.secondsOfDay)
      x = x + (s % 2 === 0 ? a : -a)
      if (x <= 0) {
        x = 0
      }
      if (x >= 1) {
        x = 1
      }
      return color.withAlpha(x)
    }, false)
    // 先标记状态,否则会触发图形属性修改监听事件
    this.animationEffect = animationEffect
    if (this.entity) {
      if (this.type === 'billboard' || this.type === 'pin') {
        this.entity.billboard!.color = callback
      }
      if (this.type === 'point') {
        this.entity.point!.color = callback
        this.entity.point!.outlineColor = callback
      }
      if (this.type === 'polyline') {
        this.entity.polyline!.material = new Cesium.ColorMaterialProperty(
          callback
        )
      }
      if (this.type === 'rectangle') {
        this.entity.rectangle!.material = new Cesium.ColorMaterialProperty(
          callback
        )
        this.entity.polyline!.material = new Cesium.ColorMaterialProperty(
          callback
        )
      }
      if (this.type === 'circle') {
        this.entity.ellipse!.material = new Cesium.ColorMaterialProperty(
          callback
        )
        this.entity.polyline!.material = new Cesium.ColorMaterialProperty(
          callback
        )
      }
      if (this.type === 'polygon' || this.isArrow) {
        this.entity.polygon!.material = new Cesium.ColorMaterialProperty(
          callback
        )
        this.entity.polyline!.material = new Cesium.ColorMaterialProperty(
          callback
        )
      }
      if (this.type === 'model') {
        this.entity.model!.color = callback
      }
    }

    if (availability) {
      if (this.entity) {
        this.entity.availability = new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start,
            stop
          })
        ])
      }
    }
  }

  /**
   * @description: 位移效果
   */
  displacement(
    startDate: Date,
    stopDate: Date,
    animationEffect: AnimationEffect,
    availability = false
  ) {
    // todo 修改整体坐标位移
    if (this.animationEffect) this.removeAnimationEffect()
    // 开始时间
    const start = Cesium.JulianDate.fromDate(startDate)
    // 结束时间
    const stop = Cesium.JulianDate.fromDate(stopDate)
    // 坐标点集合
    const positions = this.convertDegreesToCartesianArray(
      animationEffect?.degress ?? []
    )
    // 分割时间
    const times = this.splitTime(
      startDate,
      stopDate,
      animationEffect?.degress?.length || 0
    )
    // 创建采样属性
    const property = new Cesium.SampledPositionProperty()
    // 添加采样时间和坐标
    property.addSamples(times, positions)
    // 设置算法
    property.setInterpolationOptions({
      interpolationDegree: 2,
      interpolationAlgorithm: Cesium.LinearApproximation
    })
    // 先标记状态,否则会触发图形属性修改监听事件
    this.animationEffect = animationEffect
    if (this.entity) {
      // todo 目前移动的是单个坐标位置
      if (this.type === 'model') {
        this.entity.position = property
        this.entity.orientation = new Cesium.VelocityOrientationProperty(
          property
        )
      }
    }
    if (availability) {
      if (this.entity) {
        this.entity.availability = new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start,
            stop
          })
        ])
      }
    }
  }

  /**
   * @description: 生长效果
   */
  grow(
    startDate: Date,
    stopDate: Date,
    animationEffect: AnimationEffect,
    availability = false
  ) {
    if (this.animationEffect) this.removeAnimationEffect()

    if (!this.checkArrowGrowPositionLength()) return

    const pos1 = this.positions[0].clone()
    const pos2 = this.positions[1].clone()
    // 箭头尾部中心点
    const center = new Cesium.Cartesian3()
    Cesium.Cartesian3.add(pos1, pos2, center)
    Cesium.Cartesian3.divideByScalar(center, 2, center)

    // 骨骼坐标点集合
    let bones: Cesium.Cartesian3[] = []
    // 箭头尾部点集合
    let bottomPoint: Cesium.Cartesian3[] = []

    if (this.type === 'fineArrow') {
      bones = [...this.positions.map((pos) => pos.clone())]
      bottomPoint = []
    } else {
      bones = [center, ...this.positions.slice(2).map((pos) => pos.clone())]
      bottomPoint = [pos1, pos2]
    }

    // 开始时间
    const start = Cesium.JulianDate.fromDate(startDate)
    // 结束时间
    const stop = Cesium.JulianDate.fromDate(stopDate)
    // 持续时间 秒
    const dur = Cesium.JulianDate.secondsDifference(stop, start)

    // 多边形坐标点集合
    const callback = new Cesium.CallbackProperty((time: Cesium.JulianDate) => {
      const positions = this.getLerpArrow(
        time,
        start,
        stop,
        dur,
        bones,
        bottomPoint
      )
      return new Cesium.PolygonHierarchy(positions)
    }, false)
    // 线段坐标点集合
    const callback2 = new Cesium.CallbackProperty((time: Cesium.JulianDate) => {
      const positions = this.getLerpArrow(
        time,
        start,
        stop,
        dur,
        bones,
        bottomPoint
      )
      return positions[0] ? [...positions, positions[0]] : []
    }, false)

    // 先标记状态,否则会触发图形属性修改监听事件
    this.animationEffect = animationEffect
    if (this.entity) {
      if (this.isArrow) {
        this.entity.polygon!.hierarchy = callback
        this.entity.polyline!.positions = callback2
      }
    }

    if (availability) {
      if (this.entity) {
        this.entity.availability = new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start,
            stop
          })
        ])
      }
    }
  }

  /**
   * @description: 信号线跟随实体位置
   */
  signalLineFollow(e: any) {
    const positions = this.signalLineEntityList
      .map((entity) => {
        const pos = entity?.position?.getValue(e.currentTime)
        return pos
      })
      .filter(Boolean) as Cesium.Cartesian3[]
    // 更新坐标
    this.positions = positions
  }

  /**
   * @description: 模型视锥原点随模型位置
   */
  modelFrustumOriginFollow = async (e: any) => {
    const t = Math.floor(e.currentTime.secondsOfDay)
    if (t % 1 === 0) {
      if (this.frustum) {
        // 当前模型的位置
        const oldPosition = this.entity?.position?.getValue(e.currentTime)
        // 新的位置
        let newPosition = oldPosition
        // 模型是否贴地
        const heightReference = this.entity?.model?.heightReference?.getValue(
          e.currentTime
        )
        // 贴地
        if (heightReference === Cesium.HeightReference.CLAMP_TO_GROUND) {
          if (oldPosition) {
            // 当前模型的地理坐标
            const oldCartographic =
              Cesium.Cartographic.fromCartesian(oldPosition)
            // 获取贴地的地理坐标
            const cartographics = await Cesium.sampleTerrainMostDetailed(
              this._viewer!.terrainProvider,
              [
                new Cesium.Cartographic(
                  oldCartographic.longitude,
                  oldCartographic.latitude
                )
              ]
            )
            // 新的地理坐标
            const newCartographic = cartographics?.[0]
            if (newCartographic) {
              const longitude = Cesium.Math.toDegrees(newCartographic.longitude)
              const latitude = Cesium.Math.toDegrees(newCartographic.latitude)
              const height = newCartographic.height
              newPosition = Cesium.Cartesian3.fromDegrees(
                longitude,
                latitude,
                height
              )
            }
          }
        }

        if (newPosition) {
          this.frustum?.setOrigin(newPosition)
          this.frustum?.update()
        } else {
          this.frustum?.clear()
        }
      }
    }
  }

  /**
   * @description: 删除动画效果
   */
  removeAnimationEffect() {
    if (this.entity) {
      this.entity.position = new Cesium.CallbackProperty(() => {
        return this.positions[0]
      }, false) as any

      if (this.entity.orientation) {
        this.entity.orientation = new Cesium.CallbackProperty(() => {
          const heading = Cesium.Math.toRadians(this.heading)
          const pitch = Cesium.Math.toRadians(this.pitch)
          const roll = Cesium.Math.toRadians(this.roll)
          const orientation = Cesium.Transforms.headingPitchRollQuaternion(
            this.positions[0],
            new Cesium.HeadingPitchRoll(heading, pitch, roll)
          )
          return orientation
        }, false)
      }

      if (this.isArrow) {
        this.entity!.polygon!.hierarchy = new Cesium.CallbackProperty(() => {
          const positions = this.computeArrowPositions(this.positions)
          return new Cesium.PolygonHierarchy(positions)
        }, false)
        this.entity!.polyline!.positions = new Cesium.CallbackProperty(() => {
          const positions = this.computeArrowPositions(this.positions)
          return positions[0] ? [...positions, positions[0]] : []
        }, false)
      }

      if (this.type === 'billboard' || this.type === 'pin') {
        this.entity!.billboard!.color = this.cacheColor
      }
      if (this.type === 'point') {
        this.entity!.point!.color = this.cacheColor
        this.entity!.point!.outlineColor = this.cacheOutlineColor
      }
      if (this.type === 'polyline') {
        this.entity!.polyline!.material = this.cacheColor
      }
      if (this.type === 'rectangle') {
        this.entity!.rectangle!.material = this.cacheColor
        this.entity!.polyline!.material = this.cacheOutlineColor
      }
      if (this.type === 'circle') {
        this.entity!.ellipse!.material = this.cacheColor
        this.entity!.polyline!.material = this.cacheOutlineColor
      }
      if (this.type === 'polygon' || this.isArrow) {
        this.entity!.polygon!.material = this.cacheColor
        this.entity!.polyline!.material = this.cacheOutlineColor
      }
      if (this.type === 'model') {
        this.entity!.model!.color = this.cacheColor
      }

      this.entity.availability = undefined
    }
    this.animationEffect = undefined
  }

  /**
   * @description: 播放动画效果
   */
  playAnimation(date1: string, date2: string) {
    const d1 = dayjs(date1).toDate()
    const d2 = dayjs(date2).toDate()
    const startTime = Cesium.JulianDate.fromDate(d1)
    const stopTime = Cesium.JulianDate.fromDate(d2)
    const viewer = this._viewer!
    viewer.timeline?.zoomTo(startTime, stopTime)
    viewer.clock.startTime = startTime.clone()
    viewer.clock.stopTime = stopTime.clone()
    viewer.clock.currentTime = startTime.clone()
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP
    viewer.clock.multiplier = 10
    viewer.clock.shouldAnimate = true
  }

  /**
   * @description: 计算箭头的点位
   */
  computeArrowPositions(pos: Cesium.Cartesian3[] = []): Cesium.Cartesian3[] {
    return []
  }

  /**
   * @description: 计算插值的箭头点位
   */
  getLerpArrow(
    time: Cesium.JulianDate,
    start: Cesium.JulianDate,
    stop: Cesium.JulianDate,
    dur: number,
    bones: Cesium.Cartesian3[],
    bottomPoint: Cesium.Cartesian3[]
  ): Cesium.Cartesian3[] {
    return []
  }

  /**
   * @description: 计算插值的点位
   */
  getLerpPosition(
    time: Cesium.JulianDate,
    start: Cesium.JulianDate,
    dur: number,
    index: number,
    bones: Cesium.Cartesian3[]
  ): Cesium.Cartesian3 {
    return new Cesium.Cartesian3()
  }

  /**
   * @description: 转换多个地理坐标为笛卡尔坐标
   */
  convertDegreesToCartesian(pos: any) {
    return Cesium.Cartesian3.fromDegrees(
      pos.longitude,
      pos.latitude,
      pos.height
    )
  }

  /**
   * @description: 转换多个地理坐标为笛卡尔坐标
   */
  convertDegreesToCartesianArray(positions: any[]) {
    const list = positions.map((pos) => this.convertDegreesToCartesian(pos))
    return list
  }

  /**
   * @description: 转换笛卡尔坐标为地理坐标
   */
  convertCartesianToDegrees(cartesian: Cesium.Cartesian3) {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    const height = cartographic.height
    return {
      longitude,
      latitude,
      height
    }
  }

  /**
   * @description: 转换笛卡尔坐标为地理坐标
   */
  convertCartesianToDegreesArray(cartesians: Cesium.Cartesian3[]) {
    const result = cartesians.map((cartesian) =>
      this.convertCartesianToDegrees(cartesian)
    )
    return result
  }

  /**
   * @description: 转换多个笛卡尔坐标为地理坐标 数组
   */
  convertCartesianToDegreesArray2(cartesians: Cesium.Cartesian3[] = []) {
    const result = cartesians.map((cartesian) => {
      const { longitude, latitude } = this.convertCartesianToDegrees(cartesian)
      return { longitude, latitude }
    })
    return result
  }

  /**
   * @description: 创建全局 handler
   */
  createGlobeHandler() {
    const viewer = this._viewer!
    // 创建全局 handler
    this._globeHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    // 设置点击事件
    this._globeHandler.setInputAction((movement: any) => {
      const pickedObject = viewer.scene.pick(movement.position)
      if (!(pickedObject && pickedObject.id)) {
        this.setEditMode(false)
        this.graphicsActiveEvent.raiseEvent()
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this._globeHandler.setInputAction((movement: any) => {
      const pos = this.pickPosition(movement.position)
      this._marker.handleMarkerDragEnd(pos)
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
  }

  /**
   * @description: 销毁全局 handler
   */
  removeGlobeHandler() {
    this._globeHandler?.destroy()
    this._globeHandler = undefined
  }

  /**
   * @description: 禁用相机旋转
   */
  enableRotation(enable: boolean) {
    this._viewer!.scene.screenSpaceCameraController.enableRotate = enable
    this._viewer!.scene.screenSpaceCameraController.enableTranslate = enable
  }

  /**
   * @description: 删除图形实体
   */
  removeGraphicsEntity() {
    if (this.entity) {
      this._viewer?.entities?.remove(this.entity)
    }
  }

  /**
   * @description: 缓存并移除双击事件
   */
  suspendInputAction() {
    const viewer = this._viewer!
    const fn = viewer.cesiumWidget.screenSpaceEventHandler.getInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )
    this._screenSpaceLeftDoubleClickFn = fn
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )
  }

  /**
   * @description: 恢复原有的双击事件
   */
  resumeInputAction() {
    const viewer = this._viewer!
    if (this._screenSpaceLeftDoubleClickFn) {
      viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(
        this._screenSpaceLeftDoubleClickFn,
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      )
    }
  }

  /**
   * @description: 清除
   */
  clear() {
    if (this.isDestroyed) return
    this._marker?.clear()
    this.removeGlobeHandler()
    this.resumeInputAction()
    this.handler?.destroy()
    this.handler = undefined
    this.isMarkerCreated = false
    this.editMode = false
    if (!this.isComplete) {
      this.destroy()
    }
  }

  beforeDestroy() {}

  /**
   * @description: 销毁
   */
  destroy() {
    if (this.isDestroyed) return
    this.beforeDestroy()
    this._removeModelFrustumOriginFollowEvent?.()
    this._removeSignalLineFollowEvent?.()
    this.removeMarkerEventListener()
    this.frustum?.destroy()
    this._marker?.destroy()
    this.removeGraphicsEntity()
    this.removeGlobeHandler()
    this._viewer = null
    this.isDestroyed = true
  }
}

export default Graphics
