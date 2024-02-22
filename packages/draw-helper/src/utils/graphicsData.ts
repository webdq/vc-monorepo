import {
  getValue,
  getPosition2,
  getPosition3,
  getCartographicAndCartesian,
  getCartographicAndCartesianArray,
  getColor,
  getCesiumColor,
  getNearFarScalar,
  getBoundingRectangle,
  getDistanceDisplayCondition,
  getFillType,
  getFillMaterial,
  getLineType,
  getLineMaterial,
  getQuaternion,
  getPosition2Array,
  // getHierarchy,
  getCoordinates,
  getNodeTransformations,
  getPlaneAttr
} from './graphicsValue'
import type { GraphicsJsonData, GraphicsType } from '../types'

export const getBillboard = (billboard: any, graphics: GraphicsType) => {
  if (!billboard) return
  const {
    show,
    image,
    scale,
    pixelOffset,
    eyeOffset,
    horizontalOrigin,
    verticalOrigin,
    heightReference,
    // color,
    rotation,
    alignedAxis,
    sizeInMeters,
    width,
    height,
    scaleByDistance,
    translucencyByDistance,
    pixelOffsetScaleByDistance,
    imageSubRegion,
    distanceDisplayCondition,
    disableDepthTestDistance
  } = billboard
  return {
    show: getValue(show),
    image: getValue(image),
    scale: getValue(scale),
    pixelOffset: getPosition2(pixelOffset),
    eyeOffset: getPosition3(eyeOffset),
    horizontalOrigin: getValue(horizontalOrigin),
    verticalOrigin: getValue(verticalOrigin),
    heightReference: getValue(heightReference),
    color: getCesiumColor(getValue(graphics?.cacheColor)),
    rotation: Cesium.Math.toDegrees(getValue(rotation)),
    alignedAxis: getValue(alignedAxis),
    sizeInMeters: getValue(sizeInMeters),
    width: getValue(width),
    height: getValue(height),
    scaleByDistance: getNearFarScalar(scaleByDistance),
    translucencyByDistance: getNearFarScalar(translucencyByDistance),
    pixelOffsetScaleByDistance: getNearFarScalar(pixelOffsetScaleByDistance),
    imageSubRegion: getBoundingRectangle(imageSubRegion),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    ),
    disableDepthTestDistance: getValue(disableDepthTestDistance)
  }
}

export const getPoint = (point: any, graphics: GraphicsType) => {
  if (!point) return
  const {
    show,
    pixelSize,
    heightReference,
    // color,
    outlineColor,
    outlineWidth,
    scaleByDistance,
    translucencyByDistance,
    distanceDisplayCondition,
    disableDepthTestDistance
  } = point
  return {
    show: getValue(show),
    pixelSize: getValue(pixelSize),
    heightReference: getValue(heightReference),
    color: getCesiumColor(getValue(graphics?.cacheColor)),
    outlineColor: getColor(outlineColor),
    outlineWidth: getValue(outlineWidth),
    scaleByDistance: getNearFarScalar(scaleByDistance),
    translucencyByDistance: getNearFarScalar(translucencyByDistance),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    ),
    disableDepthTestDistance: getValue(disableDepthTestDistance)
  }
}

export const getPolyline = (polyline: any, graphics: GraphicsType) => {
  if (!polyline) return
  const {
    show,
    // positions,
    width,
    // granularity,
    material,
    depthFailMaterial,
    arcType,
    clampToGround,
    shadows,
    distanceDisplayCondition,
    classificationType,
    zIndex
  } = polyline

  const positionsVal = getCartographicAndCartesianArray(graphics?.positions)

  let materialTemp: any = material

  if (graphics?.animationEffect) {
    if (graphics?.type === 'polyline') {
      materialTemp = graphics?.cacheColor
    } else {
      materialTemp = graphics?.cacheOutlineColor
    }
  }

  const materialVal = getLineMaterial(materialTemp)

  return {
    loop: graphics?.loop,
    polylineType: getLineType(material),
    show: getValue(show),
    positions: positionsVal,
    width: getValue(width),
    // granularity: getValue(granularity),
    material: materialVal,
    depthFailMaterial: getLineMaterial(depthFailMaterial),
    arcType: getValue(arcType),
    clampToGround: getValue(clampToGround),
    shadows: getValue(shadows),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    ),
    classificationType: getValue(classificationType),
    zIndex: getValue(zIndex)
  }
}

