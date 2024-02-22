import dayjs from 'dayjs'
import type { GraphicsType, EntityJsonData } from '../types'

/**
 * @description: 解包颜色
 */
export const unwrapColor = (rgba: number[]) => {
  if (!rgba) return
  return Cesium.Color.unpack([
    Cesium.Color.byteToFloat(rgba[0]),
    Cesium.Color.byteToFloat(rgba[1]),
    Cesium.Color.byteToFloat(rgba[2]),
    Cesium.Color.byteToFloat(rgba[3])
  ])
}

/**
 * @description: 解包线段材质
 */
export const unwrapPolylineMaterial = (material: any) => {
  if (!material) return
  if (material?.solidColor) {
    const color = unwrapColor(material?.solidColor?.color?.rgba)
    return new Cesium.ColorMaterialProperty(color)
  } else if (material?.polylineDash) {
    const color = unwrapColor(material?.polylineDash?.color?.rgba)
    const gapColor = unwrapColor(material?.polylineDash?.gapColor?.rgba)
    const dashLength = material?.polylineDash?.dashLength
    const dashPattern = material?.polylineDash?.dashPattern
    return new Cesium.PolylineDashMaterialProperty({
      color,
      gapColor,
      dashLength,
      dashPattern
    })
  } else if (material?.polylineOutline) {
    const color = unwrapColor(material?.polylineOutline?.color?.rgba)
    const outlineColor = unwrapColor(
      material?.polylineOutline?.outlineColor?.rgba
    )
    const outlineWidth = material?.polylineOutline?.outlineWidth
    return new Cesium.PolylineOutlineMaterialProperty({
      color,
      outlineColor,
      outlineWidth
    })
  } else if (material?.polylineArrow) {
    const color = unwrapColor(material?.polylineArrow?.color?.rgba)
    return new Cesium.PolylineArrowMaterialProperty(color)
  } else if (material?.polylineGlow) {
    const color = unwrapColor(material?.polylineGlow?.color?.rgba)
    const glowPower = material?.polylineGlow?.glowPower
    const taperPower = material?.polylineGlow?.taperPower
    return new Cesium.PolylineGlowMaterialProperty({
      color,
      glowPower,
      taperPower
    })
  } else if (material?.polylineFlicker) {
    const color = unwrapColor(material?.polylineFlicker?.color?.rgba)
    const speed = material?.polylineFlicker?.speed
    return new Cesium.PolylineFlickerMaterialProperty({
      color,
      speed
    })
  } else if (material?.polylineFlow) {
    const color = unwrapColor(material?.polylineFlow?.color?.rgba)
    const speed = material?.polylineFlow?.speed
    const percent = material?.polylineFlow?.percent
    const gradient = material?.polylineFlow?.gradient
    return new Cesium.PolylineFlowMaterialProperty({
      color,
      speed,
      percent,
      gradient
    })
  } else if (material?.polylineImageTrail) {
    const color = unwrapColor(material?.polylineImageTrail?.color?.rgba)
    const speed = material?.polylineImageTrail?.speed
    const image = material?.polylineImageTrail?.image
    const repeat = Cesium.Cartesian2.unpack(
      material?.polylineImageTrail?.repeat
    )
    return new Cesium.PolylineImageTrailMaterialProperty({
      color,
      speed,
      image,
      repeat
    })
  } else if (material?.polylineLightingTrail) {
    const color = unwrapColor(material?.polylineLightingTrail?.color?.rgba)
    const speed = material?.polylineLightingTrail?.speed
    const image = material?.polylineLightingTrail?.image
    return new Cesium.PolylineLightingTrailMaterialProperty({
      color,
      speed,
      image
    })
  } else if (material?.polylineTrail) {
    const color = unwrapColor(material?.polylineTrail?.color?.rgba)
    const speed = material?.polylineTrail?.speed
    return new Cesium.PolylineTrailMaterialProperty({
      color,
      speed
    })
  }
}

/**
 * @description: 解包填充材质
 */
