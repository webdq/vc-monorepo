export const getValue = (property: any) => {
  return property?.getValue(Cesium.JulianDate.now())
}

export const defaultValue = (a: any, b: any) => {
  return Cesium.defaultValue(a, b)
}

export const getCommonData = (graphics: any) => {
  const data: any = {}
  const { height, heightReference, extrudedHeight, stRotation, fill, zIndex } =
    graphics

  data.height = defaultValue(getValue(height), 0)
  data.heightReference = defaultValue(getValue(heightReference), 0)
  data.extrudedHeight = getValue(extrudedHeight)
  data.stRotation = defaultValue(getValue(stRotation), 0)
  data.fill = defaultValue(getValue(fill), true)
  data.zIndex = defaultValue(getValue(zIndex), 0)
  return data
}

export const getOutlineData = (graphics: any, polyline: any) => {
  const data: any = {}
  const { height, extrudedHeight, outline: polygonOutline } = graphics
  const {
    show: polylineOutline,
    material: polylineOutlineColor,
    width: polylineOutlineWidth
  } = polyline

  const heightValue = getValue(height)
  const extrudedHeightValue = getValue(extrudedHeight)
  const polygonOutlineValue = getValue(polygonOutline)
  const polylineOutlineValue = getValue(polylineOutline)
  const polylineOutlineColorValue = getValue(polylineOutlineColor)
  const isHeight = !!(heightValue || extrudedHeightValue)
  const outline = isHeight ? polygonOutlineValue : polylineOutlineValue

  data.outline = outline
  data.outlineColor = polylineOutlineColorValue.color.toCssColorString()
  data.outlineWidth = getValue(polylineOutlineWidth)

  return data
}

export const getLineMaterialData = (graphics: any) => {
  const data: any = {}
  const type = graphics.material.getType()
  const materialValue = getValue(graphics.material)
  data.polylineType = type
  data.color = materialValue?.color?.toCssColorString()
  switch (type) {
    case 'Color':
      break
    case 'PolylineDash':
      data.dashLength = materialValue?.dashLength
      data.dashPattern = materialValue?.dashPattern
      break
    case 'PolylineOutline':
      data.outlineColor = materialValue?.outlineColor?.toCssColorString()
      data.outlineWidth = materialValue?.outlineWidth
      break
    case 'PolylineArrow':
      break
    case 'PolylineGlow':
      data.glowPower = materialValue?.glowPower
      data.taperPower = materialValue?.taperPower
      break
    case 'PolylineFlicker':
      data.speed = materialValue?.speed
      break
    case 'PolylineFlow':
      data.speed = materialValue?.speed
      data.percent = materialValue?.percent
      data.gradient = materialValue?.gradient
      break
    case 'PolylineImageTrail':
      data.speed = materialValue?.speed
      data.image = materialValue?.image
      break
    case 'PolylineLightingTrail':
      data.speed = materialValue?.speed
      data.image = materialValue?.image
      break
    case 'PolylineTrail':
      data.speed = materialValue?.speed
      break
  }
  return data
}

export const getFillMaterialData = (graphics: any) => {
  const data: any = {}
  const type = graphics.material.getType()
  const materialValue = getValue(graphics.material)
  const checkerboardEvenColor =
    materialValue?.evenColor || materialValue?.lightColor
  const checkerboardOddColor =
    materialValue?.oddColor || materialValue?.darkColor
  data.fillType = type
  switch (type) {
    case 'Color':
      data.color = materialValue?.color?.toCssColorString()
      data.material = materialValue?.color?.toCssColorString()
      break
    case 'Image':
      data.fillImage = materialValue?.image
      data.fillImageRepeatX = materialValue?.repeat?.x
      data.fillImageRepeatY = materialValue?.repeat?.y
      data.fillImageTransparent = materialValue?.transparent
      data.color = materialValue?.color?.toCssColorString()
      data.material = materialValue?.color?.toCssColorString()
      break
    case 'Grid':
      data.fillGridCellAlpha = materialValue?.cellAlpha
      data.fillGridLineCountX = materialValue?.lineCount?.x
      data.fillGridLineCountY = materialValue?.lineCount?.y
      data.fillGridLineThicknessX = materialValue?.lineThickness?.x
      data.fillGridLineThicknessY = materialValue?.lineThickness?.y
      data.fillGridLineOffsetX = materialValue?.lineOffset?.x
      data.fillGridLineOffsetY = materialValue?.lineOffset?.y
      data.color = materialValue?.color?.toCssColorString()
      data.material = materialValue?.color?.toCssColorString()
      break
    case 'Stripe':
      data.fillStripeOrientation = materialValue?.orientation
      data.fillStripeEvenColor = materialValue?.evenColor?.toCssColorString()
      data.fillStripeOddColor = materialValue?.oddColor?.toCssColorString()
      data.fillStripeOffset = materialValue?.offset
      data.fillStripeRepeat = materialValue?.repeat
      data.color = '#fff'
      data.material = '#fff'
      break
    case 'Checkerboard':
      data.fillCheckerboardEvenColor = checkerboardEvenColor?.toCssColorString()
      data.fillCheckerboardOddColor = checkerboardOddColor?.toCssColorString()
      data.fillCheckerboardRepeatX = materialValue?.repeat?.x
      data.fillCheckerboardRepeatY = materialValue?.repeat?.y
      data.color = '#fff'
      data.material = '#fff'
      break
    case 'CircleBlur':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'CircleDiffuse':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'CircleFade':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'CirclePulse':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'CircleScan':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'CircleSpiral':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'CircleVary':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'CircleWave':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      data.count = materialValue?.count
      data.gradient = materialValue?.gradient
      break
    case 'EllipsoidElectric':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'EllipsoidTrail':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'RadarLine':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'RadarScan':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'RadarSweep':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'RadarWave':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      break
    case 'WallImageTrail':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      data.image = materialValue?.image
      data.repeat = materialValue?.repeat
      break
    case 'WallLineTrail':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      data.image = materialValue?.image
      data.repeat = materialValue?.repeat
      break
    case 'WallTrail':
      data.color = materialValue?.color?.toCssColorString()
      data.speed = materialValue?.speed
      data.image = materialValue?.image
      break
  }
  return data
}

