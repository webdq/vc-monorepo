import Model from './graphics/Model'
import Billboard from './graphics/Billboard'
import Pin from './graphics/Pin'
import Point from './graphics/Point'
import Polyline from './graphics/Polyline'
import Polygon from './graphics/Polygon'
import Circle from './graphics/Circle'
import Rectangle from './graphics/Rectangle'
import FineArrow from './graphics/FineArrow'
import AttackArrow from './graphics/AttackArrow'
import TailedAttackArrow from './graphics/TailedAttackArrow'
import DoubleArrow from './graphics/DoubleArrow'
import GatheringPlace from './graphics/GatheringPlace'
import { getGraphicsData } from './utils/graphicsData'
import type {
  DrawHelperOptions,
  GraphicsType,
  GraphicsClassType,
  GraphicsMapType,
  GraphicsJsonData,
  CleanupFn,
  GraphicsEntityOptions
} from './types'
import Tooltip from './Tooltip'

class DrawHelper {
  // 视图对象
  _viewer: Cesium.Viewer | null
  // 选项参数
  _options: DrawHelperOptions
  // 提示框对象
  _tooltip: Tooltip
  // 事件处理
  _handler: Cesium.ScreenSpaceEventHandler
  // 拾取的元素是否响应绑定的方法
  _handlersMuted = false
  // 上一次绘制未结束的清空方法
  _editCleanup?: CleanupFn
  // 当前选中要编辑的图形
  _graphicsActive?: GraphicsType
  // 图形 map
  _graphicsMap: GraphicsMapType = new Map()
  // 是否已销毁
  isDestroyed = false
  // 移除选中图形事件
  _removeGraphicsActiveEvent?: Cesium.Event.RemoveCallback
  // 移除绘制完成事件
  _removeDrawCompleteEvent?: Cesium.Event.RemoveCallback

  constructor(viewer: Cesium.Viewer, options: DrawHelperOptions = {}) {
    this._viewer = viewer
    this._options = Object.assign({}, options)
    this._handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    this._tooltip = new Tooltip(viewer.container)
    this.initHandlers()
  }

