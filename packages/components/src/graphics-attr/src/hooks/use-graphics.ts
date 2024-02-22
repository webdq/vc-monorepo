import { ref } from 'vue'
import type { SetupContext } from 'vue'
import {
  getDataFromLabel,
  getGraphicsAttrData,
  updateEntityAttr
} from './use-entity-attrs'
import { GraphicsAttrProps, GraphicsAttrEmits } from '../graphics-attr'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { message } from 'ant-design-vue'
import {
  cartesianToDegreesArray,
  degreesToCartesianArray,
  toRawObject
} from '../utils'

// 默认动画数据
export const defaultAnimationData = {
  type: 'flash',
  startDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  stopDate: undefined,
  speed: undefined,
  degress: [],
  positions: [],
  flashColor1: '#FF0000',
  flashColor2: '#0000FF',
  entityIds: []
}
// 默认视锥数据
export const defaultFrustumData = {
  show: false,
  fov: 90,
  aspectWidth: 100,
  aspectHeight: 100,
  near: 0.01,
  far: 10000,
  xOffset: 0,
  yOffset: 0,
  heading: 0,
  pitch: 0,
  roll: 0
}
// 默认模型移动路径数据
export const defaultMovementData = {
  showPath: false,
  pathId: '',
  modelId: '',
  startDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  stopDate: undefined,
  speed: undefined,
  degress: [],
  positions: []
}
// 默认信号线数据
export const defaultSignalLineData = {
  startDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  stopDate: undefined,
  entityIds: []
}

// 标绘元素对象
export let graphics: any | undefined
// 标绘元素实体
export let entity: Cesium.Entity | undefined

// 更新动画数据
export const updateAnimationEffect = (graphics: any, data: any) => {
  const { type, startDate, stopDate } = data
  const date1 = dayjs(startDate).toDate()
  const date2 = dayjs(stopDate).toDate()
  if (type === 'flash') {
    graphics?.flash(date1, date2, data)
  }
  if (type === 'fade') {
    graphics?.fade(date1, date2, data)
  }
  if (type === 'displacement') {
    graphics?.displacement(date1, date2, data)
  }
  if (type === 'grow') {
    graphics?.grow(date1, date2, data)
  }
  if (type === 'signal-line') {
    graphics?.signalLine(date1, date2, data)
  }
}