export const unwrapFillMaterial = (material: any) => {
  if (!material) return
  if (material?.solidColor) {
    const color = unwrapColor(material?.solidColor?.color?.rgba)
    return new Cesium.ColorMaterialProperty(color)
  } else if (material?.image) {
    // const color = unwrapColor(material?.image?.color?.rgba)
    const image = material?.image?.image?.uri
    const repeat = Cesium.Cartesian2.unpack(material?.image?.repeat?.cartesian2)
    const transparent = material?.image?.transparent
    return new Cesium.ImageMaterialProperty({
      // color,
      image,
      repeat,
      transparent
    })
  } else if (material?.grid) {
    const color = unwrapColor(material?.grid?.color?.rgba)
    const cellAlpha = material?.grid?.cellAlpha
    const lineCount = Cesium.Cartesian2.unpack(
      material?.grid?.lineCount?.cartesian2
    )
    const lineThickness = Cesium.Cartesian2.unpack(
      material?.grid?.lineThickness?.cartesian2
    )
    const lineOffset = Cesium.Cartesian2.unpack(
      material?.grid?.lineOffset?.cartesian2
    )
    return new Cesium.GridMaterialProperty({
      color,
      cellAlpha,
      lineCount,
      lineThickness,
      lineOffset
    })
  } else if (material?.stripe) {
    const orientation = material?.stripe?.orientation
    const evenColor = unwrapColor(material?.stripe?.evenColor?.rgba)
    const oddColor = unwrapColor(material?.stripe?.oddColor?.rgba)
    const offset = material?.stripe?.offset
    const repeat = material?.stripe?.repeat
    return new Cesium.StripeMaterialProperty({
      orientation,
      evenColor,
      oddColor,
      offset,
      repeat
    })
  } else if (material?.checkerboard) {
    const evenColor = unwrapColor(material?.checkerboard?.evenColor?.rgba)
    const oddColor = unwrapColor(material?.checkerboard?.oddColor?.rgba)
    const repeat = Cesium.Cartesian2.unpack(
      material?.checkerboard?.repeat?.cartesian2
    )
    return new Cesium.CheckerboardMaterialProperty({
      evenColor,
      oddColor,
      repeat
    })
  } else if (material?.circleBlur) {
    const color = unwrapColor(material?.circleBlur?.color?.rgba)
    const speed = material?.circleBlur?.speed
    return new Cesium.CircleBlurMaterialProperty({
      color,
      speed
    })
  } else if (material?.circleDiffuse) {
    const color = unwrapColor(material?.circleDiffuse?.color?.rgba)
    const speed = material?.circleDiffuse?.speed
    return new Cesium.CircleDiffuseMaterialProperty({
      color,
      speed
    })
  } else if (material?.circleFade) {
    const color = unwrapColor(material?.circleFade?.color?.rgba)
    const speed = material?.circleFade?.speed
    return new Cesium.CircleFadeMaterialProperty({
      color,
      speed
    })
  } else if (material?.circlePulse) {
    const color = unwrapColor(material?.circlePulse?.color?.rgba)
    const speed = material?.circlePulse?.speed
    return new Cesium.CirclePulseMaterialProperty({
      color,
      speed
    })
  } else if (material?.circleScan) {
    const color = unwrapColor(material?.circleScan?.color?.rgba)
    const speed = material?.circleScan?.speed
    return new Cesium.CircleScanMaterialProperty({
      color,
      speed
    })
  } else if (material?.circleSpiral) {
    const color = unwrapColor(material?.circleSpiral?.color?.rgba)
    const speed = material?.circleSpiral?.speed
    return new Cesium.CircleSpiralMaterialProperty({
      color,
      speed
    })
  } else if (material?.circleVary) {
    const color = unwrapColor(material?.circleVary?.color?.rgba)
    const speed = material?.circleVary?.speed
    return new Cesium.CircleVaryMaterialProperty({
      color,
      speed
    })
  } else if (material?.circleWave) {
    const color = unwrapColor(material?.circleWave?.color?.rgba)
    const speed = material?.circleWave?.speed
    const count = material?.circleWave?.count
    const gradient = material?.circleWave?.gradient
    return new Cesium.CircleWaveMaterialProperty({
      color,
      speed,
      count,
      gradient
    })
  } else if (material?.ellipsoidElectric) {
    const color = unwrapColor(material?.ellipsoidElectric?.color?.rgba)
    const speed = material?.ellipsoidElectric?.speed
    return new Cesium.EllipsoidElectricMaterialProperty({
      color,
      speed
    })
  } else if (material?.ellipsoidTrail) {
    const color = unwrapColor(material?.ellipsoidTrail?.color?.rgba)
    const speed = material?.ellipsoidTrail?.speed
    return new Cesium.EllipsoidTrailMaterialProperty({
      color,
      speed
    })
  } else if (material?.radarLine) {
    const color = unwrapColor(material?.radarLine?.color?.rgba)
    const speed = material?.radarLine?.speed
    return new Cesium.RadarLineMaterialProperty({
      color,
      speed
    })
  } else if (material?.radarScan) {
    const color = unwrapColor(material?.radarScan?.color?.rgba)
    const speed = material?.radarScan?.speed
    return new Cesium.RadarScanMaterialProperty({
      color,
      speed
    })
  } else if (material?.radarSweep) {
    const color = unwrapColor(material?.radarSweep?.color?.rgba)
    const speed = material?.radarSweep?.speed
    return new Cesium.RadarSweepMaterialProperty({
      color,
      speed
    })
  } else if (material?.radarWave) {
    const color = unwrapColor(material?.radarWave?.color?.rgba)
    const speed = material?.radarWave?.speed
    return new Cesium.RadarWaveMaterialProperty({
      color,
      speed
    })
  } else if (material?.wallImageTrail) {
    const color = unwrapColor(material?.wallImageTrail?.color?.rgba)
    const speed = material?.wallImageTrail?.speed
    const image = material?.wallImageTrail?.image
    const repeat = Cesium.Cartesian2.unpack(material?.wallImageTrail?.repeat)
    return new Cesium.WallImageTrailMaterialProperty({
      color,
      speed,
      image,
      repeat
    })
  } else if (material?.wallLineTrail) {
    const color = unwrapColor(material?.wallLineTrail?.color?.rgba)
    const speed = material?.wallLineTrail?.speed
    const image = material?.wallLineTrail?.image
    const repeat = Cesium.Cartesian2.unpack(material?.wallLineTrail?.repeat)
    return new Cesium.WallLineTrailMaterialProperty({
      color,
      speed,
      image,
      repeat
    })
  } else if (material?.wallTrail) {
    const color = unwrapColor(material?.wallTrail?.color?.rgba)
    const speed = material?.wallTrail?.speed
    const image = material?.wallTrail?.image
    return new Cesium.WallTrailMaterialProperty({
      color,
      speed,
      image
    })
  }
}