export const getPolygon = (polygon: any, graphics: GraphicsType) => {
  if (!polygon) return
  const {
    show,
    // hierarchy,
    height,
    heightReference,
    extrudedHeight,
    extrudedHeightReference,
    stRotation,
    // granularity,
    fill,
    material,
    outline,
    outlineColor,
    outlineWidth,
    perPositionHeight,
    closeTop,
    closeBottom,
    arcType,
    shadows,
    distanceDisplayCondition,
    classificationType,
    zIndex
  } = polygon
  const hierarchyPositions: any = {
    holes: { cartesian: [], cartographicDegrees: [] },
    positions: getCartographicAndCartesianArray(graphics?.positions)
  }

  let materialTemp: any = material

  if (graphics?.animationEffect) {
    materialTemp = graphics?.cacheColor
  }

  const materialVal = getFillMaterial(materialTemp)

  return {
    fillType: getFillType(material),
    show: getValue(show),
    hierarchy: hierarchyPositions,
    height: getValue(height),
    heightReference: getValue(heightReference),
    extrudedHeight: getValue(extrudedHeight),
    extrudedHeightReference: getValue(extrudedHeightReference),
    stRotation: Cesium.Math.toDegrees(getValue(stRotation)),
    // granularity: getValue(granularity),
    fill: getValue(fill),
    material: materialVal,
    outline: getValue(outline),
    outlineColor: getColor(outlineColor),
    outlineWidth: getValue(outlineWidth),
    perPositionHeight: getValue(perPositionHeight),
    closeTop: getValue(closeTop),
    closeBottom: getValue(closeBottom),
    arcType: getValue(arcType),
    shadows: getValue(shadows),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    ),
    classificationType: getValue(classificationType),
    zIndex: getValue(zIndex)
  }
}

export const getRectangle = (rectangle: any, graphics: GraphicsType) => {
  if (!rectangle) return
  const {
    show,
    coordinates,
    height,
    heightReference,
    extrudedHeight,
    extrudedHeightReference,
    rotation,
    stRotation,
    // granularity,
    fill,
    material,
    outline,
    outlineColor,
    outlineWidth,
    shadows,
    distanceDisplayCondition,
    classificationType,
    zIndex
  } = rectangle

  let materialTemp: any = material

  if (graphics?.animationEffect) {
    materialTemp = graphics?.cacheColor
  }

  const materialVal = getFillMaterial(materialTemp)

  return {
    positions: getCartographicAndCartesianArray(graphics?.positions),
    fillType: getFillType(material),
    show: getValue(show),
    coordinates: getCoordinates(coordinates),
    height: getValue(height),
    heightReference: getValue(heightReference),
    extrudedHeight: getValue(extrudedHeight),
    extrudedHeightReference: getValue(extrudedHeightReference),
    rotation: Cesium.Math.toDegrees(getValue(rotation)),
    stRotation: Cesium.Math.toDegrees(getValue(stRotation)),
    // granularity: getValue(granularity),
    fill: getValue(fill),
    material: materialVal,
    outline: getValue(outline),
    outlineColor: getColor(outlineColor),
    outlineWidth: getValue(outlineWidth),
    shadows: getValue(shadows),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    ),
    classificationType: getValue(classificationType),
    zIndex: getValue(zIndex)
  }
}

