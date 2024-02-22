import Graphics from './Graphics'
import {
  updateBillboard,
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

class Billboard extends Graphics {
  type = 'billboard'
  billboardUrl: string
  defaultBillboardUrl = 'https://zouyaoji.top/vue-cesium/images/favicon-old.png'
  constructor(
    viewer: Cesium.Viewer,
    tooltip: Tooltip,
    options: GraphicsOptions = {}
  ) {
    super(viewer, tooltip, options)
    this.billboardUrl = this._options?.billboardUrl ?? this.defaultBillboardUrl
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
      name: '标牌',
      position: new Cesium.CallbackProperty(() => {
        return this.positions[0]
      }, false),
      billboard: {
        show: true,
        image: this.billboardUrl,
        scale: 1,
        pixelOffset: new Cesium.Cartesian2(0, 0),
        eyeOffset: new Cesium.Cartesian3(0, 0, 0),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        heightReference: Cesium.HeightReference.NONE,
        color: Cesium.Color.WHITE,
        rotation: 0,
        alignedAxis: new Cesium.Cartesian3(0, 0, 0),
        sizeInMeters: false,
        width: 30,
        height: 30,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        ...(options.billboard || {})
      },
      label: {
        show: false,
        text: '标牌',
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
   * @description: 加载数据
   */
  loadData(data: EntityJsonData, options: GraphicsEntityOptions = {}) {
    this.positions = transformCartographicToCartesianArray(
      data?.position?.cartographicDegrees
    )
    const { id, name, show } = data
    this.addGraphics({ ...options, entity: { id, name, show } })
    this.setDrawingStatus(2)
    updateBillboard(this.entity?.billboard, data)
    updateLabel(this.entity?.label, data)
    updateAnimationEffect(this, data)
  }
}

export default Billboard