/**
 * @description: 更新标牌
 */
export const updateBillboard = (billboard: any, data: EntityJsonData) => {
  if (!billboard) return
  const attrs = [
    'show',
    'image',
    'scale',
    // 'pixelOffset',
    // 'eyeOffset',
    'horizontalOrigin',
    'verticalOrigin',
    'heightReference',
    // 'color',
    'rotation',
    // 'alignedAxis',
    'sizeInMeters',
    'width',
    'height',
    // 'scaleByDistance',
    // 'translucencyByDistance',
    // 'pixelOffsetScaleByDistance',
    // 'imageSubRegion',
    // 'distanceDisplayCondition',
    'disableDepthTestDistance'
  ]
  attrs.forEach((attr) => {
    if (attr === 'rotation') {
      billboard[attr] = Cesium.Math.toRadians(data?.billboard?.[attr] || 0)
    } else {
      billboard[attr] = data?.billboard?.[attr]
    }
  })

  const {
    pixelOffset,
    eyeOffset,
    color,
    alignedAxis,
    scaleByDistance,
    translucencyByDistance,
    pixelOffsetScaleByDistance,
    imageSubRegion,
    distanceDisplayCondition
  } = data?.billboard || {}

  if (pixelOffset) {
    billboard.pixelOffset = Cesium.Cartesian2.unpack(pixelOffset?.cartesian2)
  }
  if (eyeOffset) {
    billboard.eyeOffset = Cesium.Cartesian3.unpack(eyeOffset?.cartesian)
  }
  if (color) {
    billboard.color = unwrapColor(color?.rgba)
  }
  if (alignedAxis) {
    // billboard.alignedAxis = Cesium.Cartesian3.unpack(alignedAxis?.cartesian)
  }
  if (scaleByDistance) {
    billboard.scaleByDistance = Cesium.NearFarScalar.unpack(
      scaleByDistance?.nearFarScalar
    )
  }
  if (translucencyByDistance) {
    billboard.translucencyByDistance = Cesium.NearFarScalar.unpack(
      translucencyByDistance?.nearFarScalar
    )
  }
  if (pixelOffsetScaleByDistance) {
    billboard.pixelOffsetScaleByDistance = Cesium.NearFarScalar.unpack(
      pixelOffsetScaleByDistance?.nearFarScalar
    )
  }
  if (imageSubRegion) {
    billboard.imageSubRegion = Cesium.BoundingRectangle.unpack(
      imageSubRegion?.boundingRectangle
    )
  }
  if (distanceDisplayCondition) {
    billboard.distanceDisplayCondition = Cesium.DistanceDisplayCondition.unpack(
      distanceDisplayCondition?.distanceDisplayCondition
    )
  }
}