export const getEllipse = (ellipse: any, graphics: GraphicsType) => {
  if (!ellipse) return
  const {
    show,
    semiMajorAxis,
    semiMinorAxis,
    height,
    heightReference,
    extrudedHeight,
    extrudedHeightReference,
    rotation,
    stRotation,
    // granularity,
    fill,
    material,
    outline,
    outlineColor,
    outlineWidth,
    numberOfVerticalLines,
    shadows,
    distanceDisplayCondition,
    classificationType,
    zIndex
  } = ellipse

  let materialTemp: any = material

  if (graphics?.animationEffect) {
    materialTemp = graphics?.cacheColor
  }

  const materialVal = getFillMaterial(materialTemp)

  return {
    positions: getCartographicAndCartesianArray(graphics?.positions),
    fillType: getFillType(material),
    show: getValue(show),
    semiMajorAxis: getValue(semiMajorAxis),
    semiMinorAxis: getValue(semiMinorAxis),
    height: getValue(height),
    heightReference: getValue(heightReference),
    extrudedHeight: getValue(extrudedHeight),
    extrudedHeightReference: getValue(extrudedHeightReference),
    rotation: Cesium.Math.toDegrees(getValue(rotation)),
    stRotation: Cesium.Math.toDegrees(getValue(stRotation)),
    // granularity: getValue(granularity),
    fill: getValue(fill),
    material: materialVal,
    outline: getValue(outline),
    outlineColor: getColor(outlineColor),
    outlineWidth: getValue(outlineWidth),
    numberOfVerticalLines: getValue(numberOfVerticalLines),
    shadows: getValue(shadows),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    ),
    classificationType: getValue(classificationType),
    zIndex: getValue(zIndex)
  }
}

export const getLabel = (label: any) => {
  if (!label) return
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
    translucencyByDistance,
    pixelOffsetScaleByDistance,
    scaleByDistance,
    distanceDisplayCondition,
    disableDepthTestDistance
  } = label
  return {
    show: getValue(show),
    text: getValue(text),
    font: getValue(font),
    style: getValue(style),
    scale: getValue(scale),
    showBackground: getValue(showBackground),
    backgroundColor: getColor(backgroundColor),
    backgroundPadding: getPosition2(backgroundPadding),
    pixelOffset: getPosition2(pixelOffset),
    eyeOffset: getPosition3(eyeOffset),
    horizontalOrigin: getValue(horizontalOrigin),
    verticalOrigin: getValue(verticalOrigin),
    heightReference: getValue(heightReference),
    fillColor: getColor(fillColor),
    outlineColor: getColor(outlineColor),
    outlineWidth: getValue(outlineWidth),
    translucencyByDistance: getNearFarScalar(translucencyByDistance),
    pixelOffsetScaleByDistance: getNearFarScalar(pixelOffsetScaleByDistance),
    scaleByDistance: getNearFarScalar(scaleByDistance),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    ),
    disableDepthTestDistance: getValue(disableDepthTestDistance)
  }
}

export const getWall = (wall: any, graphics: GraphicsType) => {
  if (!wall) return
  const {
    show,
    // positions,
    minimumHeights,
    maximumHeights,
    // granularity,
    fill,
    material,
    outline,
    outlineColor,
    outlineWidth,
    shadows,
    distanceDisplayCondition
  } = wall
  return {
    fillType: getFillType(material),
    show: getValue(show),
    positions: getCartographicAndCartesianArray(graphics?.positions),
    minimumHeights: getValue(minimumHeights),
    maximumHeights: getValue(maximumHeights),
    // granularity: getValue(granularity),
    fill: getValue(fill),
    material: getFillMaterial(material),
    outline: getValue(outline),
    outlineColor: getColor(outlineColor),
    outlineWidth: getValue(outlineWidth),
    shadows: getValue(shadows),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    )
  }
}

export const getFrustum = (frustum: any, graphics: GraphicsType) => {
  frustum = graphics?.frustum
  if (!frustum) return
  let origin, color, outlineColor
  if (frustum.origin) {
    origin = getCartographicAndCartesian(frustum?.origin)
  }
  if (frustum.color) {
    color = {
      rgba: frustum.color?.toBytes()
    }
  }
  if (frustum.outlineColor) {
    outlineColor = {
      rgba: frustum.outlineColor?.toBytes()
    }
  }
  return {
    aspectWidth: frustum.aspectWidth,
    aspectHeight: frustum.aspectHeight,
    show: frustum.show,
    fov: frustum.fov,
    near: frustum.near,
    far: frustum.far,
    xOffset: frustum.xOffset,
    yOffset: frustum.yOffset,
    origin,
    // orientation,
    // vertexFormat,
    color,
    outlineColor,
    heading: frustum.heading,
    pitch: frustum.pitch,
    roll: frustum.roll
  }
}

