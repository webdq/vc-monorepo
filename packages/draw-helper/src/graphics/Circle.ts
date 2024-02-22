import Graphics from './Graphics'
import { vec3 } from 'gl-matrix'
import {
  updateEllipse,
  updatePolyline,
  updateLabel,
  updateAnimationEffect
} from '../utils/graphicsUpdate'
import { transformCartographicToCartesianArray } from '../utils/graphicsValue'
import Tooltip from '../Tooltip'
import type {
  EntityJsonData,
  GraphicsOptions,
  GraphicsEntityOptions
} from '../types'

class Circle extends Graphics {
  type = 'circle'
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
      name: '圆形',
      position: new Cesium.CallbackProperty(() => {
        return this.positions[0]
      }, false),
      ellipse: {
        show: true,
        // 短轴半径
        semiMinorAxis: new Cesium.CallbackProperty(() => {
          const centerPosition = this.positions[0]
          const markerPosition = this.positions[1]
          if (!centerPosition || !markerPosition) return 0
          return Cesium.Cartesian3.distance(centerPosition, markerPosition)
        }, false),
        // 长轴半径
        semiMajorAxis: new Cesium.CallbackProperty(() => {
          const centerPosition = this.positions[0]
          const markerPosition = this.positions[1]
          if (!centerPosition || !markerPosition) return 0
          return Cesium.Cartesian3.distance(centerPosition, markerPosition)
        }, false),
        height: 0,
        heightReference: Cesium.HeightReference.NONE,
        rotation: 0,
        stRotation: 0,
        granularity: Cesium.Math.RADIANS_PER_DEGREE,
        fill: true,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.fromCssColorString('#ffa500').withAlpha(0.5)
        ),
        outline: false,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        numberOfVerticalLines: 16,
        shadows: Cesium.ShadowMode.DISABLED,
        classificationType: Cesium.ClassificationType.BOTH,
        ...(options.ellipse || {})
      },
      polyline: {
        show: true,
        positions: new Cesium.CallbackProperty(() => {
          const centerPosition = this.positions[0]
          const markerPosition = this.positions[1]
          if (!centerPosition || !markerPosition) return []
          const r = Cesium.Cartesian3.distance(centerPosition, markerPosition)
          const positions = this.calcOutlinePositions(centerPosition, r)
          return positions[0] ? [...positions, positions[0]] : []
        }, false),
        width: 2,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.fromCssColorString('#51ff00')
        ),
        granularity: Cesium.Math.RADIANS_PER_DEGREE,
        arcType: Cesium.ArcType.GEODESIC,
        ...(options.polyline || {})
      },
      label: {
        show: false,
        text: '圆形',
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
      updateRadius: (radius: any) => {
        radius = Number(radius)
        radius = isNaN(radius) ? 0 : radius
        const centerPosition = this.positions[0]
        const markerPosition = this.positions[1]
        const r = Cesium.Cartesian3.distance(centerPosition, markerPosition)
        const centerVec = vec3.fromValues(
          centerPosition.x,
          centerPosition.y,
          centerPosition.z
        )
        const markerVec = vec3.fromValues(
          markerPosition.x,
          markerPosition.y,
          markerPosition.z
        )
        const directVec = vec3.subtract(vec3.create(), markerVec, centerVec)
        vec3.scale(directVec, directVec, radius / r)
        vec3.add(directVec, directVec, centerVec)
        const [x, y, z] = directVec
        markerPosition.x = x
        markerPosition.y = y
        markerPosition.z = z
        const marker = this._marker.getMarkerByIndex(1)
        marker.position = new Cesium.ConstantPositionProperty(
          new Cesium.Cartesian3(x, y, z)
        )
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
   * @description: 加载数据
   */
  loadData(data: EntityJsonData, options: GraphicsEntityOptions = {}) {
    // const r = data?.entity?.ellipse?.semiMinorAxis
    // const point1 = Cesium.Cartesian3.unpack(data?.entity?.position?.cartesian)
    // const cen = vec3.fromValues(point1.x, point1.y, point1.z)
    // const north = vec3.fromValues(0, 0, 1)
    // const v1 = vec3.cross(vec3.create(), cen, north)
    // const vr1 = vec3.normalize(vec3.create(), v1)
    // const p2 = vec3.scaleAndAdd(vec3.create(), cen, vr1, r)
    // const point2 = new Cesium.Cartesian3(p2[0], p2[1], p2[2])
    // this.positions = [point1, point2]
    this.positions = transformCartographicToCartesianArray(
      data?.ellipse?.positions?.cartographicDegrees
    )
    const { id, name, show } = data
    this.addGraphics({ ...options, entity: { id, name, show } })
    this.setDrawingStatus(2)
    updateEllipse(this.entity?.ellipse, data)
    updatePolyline(this.entity?.polyline, data)
    updateLabel(this.entity?.label, data)
    updateAnimationEffect(this, data)
  }
}

export default Circle