/**
 * @description: 更新点
 */
export const updatePoint = (point: any, data: EntityJsonData) => {
  if (!point) return
  const attrs = [
    'show',
    'pixelSize',
    'heightReference',
    // 'color',
    // 'outlineColor',
    'outlineWidth',
    // 'scaleByDistance',
    // 'translucencyByDistance',
    // 'distanceDisplayCondition',
    'disableDepthTestDistance'
  ]
  attrs.forEach((attr) => {
    point[attr] = data?.point?.[attr]
  })

  const {
    color,
    outlineColor,
    scaleByDistance,
    translucencyByDistance,
    distanceDisplayCondition
  } = data?.point || {}

  if (color) {
    point.color = unwrapColor(color?.rgba)
  }
  if (outlineColor) {
    point.outlineColor = unwrapColor(outlineColor?.rgba)
  }
  if (scaleByDistance) {
    point.scaleByDistance = Cesium.NearFarScalar.unpack(
      scaleByDistance?.nearFarScalar
    )
  }
  if (translucencyByDistance) {
    point.translucencyByDistance = Cesium.NearFarScalar.unpack(
      translucencyByDistance?.nearFarScalar
    )
  }
  if (distanceDisplayCondition) {
    point.distanceDisplayCondition = Cesium.DistanceDisplayCondition.unpack(
      distanceDisplayCondition?.distanceDisplayCondition
    )
  }
}

/**
 * @description: 更新线段
 */
export const updatePolyline = (polyline: any, data: EntityJsonData) => {
  if (!polyline) return
  const attrs = [
    'show',
    // 'positions',
    'width',
    // 'granularity',
    // 'material',
    // 'depthFailMaterial',
    'arcType',
    'clampToGround',
    'shadows',
    // 'distanceDisplayCondition',
    // 'classificationType',
    'zIndex'
  ]
  attrs.forEach((attr) => {
    polyline[attr] = data?.polyline?.[attr]
  })

  const { material, depthFailMaterial, distanceDisplayCondition } =
    data?.polyline || {}

  if (material) {
    polyline.material = unwrapPolylineMaterial(material)
  }
  if (depthFailMaterial) {
    polyline.depthFailMaterial = unwrapPolylineMaterial(depthFailMaterial)
  }
  if (distanceDisplayCondition) {
    polyline.distanceDisplayCondition = Cesium.DistanceDisplayCondition.unpack(
      distanceDisplayCondition?.distanceDisplayCondition
    )
  }
}

/**
 * @description: 更新多边形
 */
export const updatePolygon = (polygon: any, data: EntityJsonData) => {
  if (!polygon) return
  const attrs = [
    'show',
    // 'hierarchy',
    'height',
    'heightReference',
    'extrudedHeight',
    'extrudedHeightReference',
    'stRotation',
    // 'granularity',
    'fill',
    // 'material',
    'outline',
    // 'outlineColor',
    'outlineWidth',
    'perPositionHeight',
    'closeTop',
    'closeBottom',
    'arcType',
    'shadows',
    // 'distanceDisplayCondition',
    'classificationType',
    'zIndex'
  ]
  attrs.forEach((attr) => {
    if (attr === 'stRotation') {
      polygon[attr] = Cesium.Math.toRadians(data?.polygon?.[attr] || 0)
    } else {
      polygon[attr] = data?.polygon?.[attr]
    }
  })

  const { material, outlineColor, distanceDisplayCondition } =
    data?.polygon || {}

  if (material) {
    polygon.material = unwrapFillMaterial(material)
  }
  if (outlineColor) {
    polygon.outlineColor = unwrapColor(outlineColor?.rgba)
  }
  if (distanceDisplayCondition) {
    polygon.distanceDisplayCondition = Cesium.DistanceDisplayCondition.unpack(
      distanceDisplayCondition?.distanceDisplayCondition
    )
  }
}

/**
 * @description: 更新矩形
 */
