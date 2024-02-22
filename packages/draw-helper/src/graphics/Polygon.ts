import Graphics from './Graphics'
import {
  updatePolygon,
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

class Polygon extends Graphics {
  type = 'polygon'
  constructor(
    viewer: Cesium.Viewer,
    tooltip: Tooltip,
    options: GraphicsOptions = {}
  ) {
    super(viewer, tooltip, options)
    this.loop = true
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
      // 如果坐标位置数量小于5个，直接返回
      if (this.positions.length < 5) return
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
      name: '多边形',
      position: new Cesium.CallbackProperty(() => {
        return this.positions[0]
      }, false),
      polygon: {
        show: true,
        hierarchy: new Cesium.CallbackProperty(() => {
          return new Cesium.PolygonHierarchy(this.positions)
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
          const positions = this.positions[0]
            ? [...this.positions, this.positions[0]]
            : [...this.positions]
          return positions
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
        text: '多边形',
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
    this.positions = transformCartographicToCartesianArray(
      data?.polygon?.hierarchy?.positions?.cartographicDegrees
    )
    const { id, name, show } = data
    this.addGraphics({ ...options, entity: { id, name, show } })
    this.setDrawingStatus(2)
    updatePolygon(this.entity?.polygon, data)
    updatePolyline(this.entity?.polyline, data)
    updateLabel(this.entity?.label, data)
    this.cacheColorPropertie()
    updateAnimationEffect(this, data)
  }
}

export default Polygon