export const getDistanceDisplayConditionData = (graphics: any) => {
  const data: any = {}
  const { distanceDisplayCondition } = graphics
  const distanceDisplayConditionValue = getValue(distanceDisplayCondition)
  if (distanceDisplayConditionValue) {
    const { far, near } = distanceDisplayConditionValue
    data.distanceDisplayCondition = {
      far,
      near
    }
    data.distanceDisplayConditionFar = far
    data.distanceDisplayConditionNear = near
    data.isDistanceDisplayCondition = true
  } else {
    data.distanceDisplayCondition = undefined
    data.isDistanceDisplayCondition = false
  }
  return data
}

export const getTranslucencyByDistanceData = (graphics: any) => {
  const data: any = {}
  const { translucencyByDistance } = graphics
  const translucencyByDistanceValue = getValue(translucencyByDistance)
  if (translucencyByDistanceValue) {
    const { far, farValue, near, nearValue } = translucencyByDistanceValue
    data.translucencyByDistance = {
      far,
      farValue,
      near,
      nearValue
    }
    data.translucencyByDistanceFar = far
    data.translucencyByDistanceFarValue = farValue
    data.translucencyByDistanceNear = near
    data.translucencyByDistanceNearValue = nearValue
    data.isTranslucencyByDistance = true
  } else {
    data.translucencyByDistance = undefined
    data.isTranslucencyByDistance = false
  }
  return data
}

export const getScaleByDistanceData = (graphics: any) => {
  const data: any = {}
  const { scaleByDistance } = graphics
  const scaleByDistanceValue = getValue(scaleByDistance)
  if (scaleByDistanceValue) {
    const { far, farValue, near, nearValue } = scaleByDistanceValue
    data.scaleByDistance = {
      far,
      farValue,
      near,
      nearValue
    }
    data.scaleByDistanceFar = far
    data.scaleByDistanceFarValue = farValue
    data.scaleByDistanceNear = near
    data.scaleByDistanceNearValue = nearValue
    data.isScaleByDistance = true
  } else {
    data.scaleByDistance = undefined
    data.isScaleByDistance = false
  }
  return data
}

export const getDataFromPin = (entity: Cesium.Entity) => {
  if (!entity.billboard) return

  const {
    image,
    scale,
    pixelOffset,
    eyeOffset,
    horizontalOrigin,
    verticalOrigin,
    heightReference,
    color,
    rotation,
    sizeInMeters,
    width,
    height,
    disableDepthTestDistance
  } = entity.billboard

  let colorProp = getValue(color)
  colorProp = colorProp.color || colorProp
  colorProp = defaultValue(colorProp, Cesium.Color.WHITE).toCssColorString()

  const data: any = {
    image: getValue(image),
    scale: defaultValue(getValue(scale), 1),
    pixelOffset: getValue(pixelOffset),
    pixelOffsetX: getValue(pixelOffset)?.x,
    pixelOffsetY: getValue(pixelOffset)?.y,
    eyeOffset: getValue(eyeOffset),
    eyeOffsetX: getValue(eyeOffset)?.x,
    eyeOffsetY: getValue(eyeOffset)?.y,
    eyeOffsetZ: getValue(eyeOffset)?.z,
    horizontalOrigin: defaultValue(getValue(horizontalOrigin), 0),
    verticalOrigin: defaultValue(getValue(verticalOrigin), 0),
    heightReference: defaultValue(getValue(heightReference), 0),
    color: colorProp,
    rotation: defaultValue(getValue(rotation), 0),
    sizeInMeters: defaultValue(getValue(sizeInMeters), false),
    width: getValue(width),
    height: getValue(height),
    disableDepthTestDistance: getValue(disableDepthTestDistance)
  }

  const scaleByDistance = getScaleByDistanceData(entity.billboard)
  const translucency = getTranslucencyByDistanceData(entity.billboard)
  const distance = getDistanceDisplayConditionData(entity.billboard)

  return { ...data, ...scaleByDistance, ...translucency, ...distance }
}