export const updateRectangle = (rectangle: any, data: EntityJsonData) => {
  if (!rectangle) return
  const attrs = [
    'show',
    // 'coordinates',
    'height',
    'heightReference',
    'extrudedHeight',
    'extrudedHeightReference',
    'rotation',
    'stRotation',
    // 'granularity',
    'fill',
    // 'material',
    'outline',
    // 'outlineColor',
    'outlineWidth',
    'shadows',
    // 'distanceDisplayCondition',
    'classificationType',
    'zIndex'
  ]
  attrs.forEach((attr) => {
    if (attr === 'stRotation' || attr === 'rotation') {
      rectangle[attr] = Cesium.Math.toRadians(data?.rectangle?.[attr] || 0)
    } else {
      rectangle[attr] = data?.rectangle?.[attr]
    }
  })

  const { material, outlineColor, distanceDisplayCondition } =
    data?.rectangle || {}

  if (material) {
    rectangle.material = unwrapFillMaterial(material)
  }
  if (outlineColor) {
    rectangle.outlineColor = unwrapColor(outlineColor?.rgba)
  }
  if (distanceDisplayCondition) {
    rectangle.distanceDisplayCondition = Cesium.DistanceDisplayCondition.unpack(
      distanceDisplayCondition?.distanceDisplayCondition
    )
  }
}

/**
 * @description: 更新椭圆
 */
export const updateEllipse = (ellipse: any, data: EntityJsonData) => {
  if (!ellipse) return
  const attrs = [
    'show',
    // 'semiMajorAxis',
    // 'semiMinorAxis',
    'height',
    'heightReference',
    'extrudedHeight',
    'extrudedHeightReference',
    'rotation',
    'stRotation',
    // 'granularity',
    'fill',
    // 'material',
    'outline',
    // 'outlineColor',
    'outlineWidth',
    'numberOfVerticalLines',
    'shadows',
    // 'distanceDisplayCondition',
    'classificationType',
    'zIndex'
  ]
  attrs.forEach((attr) => {
    if (attr === 'stRotation' || attr === 'rotation') {
      ellipse[attr] = Cesium.Math.toRadians(data?.ellipse?.[attr] || 0)
    } else {
      ellipse[attr] = data?.ellipse?.[attr]
    }
  })

  const { material, outlineColor, distanceDisplayCondition } =
    data?.ellipse || {}

  if (material) {
    ellipse.material = unwrapFillMaterial(material)
  }
  if (outlineColor) {
    ellipse.outlineColor = unwrapColor(outlineColor?.rgba)
  }
  if (distanceDisplayCondition) {
    ellipse.distanceDisplayCondition = Cesium.DistanceDisplayCondition.unpack(
      distanceDisplayCondition?.distanceDisplayCondition
    )
  }
}

/**
 * @description: 更新模型
 */
export const updateModel = (model: any, data: EntityJsonData) => {
  if (!model) return
  const attrs = [
    'show',
    'uri',
    'scale',
    'minimumPixelSize',
    'maximumScale',
    'incrementallyLoadTextures',
    'runAnimations',
    'clampAnimations',
    'shadows',
    'heightReference',
    // 'silhouetteColor',
    'silhouetteSize',
    // 'color',
    'colorBlendMode',
    'colorBlendAmount'
    // 'imageBasedLightingFactor',
    // 'lightColor',
    // 'distanceDisplayCondition',
    // 'nodeTransformations',
    // 'articulations',
    // 'clippingPlanes'
  ]
  attrs.forEach((attr) => {
    model[attr] = data?.model?.[attr]
  })

  const { color, silhouetteColor, lightColor, distanceDisplayCondition } =
    data?.model || {}

  if (color) {
    model.color = unwrapColor(color?.rgba)
  }
  if (silhouetteColor) {
    model.silhouetteColor = unwrapColor(silhouetteColor?.rgba)
  }
  if (lightColor) {
    model.lightColor = unwrapColor(lightColor?.rgba)
  }
  if (distanceDisplayCondition) {
    model.distanceDisplayCondition = Cesium.DistanceDisplayCondition.unpack(
      distanceDisplayCondition?.distanceDisplayCondition
    )
  }
}

/**
 * @description: 更新文字
 */