export const getModel = (model: any, graphics: GraphicsType) => {
  if (!model) return
  const {
    show,
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
    colorBlendAmount,
    imageBasedLightingFactor,
    lightColor,
    distanceDisplayCondition,
    nodeTransformations,
    articulations,
    clippingPlanes
  } = model
  return {
    show: getValue(show),
    gltf: getValue(uri),
    uri: getValue(uri),
    scale: getValue(scale),
    minimumPixelSize: getValue(minimumPixelSize),
    maximumScale: getValue(maximumScale),
    incrementallyLoadTextures: getValue(incrementallyLoadTextures),
    runAnimations: getValue(runAnimations),
    clampAnimations: getValue(clampAnimations),
    shadows: getValue(shadows),
    heightReference: getValue(heightReference),
    silhouetteColor: getColor(silhouetteColor),
    silhouetteSize: getValue(silhouetteSize),
    color: getCesiumColor(getValue(graphics?.cacheColor)),
    colorBlendMode: getValue(colorBlendMode),
    colorBlendAmount: getValue(colorBlendAmount),
    imageBasedLightingFactor: getPosition2(imageBasedLightingFactor),
    lightColor: getColor(lightColor),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    ),
    nodeTransformations: getNodeTransformations(nodeTransformations),
    articulations: getValue(articulations),
    clippingPlanes: getValue(clippingPlanes)
  }
}

export const getBox = (box: any) => {
  if (!box) return
  const {
    show,
    dimensions,
    heightReference,
    fill,
    material,
    outline,
    outlineColor,
    outlineWidth,
    shadows,
    distanceDisplayCondition
  } = box
  return {
    fillType: getFillType(material),
    show: getValue(show),
    dimensions: getPosition3(dimensions),
    heightReference: getValue(heightReference),
    fill: getValue(fill),
    material: getFillMaterial(material),
    outline: getValue(outline),
    outlineColor: getColor(outlineColor),
    outlineWidth: getValue(outlineWidth),
    shadows: getValue(shadows),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    )
  }
}

export const getCorridor = (corridor: any, graphics: GraphicsType) => {
  if (!corridor) return
  const {
    show,
    // positions,
    width,
    height,
    heightReference,
    extrudedHeight,
    extrudedHeightReference,
    cornerType,
    // granularity,
    fill,
    material,
    outline,
    outlineColor,
    outlineWidth,
    shadows,
    distanceDisplayCondition,
    classificationType,
    zIndex
  } = corridor
  return {
    fillType: getFillType(material),
    show: getValue(show),
    positions: getCartographicAndCartesianArray(graphics?.positions),
    width: getValue(width),
    height: getValue(height),
    heightReference: getValue(heightReference),
    extrudedHeight: getValue(extrudedHeight),
    extrudedHeightReference: getValue(extrudedHeightReference),
    cornerType: getValue(cornerType),
    // granularity: getValue(granularity),
    fill: getValue(fill),
    material: getFillMaterial(material),
    outline: getValue(outline),
    outlineColor: getColor(outlineColor),
    outlineWidth: getValue(outlineWidth),
    shadows: getValue(shadows),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    ),
    classificationType: getValue(classificationType),
    zIndex: getValue(zIndex)
  }
}