export const getDataFromPoint = (entity: Cesium.Entity) => {
  if (!entity.point) return

  const {
    pixelSize,
    heightReference,
    color,
    outlineColor,
    outlineWidth,
    disableDepthTestDistance
  } = entity.point

  let colorProp = getValue(color)
  colorProp = colorProp.color || colorProp
  colorProp = defaultValue(colorProp, Cesium.Color.RED).toCssColorString()

  const data: any = {
    pixelSize: getValue(pixelSize),
    heightReference: defaultValue(getValue(heightReference), 0),
    color: colorProp,
    outlineColor: getValue(outlineColor).toCssColorString(),
    outlineWidth: getValue(outlineWidth),
    disableDepthTestDistance: getValue(disableDepthTestDistance)
  }

  const scaleByDistance = getScaleByDistanceData(entity.point)
  const translucency = getTranslucencyByDistanceData(entity.point)
  const distance = getDistanceDisplayConditionData(entity.point)

  return { ...data, ...scaleByDistance, ...translucency, ...distance }
}

export const getDataFromPolyline = (entity: Cesium.Entity) => {
  if (!entity.polyline) return

  const { width, material, arcType, clampToGround } = entity.polyline

  const data: any = {
    material: getValue(material)?.color?.toCssColorString(),
    width: getValue(width),
    arcType: getValue(arcType),
    clampToGround: defaultValue(getValue(clampToGround), false)
  }

  const line = getLineMaterialData(entity.polyline)
  const distance = getDistanceDisplayConditionData(entity.polyline)

  return { ...data, ...line, ...distance }
}

export const getDataFromPolygon = (entity: Cesium.Entity) => {
  if (!entity.polygon) return

  const { closeTop, closeBottom } = entity.polygon
  const data = {
    ...getSurfaceData(entity.polygon, entity.polyline),
    closeTop: defaultValue(getValue(closeTop), true),
    closeBottom: defaultValue(getValue(closeBottom), true)
  }
  return data
}

export const getDataFromRectangle = (entity: Cesium.Entity) => {
  if (!entity.rectangle) return

  const { rotation } = entity.rectangle
  const data = {
    ...getSurfaceData(entity.rectangle, entity.polyline),
    rotation: defaultValue(getValue(rotation), 0)
  }
  return data
}

export const getDataFromCircle = (entity: Cesium.Entity) => {
  if (!entity.ellipse) return

  const { semiMinorAxis, rotation } = entity.ellipse
  const data = {
    ...getSurfaceData(entity.ellipse, entity.polyline),
    radius: getValue(semiMinorAxis),
    rotation: defaultValue(getValue(rotation), 0)
  }
  return data
}

export const getSurfaceData = (graphics: any, polyline: any) => {
  const common = getCommonData(graphics)
  const outline = getOutlineData(graphics, polyline)
  const material = getFillMaterialData(graphics)
  const distance = getDistanceDisplayConditionData(graphics)
  return { ...common, ...outline, ...material, ...distance }
}

export const getDataFromModel = (entity: Cesium.Entity) => {
  if (!entity.model) return

  const {
    uri,
    scale,
    minimumPixelSize,
    maximumScale,
    incrementallyLoadTextures,
    runAnimations,
    clampAnimations,
    shadows,
    heightReference,
    silhouetteColor,
    silhouetteSize,
    color,
    colorBlendMode,
    colorBlendAmount
    // imageBasedLightingFactor,
    // lightColor,
    // distanceDisplayCondition,
    // nodeTransformations,
    // articulations,
    // clippingPlanes
  } = entity.model

  const data = {
    uri: getValue(uri),
    scale: defaultValue(getValue(scale), 1),
    minimumPixelSize: defaultValue(getValue(minimumPixelSize), 0),
    maximumScale: getValue(maximumScale),
    incrementallyLoadTextures: defaultValue(
      getValue(incrementallyLoadTextures),
      true
    ),
    runAnimations: defaultValue(getValue(runAnimations), true),
    clampAnimations: defaultValue(getValue(clampAnimations), true),
    shadows: defaultValue(getValue(shadows), Cesium.ShadowMode.ENABLED),
    heightReference: defaultValue(getValue(heightReference), 0),
    silhouetteColor: defaultValue(
      getValue(silhouetteColor),
      Cesium.Color.RED
    ).toCssColorString(),
    silhouetteSize: defaultValue(getValue(silhouetteSize), 0),
    color: defaultValue(getValue(color), Cesium.Color.WHITE).toCssColorString(),
    colorBlendMode: defaultValue(
      getValue(colorBlendMode),
      Cesium.ColorBlendMode.HIGHLIGHT
    ),
    colorBlendAmount: defaultValue(getValue(colorBlendAmount), 0.5)
    // imageBasedLightingFactor: getValue(imageBasedLightingFactor),
    // lightColor: getValue(lightColor).toCssColorString(),
    // distanceDisplayCondition: getValue(distanceDisplayCondition),
    // nodeTransformations: getValue(nodeTransformations),
    // articulations: getValue(articulations),
    // clippingPlanes: getValue(clippingPlanes)
  }

  const distance = getDistanceDisplayConditionData(entity.model)

  return { ...data, ...distance }
}

