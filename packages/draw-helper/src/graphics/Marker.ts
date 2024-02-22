import type { GraphicsType } from '../types'

class Marker {
  // 视图对象
  _viewer: Cesium.Viewer | null
  // 图形对象
  _graphics: GraphicsType | null
  // 标记点实体集合
  _markers: Cesium.Entity[] = []
  // 标记点数据源
  _markerDataSource: Cesium.CustomDataSource | null
  // 当前半标记点索引
  currentHalfMarkerIndex: number = -1
  // 当前标记点
  _currentMarker: any
  // 是否销毁
  isDestroyed: boolean = false

  // 标记点按下事件
  markerLeftDownEvent: Cesium.Event = new Cesium.Event()
  // 标记点抬起事件
  markerLeftUpEvent: Cesium.Event = new Cesium.Event()
  // 标记点开始拖拽事件
  markerDragStartEvent: Cesium.Event = new Cesium.Event()
  // 标记点拖拽事件
  markerDragEvent: Cesium.Event = new Cesium.Event()
  // 标记点拖拽结束事件
  markerDragEndEvent: Cesium.Event = new Cesium.Event()
  // 中心点拖拽事件
  centerMarkerDragEvent: Cesium.Event = new Cesium.Event()
  // 圆形中心点拖拽事件
  cirleMarkerDragEvent: Cesium.Event = new Cesium.Event()
  // 半标记点按下事件
  halfMarkerLeftDownEvent: Cesium.Event = new Cesium.Event()
  // 标记点移入事件
  markerMouseInEvent: Cesium.Event = new Cesium.Event()
  // 标记点移出事件
  markerMouseOutEvent: Cesium.Event = new Cesium.Event()

  constructor(viewer: Cesium.Viewer, graphics: GraphicsType) {
    this._viewer = viewer
    this._graphics = graphics
    this._markerDataSource = new Cesium.CustomDataSource(
      `marker-${graphics.id}`
    )
    this._viewer.dataSources.add(this._markerDataSource)
  }

  get markers() {
    return this._markers.filter((item) => item.name === 'marker')
  }

  get halfMarkers() {
    return this._markers.filter((item) => item.name === 'half_marker')
  }

  get centerMarker() {
    return this._markers.find((item) => item.name === 'center_marker')
  }

  get allMarkers() {
    return this._markers
  }

  get length() {
    return this._markers.length
  }

  /**
   * @description: 添加标记点
   */
  addMarker(position: Cesium.Cartesian3, options: any = {}): Cesium.Entity {
    const marker = this.createMarkerEntity(position, options)
    this._markers.push(marker)
    return marker
  }

  /**
   * @description: 创建标记点实体
   */
  createMarkerEntity(
    position: Cesium.Cartesian3,
    options: any = {}
  ): Cesium.Entity {
    // 标记点的颜色
    const color =
      options.name === 'half_marker'
        ? Cesium.Color.RED.withAlpha(0.5)
        : Cesium.Color.fromCssColorString('rgb(255,229,0)')

    // 添加标记点
    const marker = this._markerDataSource!.entities.add({
      position: position,
      point: {
        heightReference: Cesium.HeightReference.NONE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        color: color,
        pixelSize: 8,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2
      },
      ...options
    })

    this.setMarkerListener(marker)

    return marker
  }

  /**
   * @description: 删除标记点
   */
  removeMarker(marker: Cesium.Entity) {
    const index = this.getMarkerIndex(marker)
    if (index > -1) {
      this._markers.splice(index, 1)
    }
    this.removeMarkerEntity(marker)
  }

  /**
   * @description: 删除标记点实体
   */
  removeMarkerEntity(marker: Cesium.Entity) {
    ;(marker as any)?.dragHandler?.destroy()
    this._markerDataSource!.entities.remove(marker)
  }