  /**
   * @description: 初始化 handler
   */
  initHandlers() {
    const viewer = this._viewer!
    const handler = this._handler
    const invokeCallback = (name: string, position: Cesium.Cartesian2) => {
      if (this._handlersMuted) return
      const pickedObject = viewer.scene.pick(position)
      const ray = viewer.camera.getPickRay(position)
      if (!ray) return
      const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
      if (pickedObject && pickedObject.id && pickedObject.id[name]) {
        pickedObject.id[name](cartesian)
      }
    }
    handler.setInputAction((movement: any) => {
      invokeCallback('leftClick', movement.position)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler.setInputAction((movement: any) => {
      invokeCallback('leftDoubleClick', movement.position)
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    let mouseOutObject: any
    handler.setInputAction((movement: any) => {
      if (this._handlersMuted) return
      const pickedObject = viewer.scene.pick(movement.endPosition)
      const ray = viewer.camera.getPickRay(movement.endPosition)
      if (!ray) return
      const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
      const entity = pickedObject?.id
      if (mouseOutObject && mouseOutObject !== entity) {
        mouseOutObject?.mouseOut?.(cartesian)
        mouseOutObject = undefined
      }
      if (entity) {
        mouseOutObject = entity
        entity?.mouseMove?.(cartesian)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    handler.setInputAction((movement: any) => {
      invokeCallback('leftUp', movement.position)
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
    handler.setInputAction((movement: any) => {
      invokeCallback('leftDown', movement.position)
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    handler.setInputAction((movement: any) => {
      invokeCallback('rightClick', movement.position)
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    handler.setInputAction((movement: any) => {
      invokeCallback('rightUp', movement.position)
    }, Cesium.ScreenSpaceEventType.RIGHT_UP)
    handler.setInputAction((movement: any) => {
      invokeCallback('rightDown', movement.position)
    }, Cesium.ScreenSpaceEventType.RIGHT_DOWN)
  }

  /**
   * @description: 获取图形类
   */
  getGraphicsClass(type: string): GraphicsClassType | undefined {
    switch (type) {
      case 'model':
        return Model
      case 'billboard':
        return Billboard
      case 'pin':
        return Pin
      case 'point':
        return Point
      case 'polyline':
        return Polyline
      case 'polygon':
        return Polygon
      case 'rectangle':
        return Rectangle
      case 'circle':
        return Circle
      case 'fineArrow':
        return FineArrow
      case 'attackArrow':
        return AttackArrow
      case 'tailedAttackArrow':
        return TailedAttackArrow
      case 'doubleArrow':
        return DoubleArrow
      case 'gatheringPlace':
        return GatheringPlace
    }
  }

  /**
   * @description: 创建图形
   */
  createGraphics(type: string, id?: string): GraphicsType | undefined {
    const GraphicsClass = this.getGraphicsClass(type)
    if (!GraphicsClass) return
    const graphics = new GraphicsClass(this._viewer!, this._tooltip, {
      ...this._options,
      id
    }) as GraphicsType
    // 监听选中图形事件
    this._removeGraphicsActiveEvent =
      graphics.graphicsActiveEvent.addEventListener(
        (graphics?: GraphicsType) => {
          this.setGraphicsEditing(graphics)
        }
      )
    // 监听绘制完成事件
    this._removeDrawCompleteEvent = graphics.drawCompleteEvent.addEventListener(
      () => {
        if (!this._graphicsMap.has(graphics.id)) {
          this._graphicsMap.set(graphics.id, graphics)
        }
        this._options?.onComplete?.(graphics)
        this.stopDrawing()
      }
    )
    return graphics
  }

  /**
   * @description: 根据id查找图形
   */
  getGraphicsById(id: string) {
    const graphics = this._graphicsMap.get(id)
    return graphics
  }

  /**
   * @description: 缓存上一次未绘制结束的清空方法
   */
  beforeDrawing(cleanup: CleanupFn) {
    this.disableAllEditMode()
    if (this._editCleanup) {
      this._editCleanup()
    }
    this._editCleanup = cleanup
    this.muteHandlers(true)
  }

  /**
   * @description: 开始绘制
   */
  startDrawing(type: string, options?: GraphicsEntityOptions) {
    let graphics = this.createGraphics(type)
    // 绘制前添加清空函数
    this.beforeDrawing(() => {
      graphics?.clear()
      graphics = undefined
      this._tooltip.setVisible(false)
    })
    // 开始绘制图形
    graphics?.start(options)
  }

  /**
   * @description: 结束绘制
   */
  stopDrawing() {
    if (this._editCleanup) {
      this._editCleanup()
      this._editCleanup = undefined
    }
    this.muteHandlers(false)
  }

  /**
   * @description: 禁用标绘元素的处理事件
   */
  muteHandlers(muted: boolean) {
    this._handlersMuted = muted
  }

  /**
   * @description: 禁用图形的编辑模式
   */
  disableAllEditMode() {
    this.setGraphicsEditing(undefined)
  }

  /**
   * @description: 选中要编辑的图形
   */
  setGraphicsEditing(graphics?: GraphicsType) {
    if (this._graphicsActive) {
      this._graphicsActive.setEditMode(false)
    }
    this._graphicsActive = graphics
    this._options?.onChange?.(graphics)
    this._viewer!.selectedEntity = graphics?.entity
  }

  /**
   * @description: 获取图形数据
   */
  getData() {
    const list: GraphicsType[] = [...this._graphicsMap.values()]
    const data = getGraphicsData(list)
    return data
  }

  /**
   * @description: 通过 id 获取图形数据
   */
  getDataById(id: string) {
    const graphics = this._graphicsMap.get(id)
    if (graphics) {
      const data = getGraphicsData([graphics])
      return data
    }
    return []
  }

  /**
   * @description: 通过多个 ids 获取图形数据
   */
  getDataByIds(ids: string[]) {
    const result: GraphicsJsonData[] = ids
      .map((id) => {
        const [data] = this.getDataById(id)
        return data
      })
      .filter(Boolean)
    return result
  }

  /**
   * @description: 加载图形数据
   */
  loadData(list: GraphicsJsonData[]) {
    const result: GraphicsType[] = list
      .map((item: GraphicsJsonData) => {
        const graphics = this.createGraphics(item.type, item.id)
        if (graphics) {
          graphics.loadData(item.entity)
          this._graphicsMap.set(graphics.id, graphics)
        }
        return graphics
      })
      .filter(Boolean) as GraphicsType[]
    return result
  }

  /**
   * @description: 清空
   */
  clear(types: string | string[] = ['all']) {
    if (typeof types === 'string') {
      types = [types]
    }
    const keys = [...this._graphicsMap.keys()]
    keys.forEach((key) => {
      const graphics = this._graphicsMap.get(key)
      if (
        graphics &&
        (types.includes(graphics.type) || types.includes('all'))
      ) {
        graphics.destroy()
        this._graphicsMap.delete(key)
      }
    })
    this._graphicsActive = undefined
  }

  /**
   * @description: 根据 id 删除图形
   */
  clearById(id: string) {
    const graphics = this._graphicsMap.get(id)
    if (graphics) {
      graphics.destroy()
      this._graphicsMap.delete(id)
      if (graphics.id === this._graphicsActive?.id) {
        this._graphicsActive = undefined
      }
    }
  }

  /**
   * @description: 销毁
   */
  destroy() {
    if (this.isDestroyed) return
    this._tooltip?.destroy()
    this._removeGraphicsActiveEvent?.()
    this._removeDrawCompleteEvent?.()
    this.clear()
    this._handler?.destroy()
    this._viewer = null
    this.isDestroyed = true
  }
}

export default DrawHelper