export const getDataFromLabel = (entity: Cesium.Entity) => {
  if (!entity.label) return

  const {
    show,
    text,
    font,
    style,
    scale,
    showBackground,
    backgroundColor,
    backgroundPadding,
    pixelOffset,
    eyeOffset,
    horizontalOrigin,
    verticalOrigin,
    heightReference,
    fillColor,
    outlineColor,
    outlineWidth,
    // translucencyByDistance,
    // pixelOffsetScaleByDistance,
    // scaleByDistance,
    // distanceDisplayCondition,
    disableDepthTestDistance
  } = entity.label

  const data: any = {
    show: getValue(show),
    text: getValue(text),
    font: getValue(font),
    style: getValue(style),
    scale: getValue(scale),
    showBackground: getValue(showBackground),
    backgroundColor: getValue(backgroundColor).toCssColorString(),
    backgroundPadding: getValue(backgroundPadding),
    backgroundPaddingX: getValue(backgroundPadding)?.x,
    backgroundPaddingY: getValue(backgroundPadding)?.y,
    pixelOffset: getValue(pixelOffset),
    pixelOffsetX: getValue(pixelOffset)?.x,
    pixelOffsetY: getValue(pixelOffset)?.y,
    eyeOffset: getValue(eyeOffset),
    eyeOffsetX: getValue(eyeOffset)?.x,
    eyeOffsetY: getValue(eyeOffset)?.y,
    eyeOffsetZ: getValue(eyeOffset)?.z,
    horizontalOrigin: getValue(horizontalOrigin),
    verticalOrigin: getValue(verticalOrigin),
    heightReference: defaultValue(getValue(heightReference), 0),
    fillColor: getValue(fillColor).toCssColorString(),
    outlineColor: getValue(outlineColor).toCssColorString(),
    outlineWidth: getValue(outlineWidth),
    disableDepthTestDistance: getValue(disableDepthTestDistance)
  }

  const scaleByDistance = getScaleByDistanceData(entity.label)
  const translucency = getTranslucencyByDistanceData(entity.label)
  const distance = getDistanceDisplayConditionData(entity.label)

  return { ...data, ...scaleByDistance, ...translucency, ...distance }
}

export const getGraphicsAttrData = (graphics: any) => {
  const type = graphics.type
  const entity = graphics.entity
  let data: any = {}
  switch (type) {
    case 'label':
      data = getDataFromLabel(entity)
      break
    case 'billboard':
    case 'pin':
      data = getDataFromPin(entity)
      break
    case 'point':
      data = getDataFromPoint(entity)
      break
    case 'polyline':
      data = getDataFromPolyline(entity)
      break
    case 'polygon':
    case 'fineArrow':
    case 'attackArrow':
    case 'tailedAttackArrow':
    case 'doubleArrow':
    case 'gatheringPlace':
      data = getDataFromPolygon(entity)
      break
    case 'rectangle':
      data = getDataFromRectangle(entity)
      break
    case 'circle':
      data = getDataFromCircle(entity)
      break
    case 'model':
      data = getDataFromModel(entity)
      break
  }
  return { ...data, loop: graphics.loop }
}

export const colorNames = [
  'backgroundColor',
  'fillColor',
  'color',
  'outlineColor',
  'silhouetteColor'
]

export const updateEntityAttr = (
  entity: Cesium.Entity,
  type: string,
  key: string,
  value: any
) => {
  if (type === '@@entity') {
    ;(entity as any)[key] = value
  }
  if (type === '@@function') {
    ;(entity as any)[key](...value)
  } else {
    if (colorNames.includes(key)) {
      value = Cesium.Color.fromCssColorString(value)
    }
    ;(entity as any)[type][key] = value
  }
  // console.log(`entity.${type}.${key}`, value)
}