export const getCylinder = (cylinder: any) => {
  if (!cylinder) return
  const {
    show,
    length,
    topRadius,
    bottomRadius,
    heightReference,
    fill,
    material,
    outline,
    outlineColor,
    outlineWidth,
    numberOfVerticalLines,
    slices,
    shadows,
    distanceDisplayCondition
  } = cylinder
  return {
    fillType: getFillType(material),
    show: getValue(show),
    length: getValue(length),
    topRadius: getValue(topRadius),
    bottomRadius: getValue(bottomRadius),
    heightReference: getValue(heightReference),
    fill: getValue(fill),
    material: getFillMaterial(material),
    outline: getValue(outline),
    outlineColor: getColor(outlineColor),
    outlineWidth: getValue(outlineWidth),
    numberOfVerticalLines: getValue(numberOfVerticalLines),
    slices: getValue(slices),
    shadows: getValue(shadows),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    )
  }
}

export const getEllipsoid = (ellipsoid: any) => {
  if (!ellipsoid) return
  const {
    show,
    radii,
    innerRadii,
    minimumClock,
    maximumClock,
    minimumCone,
    maximumCone,
    heightReference,
    fill,
    material,
    outline,
    outlineColor,
    outlineWidth,
    stackPartitions,
    slicePartitions,
    subdivisions,
    shadows,
    distanceDisplayCondition
  } = ellipsoid
  return {
    fillType: getFillType(material),
    show: getValue(show),
    radii: getValue(radii),
    innerRadii: getValue(innerRadii),
    minimumClock: getValue(minimumClock),
    maximumClock: getValue(maximumClock),
    minimumCone: getValue(minimumCone),
    maximumCone: getValue(maximumCone),
    heightReference: getValue(heightReference),
    fill: getValue(fill),
    material: getFillMaterial(material),
    outline: getValue(outline),
    outlineColor: getColor(outlineColor),
    outlineWidth: getValue(outlineWidth),
    stackPartitions: getValue(stackPartitions),
    slicePartitions: getValue(slicePartitions),
    subdivisions: getValue(subdivisions),
    shadows: getValue(shadows),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    )
  }
}

export const getPath = (path: any) => {
  if (!path) return
  const {
    show,
    leadTime,
    trailTime,
    width,
    resolution,
    material,
    distanceDisplayCondition
  } = path
  return {
    polylineType: getLineType(material),
    show: getValue(show),
    leadTime: getValue(leadTime),
    trailTime: getValue(trailTime),
    width: getValue(width),
    resolution: getValue(resolution),
    material: getLineMaterial(material),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    )
  }
}

export const getPlane = (plane: any) => {
  if (!plane) return
  const {
    show,
    plane: planeAttr,
    dimensions,
    fill,
    material,
    outline,
    outlineColor,
    outlineWidth,
    shadows,
    distanceDisplayCondition
  } = plane
  return {
    fillType: getFillType(material),
    show: getValue(show),
    plane: getPlaneAttr(planeAttr),
    dimensions: getPosition2(dimensions),
    fill: getValue(fill),
    material: getFillMaterial(material),
    outline: getValue(outline),
    outlineColor: getColor(outlineColor),
    outlineWidth: getValue(outlineWidth),
    shadows: getValue(shadows),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    )
  }
}

export const getPolylineVolume = (
  polylineVolume: any,
  graphics: GraphicsType
) => {
  if (!polylineVolume) return
  const {
    show,
    // positions,
    shape,
    cornerType,
    // granularity,
    fill,
    material,
    outline,
    outlineColor,
    outlineWidth,
    shadows,
    distanceDisplayCondition
  } = polylineVolume
  return {
    fillType: getFillType(material),
    show: getValue(show),
    positions: getCartographicAndCartesianArray(graphics?.positions),
    shape: getPosition2Array(shape),
    cornerType: getValue(cornerType),
    // granularity: getValue(granularity),
    fill: getValue(fill),
    material: getFillMaterial(material),
    outline: getValue(outline),
    outlineColor: getColor(outlineColor),
    outlineWidth: getValue(outlineWidth),
    shadows: getValue(shadows),
    distanceDisplayCondition: getDistanceDisplayCondition(
      distanceDisplayCondition
    )
  }
}