  /**
   * @description: 设置标记点事件
   */
  setMarkerListener(marker: any) {
    // 按下事件
    marker.leftDown = (cartesian: Cesium.Cartesian3) => {
      this._currentMarker = marker
      this.markerLeftDownEvent.raiseEvent(marker as any, cartesian as any)
      // 创建 handler
      const handler = new Cesium.ScreenSpaceEventHandler(
        this._viewer!.scene.canvas
      )
      marker.dragHandler = handler
      // 监听移动
      handler.setInputAction((movement: any) => {
        const pos2 = this.pickPosition(movement.endPosition)
        if (pos2) {
          this.handleMarkerDrag(pos2)
        } else {
          this.handleMarkerDragEnd(pos2)
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      // 拖动开始
      this.markerDragStartEvent.raiseEvent(marker as any, cartesian as any)
    }
    // 抬起事件
    marker.leftUp = (cartesian: Cesium.Cartesian3) => {
      this.markerLeftUpEvent.raiseEvent(marker as any, cartesian as any)
      this.handleMarkerDragEnd(cartesian)
    }
    // 移入事件
    marker.mouseMove = (cartesian: Cesium.Cartesian3) => {
      if (cartesian && !this._currentMarker) {
        this.markerMouseInEvent.raiseEvent(marker as any, cartesian as any)
      }
    }
    // 移出事件
    marker.mouseOut = () => {
      this.markerMouseOutEvent.raiseEvent(marker as any)
    }
  }

  /**
   * @description: 标记点拖动
   */
  handleMarkerDrag(cartesian: Cesium.Cartesian3) {
    const marker: any = this._currentMarker
    if (marker) {
      // 处理中心点
      if (marker.name === 'center_marker') {
        if (this._graphics!.type === 'circle') {
          this.handleCirleCenterMarkerLeftDown(marker, cartesian)
        } else {
          this.handleCenterMarkerLeftDown(marker, cartesian)
        }
      } else if (marker.name === 'half_marker') {
        // 处理半标记点
        this.handleHalfMarkerLeftDown(marker, cartesian)
      } else if (marker.name === 'marker') {
        // 处理标记点
        this.handleMarkerLeftDown(marker, cartesian, this._graphics!.loop)
      }
    }
  }

  /**
   * @description: 标记点拖动结束
   */
  handleMarkerDragEnd(cartesian?: Cesium.Cartesian3) {
    const marker: any = this._currentMarker
    if (marker) {
      this.handleHalfMarkerLeftUp(marker)
      this.markerDragEndEvent.raiseEvent(marker as any, cartesian as any)
    }
    this._currentMarker = undefined
  }

  /**
   * @description: 处理按下中心点
   */
  handleCenterMarkerLeftDown(
    marker: Cesium.Entity,
    cartesian: Cesium.Cartesian3
  ) {
    if (marker) {
      marker.position = new Cesium.ConstantPositionProperty(cartesian)
      this.centerMarkerDragEvent.raiseEvent(marker as any, cartesian as any)
    }
  }

  /**
   * @description: 处理按下圆形中心点
   */
  handleCirleCenterMarkerLeftDown(
    marker: Cesium.Entity,
    cartesian: Cesium.Cartesian3
  ) {
    // 中心标记点
    const marker0 = this.getMarkerByIndex(0)
    // 圆形标记点1
    const marker1 = this.getMarkerByIndex(1)
    if (marker0 && marker1) {
      // 中心标记点的坐标
      const marker0Cartesian = marker0?.position?.getValue(
        Cesium.JulianDate.now()
      )
      // 标记点1的坐标
      const marker1Cartesian = marker1?.position?.getValue(
        Cesium.JulianDate.now()
      )
      if (marker0Cartesian && marker1Cartesian) {
        const cartesian2 = new Cesium.Cartesian3()
        Cesium.Cartesian3.subtract(cartesian, marker0Cartesian, cartesian2)
        Cesium.Cartesian3.add(marker1Cartesian, cartesian2, cartesian2)
        marker0.position = new Cesium.ConstantPositionProperty(cartesian)
        marker1.position = new Cesium.ConstantPositionProperty(cartesian2)
        this.cirleMarkerDragEvent.raiseEvent(
          marker as any,
          cartesian as any,
          cartesian2 as any
        )
      }
    }
  }

  /**
   * @description: 处理按下标记点
   */
  handleMarkerLeftDown(
    marker: Cesium.Entity,
    cartesian: Cesium.Cartesian3,
    loop = false
  ) {
    // 查找标记点的位置索引
    const { marker_index, position_index } =
      marker?.properties?.getValue(Cesium.JulianDate.now()) || {}
    if (position_index < 0) return
    this.markerDragEvent.raiseEvent(
      marker as any,
      position_index,
      cartesian as any
    )
    // 更新标记点的位置
    marker.position = new Cesium.ConstantPositionProperty(cartesian)
    if (marker_index < 0) return
    // 左边的半标记点
    const leftHalfMarker = this.sliceMarkerByIndex(
      marker_index - 1,
      'half_marker'
    )
    // 右边的半标记点
    const rightHalfMarker = this.sliceMarkerByIndex(
      marker_index + 1,
      'half_marker'
    )
    // 左边的标记点
    const leftMarker = this.sliceMarkerByIndex(marker_index - 2)
    // 右边的标记点
    const rightMarker = this.sliceMarkerByIndex(
      this.checkLastMarker(marker) && loop ? 0 : marker_index + 2
    )
    // 左边的半标记点位置
    const pos1 = this.getMarkerMidPosition(leftMarker, marker)
    // 右边的半标记点位置
    const pos2 = this.getMarkerMidPosition(marker, rightMarker)
    // 更新半标记点的位置
    if (leftHalfMarker && pos1) {
      leftHalfMarker.position = new Cesium.ConstantPositionProperty(pos1)
    }
    if (rightHalfMarker && pos2) {
      rightHalfMarker.position = new Cesium.ConstantPositionProperty(pos2)
    }
  }

  /**
   * @description: 处理按下半标记点
   */
  handleHalfMarkerLeftDown(
    marker: Cesium.Entity,
    cartesian: Cesium.Cartesian3
  ) {
    marker.show = false
    // 查找标记点的位置索引
    const {
      marker_index,
      marker_position_index: [leftPositionIndex, rightPositionIndex]
    } = marker?.properties?.getValue(Cesium.JulianDate.now()) || {}

    if (marker_index > -1) {
      // 坐标位置索引，如果右边的位置索引是 0，选择左边的位置索引 +1
      const positionIndex =
        rightPositionIndex === 0 ? leftPositionIndex + 1 : rightPositionIndex
      // ;(marker as any).leftUp()
      // 删除半标记点
      this.removeMarkerEntity(marker)
      // 半标记点变成线上标记点
      const newMarker = this.createMarkerEntity(cartesian, {
        name: 'marker',
        properties: {
          position_index: positionIndex,
          marker_index: marker_index
        }
      })
      // 添加新的标记点
      this.insertMarkers(marker_index, [newMarker])
      this.halfMarkerLeftDownEvent.raiseEvent(positionIndex, cartesian as any)
      // 更新标记点索引
      this.updateMarkerIndex()
      ;(newMarker as any).leftDown()
      // 记录当前移动的半点索引
      this.currentHalfMarkerIndex = marker_index
    }
  }

  /**
   * @description: 处理抬起半标记点
   */
  handleHalfMarkerLeftUp(marker: Cesium.Entity) {
    const markerIndex = this.currentHalfMarkerIndex
    if (markerIndex > -1) {
      // 左边的标记点
      const leftMarker = this.sliceMarkerByIndex(markerIndex - 1)
      // 右边的标记点，如果是最后一个点，选择第一个点
      const rightMarker =
        markerIndex >= this._markers.length - 1
          ? this.getMarkerByIndex(0)
          : this.sliceMarkerByIndex(markerIndex + 1)
      if (!leftMarker || !rightMarker) return
      // 左边中间点的位置
      const pos1 = this.getMarkerMidPosition(leftMarker, marker)
      // 右边中间点的位置
      const pos2 = this.getMarkerMidPosition(marker, rightMarker)
      if (!pos1 || !pos2) return
      // 左边的半点
      const leftHalfMarker = this.createMarkerEntity(pos1, {
        name: 'half_marker',
        properties: {
          marker_index: -1,
          marker_left_position_index: -1,
          marker_right_position_index: -1,
          marker_position_index: []
        }
      })
      // 右边的半点
      const rightHalfMarker = this.createMarkerEntity(pos2, {
        name: 'half_marker',
        properties: {
          marker_index: -1,
          marker_left_position_index: -1,
          marker_right_position_index: -1,
          marker_position_index: []
        }
      })
      // 更新标记点集合
      this.insertMarkers(markerIndex, [leftHalfMarker, marker, rightHalfMarker])
      // 更新标记点索引
      this.updateMarkerIndex()
      this.currentHalfMarkerIndex = -1
    }
  }

  /**
   * @description: 更新收尾连接线段的标记点
   */
  updateMarkerLoop(loop: boolean) {
    if (loop) {
      const index = this._markers.length
      const leftMarker = this.sliceMarkerByIndex(index - 1)
      const rightMarker = this.sliceMarkerByIndex(0)
      if (!leftMarker || !rightMarker) return
      const cartesian = this.getMarkerMidPosition(leftMarker, rightMarker)
      if (cartesian) {
        // 创建半点
        const marker = this.createMarkerEntity(cartesian, {
          name: 'half_marker',
          properties: {
            marker_index: index,
            marker_position_index: [index - 1, 0]
          }
        })
        this.insertMarkers(index, [marker], 0)
      }
    } else {
      const index = this._markers.length
      const halfMarker = this.getMarkerByIndex(index - 1)
      if (halfMarker && halfMarker.name === 'half_marker') {
        this.removeMarker(halfMarker)
      }
    }
  }

  /**
   * @description: 设置所有标记点显示
   */
  setVisible(visible: boolean) {
    this._markers.forEach((marker) => (marker.show = visible))
  }

  /**
   * @description: 更新所有标记点的索引
   */
  updateMarkerIndex(loop = false) {
    const length = this._markers.length
    let position_index = 0
    for (let i = 0; i < length; i++) {
      const marker = this._markers[i]
      if (marker.name === 'marker') {
        // 标记点索引
        marker.properties!.marker_index = i
        // 标记点位置索引
        marker.properties!.position_index = position_index++
      } else if (marker.name === 'half_marker') {
        // 左边坐标位置的索引
        const leftIndex = (i - 1) / 2
        // 右边坐标位置的索引，如果是最后一个，选择第一个标记点位置索引
        const rightIndex = i === length - 1 && loop ? 0 : leftIndex + 1
        // 标记点索引
        marker.properties!.marker_index = i
        // 标记点位置索引
        marker.properties!.marker_left_position_index = leftIndex
        marker.properties!.marker_right_position_index = rightIndex
        marker.properties!.marker_position_index = [leftIndex, rightIndex]
      }
    }
  }

  /**
   * @description: 检测是否是最后一个标记点
   */
  checkLastMarker(marker: Cesium.Entity) {
    const index = this.markers.length - 1
    return this.markers[index] === marker
  }

  /**
   * @description: 通过索引截取标记点
   */
  sliceMarkerByIndex(index: number, name = 'marker') {
    const marker = [...this._markers].slice(index)[0]
    if (marker && marker.name === name) return marker
  }

  /**
   * @description: 通过索引获取标记点
   */
  getMarkerByIndex(index: number) {
    return this._markers[index]
  }

  /**
   * @description: 插入标记点
   */
  insertMarkers(index: number, markers: Cesium.Entity[], delCount = 1) {
    this._markers.splice(index, delCount, ...markers)
  }

  /**
   * @description: 更新标记点
   */
  updateMarkers(markers: Cesium.Entity[]) {
    this._markers = markers
  }

  /**
   * @description: 查找标记点的索引
   */
  getMarkerIndex(marker: Cesium.Entity) {
    return this._markers.findIndex((item) => item === marker)
  }

  /**
   * @description: 获取标记点的中间点位置
   */
  getMarkerMidPosition(
    leftMarker?: Cesium.Entity,
    rightMarker?: Cesium.Entity
  ): Cesium.Cartesian3 | undefined {
    if (
      leftMarker &&
      leftMarker.name === 'marker' &&
      rightMarker &&
      rightMarker.name === 'marker'
    ) {
      const leftCartesian = leftMarker.position!.getValue(
        Cesium.JulianDate.now()
      )
      const rightCartesian = rightMarker.position!.getValue(
        Cesium.JulianDate.now()
      )
      if (!leftCartesian || !rightCartesian) return
      const cartesian = Cesium.Cartesian3.midpoint(
        leftCartesian,
        rightCartesian,
        new Cesium.Cartesian3()
      )
      return cartesian
    }
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
   * @description: 清除标记点
   */
  clear() {
    if (this.isDestroyed) return
    this._markers.forEach((marker) => {
      this.removeMarkerEntity(marker)
    })
    this._markers = []
  }

  /**
   * @description: 销毁
   */
  destroy() {
    if (this.isDestroyed) return
    this.clear()
    this._viewer!.dataSources.remove(this._markerDataSource!)
    this._markerDataSource = null
    this._viewer = null
    this._graphics = null
    this.isDestroyed = true
  }
}

export default Marker