export const useGraphics = (
  props: GraphicsAttrProps,
  emit: SetupContext<GraphicsAttrEmits>['emit']
) => {
  // 表单数据
  const formData = ref<any>({})
  // 文字属性数据
  const labelData = ref<any>({})
  // 动画数据
  const animationData = ref<any>({})
  // 视锥数据
  const frustumData = ref<any>({})
  // 模型位置数据
  const modelPositionData = ref<any>({
    longitude: 0,
    latitude: 0,
    height: 0
  })
  // 模型姿态数据
  const modelOrientationData = ref<any>({
    heading: 0,
    pitch: 0,
    roll: 0
  })
  // 模型移动路径数据
  const movementData = ref<any>({})
  const signalLineData = ref<any>({})

  // 设置标绘元素
  const updateGraphics = (drawingEl: any) => {
    graphics = drawingEl
    entity = drawingEl.entity

    getFormData()
    getLabelData()
    getAnimationEffectData()
    getModelEntityData()
    getMovementData()
    getSignalLineData()
  }

  // 更新图形表单数据
  const updateFormData = (key: string, value: any) => {
    formData.value[key] = value
  }

  // 更新图形属性
  const updateAttr = (type: string, key: string, value: any) => {
    updateEntityAttr(entity!, type, key, value)
    emit('updateAttr', entity!, type, key, value)
  }

  // 飞行到图形实体
  const handleFly = () => {
    emit('graphicsFly', entity!)
  }

  // 删除图形
  const handleRemove = () => {
    formData.value = {}
    const id = graphics.id
    entity = undefined
    graphics = undefined
    emit('graphicsRemove', id)
  }

  // 保存动画数据
  const saveAnimationClick = () => {
    const obj = toRawObject(animationData.value)
    obj.positions = degreesToCartesianArray(obj.degress)
    const data = cloneDeep(obj)
    updateAnimationEffect(graphics, data)
    message.success('保存成功')
    emit('saveAnimationClick', graphics, entity, data)
    return data
  }

  // 预览动画
  const previewAnimationClick = () => {
    const data = saveAnimationClick()
    graphics?.playAnimation(data.startDate, data.stopDate)
    emit('previewAnimationClick', graphics, entity, data)
  }

  // 删除动画数据
  const removeAnimationClick = () => {
    graphics?.removeAnimationEffect()
    message.success('删除成功')
    emit('removeAnimationClick', graphics, entity)
  }

  // 保存模型移动路径数据
  const saveMovementPathClick = () => {
    const obj = toRawObject(movementData.value)
    obj.positions = degreesToCartesianArray(obj.degress)
    const data = cloneDeep(obj)
    graphics?.setModelMovement(data)
    graphics?.updateMovement()
    message.success('保存成功')
    emit('saveMovementPathClick', graphics, entity, data)
    return data
  }

  // 预览模型移动路径
  const previewMovementPathClick = () => {
    const data = saveMovementPathClick()
    graphics?.playAnimation(data.startDate, data.stopDate)
    emit('previewMovementPathClick', graphics, entity, data)
  }

  // 删除模型移动路径
  const removeMovementPathClick = () => {
    movementData.value = cloneDeep({
      ...defaultMovementData,
      modelId: graphics.entity.id
    })
    graphics?.removeModelMovement()
    message.success('删除成功')
    emit('removeMovementPathClick', graphics, entity)
  }

  // 保存信号线数据
  const saveSignalLineClick = () => {
    const obj = toRawObject(animationData.value)
    const data = cloneDeep(obj)
    graphics?.setSignalLine(data)
    message.success('保存成功')
    emit('saveSignalLineClick', graphics, entity, data)
    return data
  }

  // 预览信号新
  const previewSignalLineClick = () => {
    const data = saveSignalLineClick()
    graphics?.playAnimation(data.startDate, data.stopDate)
    emit('previewSignalLineClick', graphics, entity, data)
  }

  // 删除信号线
  const removeSignalLineClick = () => {
    signalLineData.value = cloneDeep({
      ...defaultSignalLineData
    })
    graphics?.removeSignalLine()
    message.success('删除成功')
    emit('removeSignalLineClick', graphics, entity)
  }

  // 获取表单数据
  const getFormData = () => {
    if (!graphics) return
    const data = getGraphicsAttrData(graphics)
    formData.value = data
  }

  // 获取文字属性
  const getLabelData = () => {
    if (!graphics) return
    const data = getDataFromLabel(graphics.entity)
    labelData.value = data
  }

  // 获取动画数据
  const getAnimationEffectData = () => {
    if (!graphics) return
    const animation = graphics?.animationEffect || {}
    animationData.value = cloneDeep({
      ...defaultAnimationData,
      ...animation
    })
  }

  // 获取模型数据
  const getModelEntityData = () => {
    if (!graphics || graphics.type !== 'model') return
    // 模型坐标
    const position = graphics?.positions?.[0]
    let longitude = 0,
      latitude = 0,
      height = 0
    if (position) {
      const cartographic = Cesium.Cartographic.fromCartesian(position)
      longitude = Cesium.Math.toDegrees(cartographic.longitude)
      latitude = Cesium.Math.toDegrees(cartographic.latitude)
      height = cartographic.height
    }
    // 模型的位置数据
    modelPositionData.value = {
      longitude,
      latitude,
      height
    }

    // 模型的姿态数据
    const heading = graphics?.heading || 0
    const pitch = graphics?.pitch || 0
    const roll = graphics?.roll || 0
    modelOrientationData.value = {
      heading,
      pitch,
      roll
    }

    // 模型的视锥数据
    if (graphics.frustum) {
      const {
        show,
        fov,
        aspectWidth,
        aspectHeight,
        near,
        far,
        xOffset,
        yOffset,
        heading,
        pitch,
        roll
      } = graphics.frustum
      frustumData.value = {
        ...defaultFrustumData,
        show,
        fov,
        aspectWidth,
        aspectHeight,
        near,
        far,
        xOffset,
        yOffset,
        heading,
        pitch,
        roll
      }
    } else {
      frustumData.value = {
        ...defaultFrustumData
      }
    }
  }

  // 获取模型移动路径数据
  const getMovementData = () => {
    if (!graphics || graphics.type !== 'model') return
    const modelPath = graphics.modelPath || {}
    const positions = graphics?.pathGraphics?.positions ?? []
    const showPath = graphics?.pathGraphics?.entity.show ?? false
    const degress = cartesianToDegreesArray(positions)
    movementData.value = cloneDeep({
      ...defaultMovementData,
      ...modelPath,
      showPath,
      degress,
      modelId: graphics.entity.id
    })
  }

  // 更新模型位置
  const updateModelPositionData = () => {
    if (!graphics) return
    const { longitude, latitude, height } = modelPositionData.value
    const cartesian = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
    graphics?.updateFirstPosition(cartesian)
  }

  // 更新模型的默认姿态
  const updateModelOrientationData = () => {
    if (!graphics) return
    const { heading, pitch, roll } = modelOrientationData.value
    graphics?.updateModelHPR(heading, pitch, roll)
  }

  // 更新模型视锥
  const updateFrustumData = () => {
    if (!graphics || !graphics.frustum) return
    const { fov, heading, pitch, roll } = frustumData.value
    const origin = graphics.entity?.position?.getValue(Cesium.JulianDate.now())
    if (!origin) return
    const options = {
      ...frustumData.value,
      origin,
      fov,
      heading,
      pitch,
      roll
    }

    graphics?.updateFrustum(options)
  }

  // 获取信号线数据
  const getSignalLineData = () => {
    if (!graphics || graphics.type !== 'polyline') return
    const signalLine = graphics.signalLineData || {}
    signalLineData.value = cloneDeep({
      ...defaultSignalLineData,
      ...signalLine
    })
  }

  return {
    updateGraphics,
    formData,
    labelData,
    animationData,
    frustumData,
    modelPositionData,
    modelOrientationData,
    movementData,
    signalLineData,
    updateFormData,
    updateModelPositionData,
    updateModelOrientationData,
    updateFrustumData,
    updateAttr,
    handleFly,
    handleRemove,
    removeAnimationClick,
    previewAnimationClick,
    saveAnimationClick,
    saveMovementPathClick,
    previewMovementPathClick,
    removeMovementPathClick,
    saveSignalLineClick,
    previewSignalLineClick,
    removeSignalLineClick,
    getFormData,
    getLabelData,
    getAnimationEffectData,
    getModelEntityData,
    getMovementData,
    getSignalLineData
  }
}
