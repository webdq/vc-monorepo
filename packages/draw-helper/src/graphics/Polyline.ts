import Graphics from './Graphics'
import {
  updatePolyline,
  updateLabel,
  updateProperties,
  updateAnimationEffect
} from '../utils/graphicsUpdate'
import { transformCartographicToCartesianArray } from '../utils/graphicsValue'
import Tooltip from '../Tooltip'
import Model from './Model'
import type {
  EntityJsonData,
  GraphicsOptions,
  GraphicsEntityOptions,
  SignalLineData
} from '../types'
import dayjs from 'dayjs'

class Polyline extends Graphics {
  type = 'polyline'
  constructor(
    viewer: Cesium.Viewer,
    tooltip: Tooltip,
    options: GraphicsOptions = {}
  ) {
    super(viewer, tooltip, options)

    this._marker.markerDragEndEvent.addEventListener((marker, cartesian) => {
      const index = this._marker.getMarkerIndex(marker)
      if (index === 0) {
        this.updateModelFirstPosition(cartesian)
      }
      this.updateModelMovement()
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
      // 第一次点击添加坐标位置
      if (this.positions.length === 0) {
        this.positions.push(cartesian.clone())
      }
      // 点击添加坐标位置
      this.positions.push(cartesian)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // 监听移动，创建图形
    handler.setInputAction((movement: any) => {
      const cartesian = this.pickPosition(movement.endPosition)
      if (!cartesian) return
      const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        viewer.scene,
        cartesian
      )
      if (this.positions.length === 0) {
        this._tooltip.showAt(position, '单击左键绘制第一个点')
      } else {
        this._tooltip.showAt(position, '单击左键绘制下一个点，双击左键结束绘制')
        // 添加图形
        if (!this.entity) {
          this.entity = this.addGraphics(options)
        }
        // 更新坐标位置
        this.positions.pop()
        this.positions.push(cartesian)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // 监听双击，结束绘制
    handler.setInputAction((movement: any) => {
      // 如果还没有创建实体，直接返回
      if (!this.entity) return
      // 如果坐标位置数量小于4个，直接返回
      if (this.positions.length < 4) return
      const cartesian = this.pickPosition(movement.position)
      if (!Cesium.defined(cartesian)) return
      // 删除最后2个坐标位置
      this.positions.pop()
      this.positions.pop()
      this.complete()
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  }

  /**
   * @description: 添加图形
   */
  addGraphics(options: GraphicsEntityOptions = {}) {
    const viewer = this._viewer!
    // 添加图形实体
    const entity = viewer.entities.add({
      type: this.type,
      name: '线',
      position: new Cesium.CallbackProperty(() => {
        return this.positions[0]
      }, false),
      polyline: {
        show: true,
        positions: new Cesium.CallbackProperty(() => {
          const positions =
            this.positions[0] && this.loop
              ? [...this.positions, this.positions[0]]
              : [...this.positions]
          return positions
        }, false),
        width: 2,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.fromCssColorString('#51ff00')
        ),
        arcType: Cesium.ArcType.GEODESIC,
        clampToGround: false,
        ...(options.polyline || {})
      },
      label: {
        show: false,
        text: '线',
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
        if (this.signalLineData) return
        this.createMarker(true)
      },
      mouseMove: (cartesian: Cesium.Cartesian3) => {
        if (!this.editMode && this.editable) {
          const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            viewer.scene,
            cartesian
          )
          this._tooltip.showAt(position, '单击左键编辑')
        }
      },
      mouseOut: () => {
        this._tooltip.setVisible(false)
      },
      updateLoop: (isLoop: boolean) => {
        this.loop = isLoop
        this._marker?.updateMarkerLoop(isLoop)
        this.updateModelMovement()
      },
      ...(options.entity || {})
    })
    this.entity = entity
    this.cacheColorPropertie()
    return entity
  }

  /**
   * @description: 更新信号线数据
   */
  setSignalLine(data: SignalLineData) {
    const entityIds = data?.entityIds || []
    // 实体的集合
    const entityList = entityIds
      .map((id) => {
        const entity = this._viewer?.entities.getById(id)
        return entity
      })
      .filter(Boolean) as Cesium.Entity[]
    this.signalLineEntityList = entityList
    // 实体的坐标集合
    const positions = entityList
      .map((entity) => {
        const pos = entity?.position?.getValue(Cesium.JulianDate.now())
        return pos
      })
      .filter(Boolean) as Cesium.Cartesian3[]
    // 更新坐标
    this.positions = positions
    this.signalLineData = { ...data }

    this.clear()

    const date1 = dayjs(data?.startDate).toDate()
    const date2 = dayjs(data?.stopDate).toDate()
    // 开始时间
    const start = Cesium.JulianDate.fromDate(date1)
    // 结束时间
    const stop = Cesium.JulianDate.fromDate(date2)
    this.entity!.availability = new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start,
        stop
      })
    ])

    this._removeSignalLineFollowEvent?.()
    this._removeSignalLineFollowEvent =
      this._viewer!.clock.onTick.addEventListener(this.signalLineFollow, this)
  }

  /**
   * @description: 删除信号线
   */
  removeSignalLine() {
    this._removeSignalLineFollowEvent?.()
    this._removeSignalLineFollowEvent = undefined
    this.entity!.availability = undefined
  }

  /**
   * @description: 更新线开始点的位置
   */
  updateFirstPosition(cartesian: Cesium.Cartesian3) {
    this.positions[0] = cartesian.clone()
    this.updateModelFirstPosition(cartesian)
  }

  /**
   * @description: 添加模型对象
   */
  bindModelGraphics(modelGraphics: Model) {
    this.movementModelGraphicsMap.set(modelGraphics.id, modelGraphics)
  }

  /**
   * @description: 删除模型对象
   */
  unbindModelGraphics(modelGraphics: Model) {
    this.movementModelGraphicsMap.delete(modelGraphics.id)
  }

  /**
   * @description: 更新模型的第一个坐标位置
   */
  updateModelFirstPosition(cartesian: Cesium.Cartesian3) {
    this.movementModelGraphicsMap.forEach((modelGraphics) => {
      modelGraphics.updateFirstPosition(cartesian)
      modelGraphics.updateMovement()
    })
  }

  /**
   * @description: 更新模型的运动
   */
  updateModelMovement() {
    this.movementModelGraphicsMap.forEach((modelGraphics) => {
      modelGraphics.updateMovement()
    })
  }

  /**
   * @description: 删除模型的路径数据
   */
  removeModelMovement() {
    this.movementModelGraphicsMap.forEach((modelGraphics) => {
      modelGraphics.removeModelMovement()
    })
  }

  /**
   * @description: 销毁前
   */
  beforeDestroy() {
    this.removeSignalLine()
    this.removeModelMovement()
    this.movementModelGraphicsMap.clear()
  }

  /**
   * @description: 加载数据
   */
  loadData(data: EntityJsonData, options: GraphicsEntityOptions = {}) {
    this.positions = transformCartographicToCartesianArray(
      data?.polyline?.positions?.cartographicDegrees
    )
    this.loop = !!data?.polyline?.loop
    const { id, name, show } = data
    this.addGraphics({ ...options, entity: { id, name, show } })
    this.setDrawingStatus(2)
    updatePolyline(this.entity?.polyline, data)
    updateLabel(this.entity?.label, data)
    updateProperties(this.entity?.properties, data)
    updateAnimationEffect(this, data)

    if (data.signalLineData) {
      setTimeout(() => {
        this.setSignalLine(data.signalLineData)
      })
    }
  }
}

export default Polyline