export const updateLabel = (label: any, data: EntityJsonData) => {
  if (!label) return
  const attrs = [
    'show',
    'text',
    'font',
    'style',
    'scale',
    'showBackground',
    // 'backgroundColor',
    // 'backgroundPadding',
    // 'pixelOffset',
    // 'eyeOffset',
    'horizontalOrigin',
    'verticalOrigin',
    'heightReference',
    // 'fillColor',
    // 'outlineColor',
    'outlineWidth'
    // 'translucencyByDistance',
    // 'pixelOffsetScaleByDistance',
    // 'scaleByDistance',
    // 'distanceDisplayCondition',
    // 'disableDepthTestDistance'
  ]
  attrs.forEach((attr) => {
    label[attr] = data?.label?.[attr]
  })

  const {
    backgroundColor,
    backgroundPadding,
    pixelOffset,
    eyeOffset,
    fillColor,
    outlineColor,
    translucencyByDistance,
    pixelOffsetScaleByDistance,
    scaleByDistance,
    distanceDisplayCondition
  } = data?.label || {}

  if (backgroundColor) {
    label.backgroundColor = unwrapColor(backgroundColor?.rgba)
  }
  if (backgroundPadding) {
    label.backgroundPadding = Cesium.Cartesian2.unpack(
      backgroundPadding?.cartesian2
    )
  }
  if (pixelOffset) {
    label.pixelOffset = Cesium.Cartesian2.unpack(pixelOffset?.cartesian2)
  }
  if (eyeOffset) {
    label.eyeOffset = Cesium.Cartesian3.unpack(eyeOffset?.cartesian)
  }
  if (fillColor) {
    label.fillColor = unwrapColor(fillColor?.rgba)
  }
  if (outlineColor) {
    label.outlineColor = unwrapColor(outlineColor?.rgba)
  }
  if (scaleByDistance) {
    label.scaleByDistance = Cesium.NearFarScalar.unpack(
      scaleByDistance?.nearFarScalar
    )
  }
  if (translucencyByDistance) {
    label.translucencyByDistance = Cesium.NearFarScalar.unpack(
      translucencyByDistance?.nearFarScalar
    )
  }
  if (pixelOffsetScaleByDistance) {
    label.pixelOffsetScaleByDistance = Cesium.NearFarScalar.unpack(
      pixelOffsetScaleByDistance?.nearFarScalar
    )
  }
  if (distanceDisplayCondition) {
    label.distanceDisplayCondition = Cesium.DistanceDisplayCondition.unpack(
      distanceDisplayCondition?.distanceDisplayCondition
    )
  }
}

/**
 * @description: 更新动画效果
 */
export const updateAnimationEffect = (
  graphics: GraphicsType,
  data: EntityJsonData
) => {
  if (data.animationEffect) {
    const {
      type,
      startDate,
      stopDate,
      speed,
      degress,
      positions,
      flashColor1,
      flashColor2
    } = data.animationEffect || {}

    const start = dayjs(startDate)
    const stop = dayjs(stopDate)
    const startDateVal = start.isValid()
      ? start.format('YYYY-MM-DD HH:mm:ss')
      : ''
    const stopDateVal = stop.isValid() ? stop.format('YYYY-MM-DD HH:mm:ss') : ''
    const color1 = flashColor1?.color?.rgba
    const color2 = flashColor2?.color?.rgba
    let colorVal1 = '#FF0000'
    let colorVal2 = '#0000FF'
    if (color1) {
      const [red, green, blue, alpha] = color1
      colorVal1 = Cesium.Color.fromBytes(
        red,
        green,
        blue,
        alpha
      ).toCssColorString()
    }
    if (color2) {
      const [red, green, blue, alpha] = color2
      colorVal2 = Cesium.Color.fromBytes(
        red,
        green,
        blue,
        alpha
      ).toCssColorString()
    }

    const animationEffectData = {
      type,
      startDate: startDateVal,
      stopDate: stopDateVal,
      speed,
      degress: degress ?? [],
      positions: positions ?? [],
      flashColor1: colorVal1,
      flashColor2: colorVal2
    }

    if (startDateVal && stopDateVal) {
      const date1 = dayjs(startDateVal).toDate()
      const date2 = dayjs(stopDateVal).toDate()

      if (type === 'flash') {
        graphics?.flash(date1, date2, animationEffectData)
      }
      if (type === 'fade') {
        graphics?.fade(date1, date2, animationEffectData)
      }
      if (type === 'displacement') {
        graphics?.displacement(date1, date2, animationEffectData)
      }
      if (type === 'grow') {
        graphics?.grow(date1, date2, animationEffectData)
      }
    }
  }
}