export const getAnimationEffect = (_: any, graphics: GraphicsType) => {
  if (!graphics.animationEffect) return
  const {
    type,
    startDate,
    stopDate,
    speed,
    degress,
    positions,
    flashColor1,
    flashColor2
  } = graphics?.animationEffect || {}
  const color1 = flashColor1 && {
    color: getCesiumColor(Cesium.Color.fromCssColorString(flashColor1))
  }
  const color2 = flashColor2 && {
    color: getCesiumColor(Cesium.Color.fromCssColorString(flashColor2))
  }
  return {
    type,
    startDate,
    stopDate,
    speed,
    degress,
    positions,
    flashColor1: color1,
    flashColor2: color2
  }
}

export const getSignalLineData = (_: any, graphics: GraphicsType) => {
  if (!graphics.signalLineData) return
  const { startDate, stopDate, entityIds } = graphics.signalLineData || {}
  return {
    startDate,
    stopDate,
    entityIds
  }
}

export const getMovementData = (_: any, graphics: GraphicsType) => {
  if (!graphics.movementData) return
  const { pathId, modelId, startDate, stopDate, speed } =
    graphics.movementData || {}
  let showPath = true
  let degress: any[] = []
  let positions: any[] = []
  if (graphics.movementPathGraphics) {
    showPath = !!graphics.movementPathGraphics?.entity?.show
    positions = graphics.movementPathGraphics.getPositions()
    degress = positions.map((pos) => {
      const cartographic = Cesium.Cartographic.fromCartesian(pos)
      const longitude = Cesium.Math.toDegrees(cartographic.longitude)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude)
      const height = cartographic.height
      return { longitude, latitude, height }
    })
  }
  return {
    showPath,
    pathId,
    modelId,
    startDate,
    stopDate,
    speed,
    degress,
    positions
  }
}

export const getAvailability = (availability: any) => {
  if (!availability) return
  const length = availability.length
  const result = []
  for (let i = 0; i < length; i++) {
    const timeInterval = availability.get(i)
    const start = timeInterval.start.toString()
    const stop = timeInterval.stop.toString()
    result.push(`${start}/${stop}`)
  }
  return result.length === 0 ? result[0] : result
}
export const getDescription = (description: any) => {
  if (!description) return
  return getValue(description)
}
export const getOrientation = (orientation: any) => {
  if (!orientation) return
  return getQuaternion(orientation)
}
export const getViewFrom = (viewFrom: any) => {
  if (!viewFrom) return
  return getPosition3(viewFrom)
}
export const getPosition = (_: any, graphics: any) => {
  const pos = graphics?.positions?.[0]
  if (!pos) return
  return getCartographicAndCartesian(pos)
}

const graphicsFnMap = {
  availability: getAvailability,
  description: getDescription,
  orientation: getOrientation,
  viewFrom: getViewFrom,
  position: getPosition,
  billboard: getBillboard,
  point: getPoint,
  polyline: getPolyline,
  polygon: getPolygon,
  rectangle: getRectangle,
  ellipse: getEllipse,
  label: getLabel,
  wall: getWall,
  box: getBox,
  corridor: getCorridor,
  cylinder: getCylinder,
  ellipsoid: getEllipsoid,
  path: getPath,
  plane: getPlane,
  polylineVolume: getPolylineVolume,
  model: getModel,
  frustum: getFrustum,
  animationEffect: getAnimationEffect,
  signalLineData: getSignalLineData,
  movementData: getMovementData
}

export const getGraphicsData = (list: GraphicsType[]) => {
  const result: GraphicsJsonData[] = []
  for (let i = 0; i < list.length; i++) {
    const { id, type, entity, heading, pitch, roll } = list[i]
    const { id: entityId, name, show, parent } = entity!
    const obj: GraphicsJsonData = {
      id,
      type,
      entity: {
        heading,
        pitch,
        roll,
        type,
        id: entityId,
        name,
        show,
        parent: parent?.id
      }
    }
    const names = Object.keys(graphicsFnMap)
    for (let j = 0; j < names.length; j++) {
      const name = names[j] as keyof typeof graphicsFnMap
      obj['entity'][name] = graphicsFnMap[name]?.(
        entity![name as keyof typeof entity],
        list[i]
      )
    }
    result.push(obj)
  }
  return result
}
