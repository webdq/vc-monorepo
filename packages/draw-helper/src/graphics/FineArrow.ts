import Graphics from './Graphics'
import * as algorithm from '../utils/algorithm'
import {
  updatePolygon,
  updatePolyline,
  updateLabel,
  updateProperties,
  updateAnimationEffect
} from '../utils/graphicsUpdate'
import { transformCartographicToCartesianArray } from '../utils/graphicsValue'
import Tooltip from '../Tooltip'
import type {
  EntityJsonData,
  GraphicsOptions,
  GraphicsEntityOptions
} from '../types'

class FineArrow extends Graphics {
  type = 'fineArrow'
  constructor(
    viewer: Cesium.Viewer,
    tooltip: Tooltip,
    options: GraphicsOptions = {}
  ) {
    super(viewer, tooltip, options)
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
      // 如果已经创建实体，并且坐标位置数量大于等于2，结束绘制
      if (this.entity && this.positions.length >= 2) {
        this.complete()
      } else {
        // 第一次点击添加坐标位置
        if (this.positions.length === 0) {
          this.positions.push(cartesian.clone())
        }
        // 点击添加坐标位置
        this.positions.push(cartesian)
      }
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
        this._tooltip.showAt(position, '单击左键绘制下一个点，并结束绘制')
        // 添加图形
        if (!this.entity) {
          this.entity = this.addGraphics(options)
        }
        // 更新坐标位置
        this.positions.pop()
        this.positions.push(cartesian)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }

  /**
   * @description: 添加图形
   */
  addGraphics(options: GraphicsEntityOptions = {}) {
    const viewer = this._viewer!
    // 添加图形实体
    const entity = viewer.entities.add({
      type: this.type,
      name: '直线箭头',
      position: new Cesium.CallbackProperty(() => {
        return this.positions[0]
      }, false),
      polygon: {
        show: true,
        hierarchy: new Cesium.CallbackProperty(() => {
          const positions = this.computeArrowPositions(this.positions)
          return new Cesium.PolygonHierarchy(positions)
        }, false),
        height: 0,
        heightReference: Cesium.HeightReference.NONE,
        stRotation: 0,
        granularity: Cesium.Math.RADIANS_PER_DEGREE,
        fill: true,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.fromCssColorString('#ffa500').withAlpha(0.5)
        ),
        outline: false,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        perPositionHeight: false,
        closeTop: true,
        closeBottom: true,
        arcType: Cesium.ArcType.GEODESIC,
        shadows: Cesium.ShadowMode.DISABLED,
        classificationType: Cesium.ClassificationType.BOTH,
        ...(options.polygon || {})
      },
      polyline: {
        show: true,
        positions: new Cesium.CallbackProperty(() => {
          const positions = this.computeArrowPositions(this.positions)
          return positions[0] ? [...positions, positions[0]] : []
        }, false),
        width: 2,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.fromCssColorString('#51ff00')
        ),
        clampToGround: false,
        arcType: Cesium.ArcType.GEODESIC,
        ...(options.polyline || {})
      },
      label: {
        show: false,
        text: '直线箭头',
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
      ...(options.entity || {})
    })

    this.entity = entity
    this.cacheColorPropertie()
    return entity
  }

  /**
   * @description: 计算箭头的点位
   */
  computeArrowPositions(pos: Cesium.Cartesian3[] = []) {
    const [position1, position2] = pos
    if (!position1 || !position2) return []
    const point1 = this.convertCartesianToDegrees(position1)
    const point2 = this.convertCartesianToDegrees(position2)
    if (Math.abs(point2.longitude - point1.longitude) > 180) {
      if (point2.longitude < 0) point2.longitude = point2.longitude + 360
      if (point1.longitude < 0) point1.longitude = point1.longitude + 360
    }
    const positions = algorithm.fineArrow(
      [point1.longitude, point1.latitude],
      [point2.longitude, point2.latitude]
    )
    return Cesium.Cartesian3.fromDegreesArray(positions)
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
  ) {
    // 骨骼坐标数量
    const n = bones.length - 1
    // 箭头的点
    let positions: Cesium.Cartesian3[] = []
    // 是否小于等于开始时间
    const isLessThanStart = Cesium.JulianDate.lessThanOrEquals(time, start)
    // 是否大于等于结束时间
    const isGreaterThanStop = Cesium.JulianDate.greaterThanOrEquals(time, stop)

    if (isLessThanStart) {
      positions = []
    } else if (isGreaterThanStop) {
      positions = this.computeArrowPositions(this.positions)
    } else {
      const seconds = Cesium.JulianDate.secondsDifference(time, start)
      const x = seconds / dur
      const index = Math.floor(n * x)
      const tmp = bones.slice(0, index + 1)
      const pos = this.getLerpPosition(time, start, dur, index, bones)
      positions = this.computeArrowPositions([...bottomPoint, ...tmp, pos])
    }
    return positions
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
  ) {
    // 左边的点
    const left = bones[index]
    // 右边的点
    const right = bones[index + 1]
    // 点的数量
    const len = bones.length
    // 时间段份数
    const n = 1 / (len - 1)
    // 开始的秒数
    const startSeconds = n * index * dur
    // 结束的秒数
    const stopSeconds = n * (index + 1) * dur
    // 时间段 = 右点的时间 - 左点的时间
    const seconds = stopSeconds - startSeconds
    // 左边点的时间
    const leftDate = new Cesium.JulianDate()
    Cesium.JulianDate.addSeconds(start, startSeconds, leftDate)
    // 下一个点的时间
    const next = new Cesium.JulianDate()
    Cesium.JulianDate.addSeconds(time, 1, next)
    // 下一个点的时间段 秒
    const s = Cesium.JulianDate.secondsDifference(next, leftDate)
    let t = s / seconds
    if (t < 0) t = 0
    if (t > 1) t = 1
    const pos = new Cesium.Cartesian3()
    Cesium.Cartesian3.lerp(left, right, t, pos)
    return pos
  }

  /**
   * @description: 加载数据
   */
  loadData(data: EntityJsonData, options: GraphicsEntityOptions = {}) {
    this.positions = transformCartographicToCartesianArray(
      data?.polygon?.hierarchy?.positions?.cartographicDegrees
    )
    const { id, name, show } = data
    this.addGraphics({ ...options, entity: { id, name, show } })
    this.setDrawingStatus(2)
    updatePolygon(this.entity?.polygon, data)
    updatePolyline(this.entity?.polyline, data)
    updateLabel(this.entity?.label, data)
    updateProperties(this.entity?.properties, data)
    updateAnimationEffect(this, data)
  }
}

export default FineArrow
