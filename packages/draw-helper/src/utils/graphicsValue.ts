export const getValue = (property: any, time = Cesium.JulianDate.now()) => {
  return property?.getValue(time)
}

export const defaultValue = (a: any, b: any) => {
  return Cesium.defaultValue(a, b)
}

export const transformCartographic = (position: Cesium.Cartesian3) => {
  if (!position) return
  const cartographic = Cesium.Cartographic.fromCartesian(position)
  const longitude = Cesium.Math.toDegrees(cartographic.longitude)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude)
  const height = cartographic.height
  return {
    longitude,
    latitude,
    height
  }
}

export const transformCartographicArray = (
  positions: Cesium.Cartesian3[] = []
) => {
  if (!positions) return []
  const result: number[] = []
  positions.map((position: any) => {
    const pos = transformCartographic(position)
    if (pos) {
      result.push(pos.longitude, pos.latitude, pos.height)
    }
  })
  return result
}

export const getCartographicAndCartesian = (position: any) => {
  if (!position) return
  const result: any = {
    cartesian: [],
    cartographicDegrees: []
  }
  result.cartesian = [position.x, position.y, position.z]
  const pos = transformCartographic(position)
  if (pos) {
    result.cartographicDegrees = [pos.longitude, pos.latitude, pos.height]
  }
  return result
}

export const getCartographicAndCartesianArray = (positions: any = []) => {
  if (!positions) return
  const cartesianList = Cesium.Cartesian3.packArray(positions, [])
  const cartographicList = transformCartographicArray(positions)
  return {
    cartesian: [...cartesianList],
    cartographicDegrees: [...cartographicList]
  }
}

export const transformCartographicToCartesian = (array: number[] = []) => {
  if (!array) return
  let startingIndex = 0
  const cartographic = Cesium.Cartographic.fromDegrees(
    array[startingIndex++],
    array[startingIndex++],
    array[startingIndex]
  )
  const result = Cesium.Cartographic.toCartesian(cartographic)
  return result
}

export const transformCartographicToCartesianArray = (array: number[] = []) => {
  const length = array?.length || 0
  const result: Cesium.Cartesian3[] = new Array(length / 3)
  for (let i = 0; i < length; i += 3) {
    const index = i / 3
    let startingIndex = i
    const cartographic = Cesium.Cartographic.fromDegrees(
      array[startingIndex++],
      array[startingIndex++],
      array[startingIndex]
    )
    const cartesian = Cesium.Cartographic.toCartesian(cartographic)
    result[index] = cartesian
  }
  return result
}

export const getPosition2 = (position: any) => {
  const val = getValue(position)
  if (val) {
    return {
      cartesian2: [val.x, val.y]
    }
  }
}

export const getPosition3 = (position: any) => {
  const val = getValue(position)
  if (val) {
    return {
      cartesian: [val.x, val.y, val.z]
    }
  }
}

export const getPosition2Array = (positions: any[]) => {
  const val = getValue(positions)
  if (val) {
    const positions: any = []
    val.forEach((item: any) => {
      positions.push(item.x, item.y)
    })
    return {
      cartesian2: positions
    }
  }
}

export const getQuaternion = (quaternion: any) => {
  const val = getValue(quaternion)
  if (val) {
    return {
      unitQuaternion: [val.x, val.y, val.z, val.w]
    }
  }
}

export const getColor = (color: any) => {
  const val = getValue(color)
  if (val) {
    return {
      rgba: val.toBytes()
    }
  }
}

export const getCesiumColor = (val: Cesium.Color) => {
  if (val) {
    return {
      rgba: val.toBytes()
    }
  }
}

export const getNearFarScalar = (nearFarScalar: any) => {
  const val = getValue(nearFarScalar)
  if (val) {
    return {
      nearFarScalar: [val.near, val.nearValue, val.far, val.farValue]
    }
  }
}

export const getBoundingRectangle = (boundingRectangle: any) => {
  const val = getValue(boundingRectangle)
  if (val)
    return {
      boundingRectangle: [val.x, val.y, val.width, val.height]
    }
}

export const getDistanceDisplayCondition = (distanceDisplayCondition: any) => {
  const val = getValue(distanceDisplayCondition)
  if (val)
    return {
      distanceDisplayCondition: [val.near, val.far]
    }
}

export const getFillType = (material: any) => {
  return material?.getType()
}

export const getFillMaterial = (material: any) => {
  const type = material?.getType()
  switch (type) {
    case 'Color':
      return {
        solidColor: {
          color: getColor(material?.color)
        }
      }
    case 'Image':
      return {
        image: {
          color: getColor(material?.color),
          image: {
            uri: getValue(material?.image)
          },
          repeat: getPosition2(material?.repeat),
          transparent: getValue(material?.transparent)
        }
      }
    case 'Grid':
      return {
        grid: {
          color: getColor(material?.color),
          cellAlpha: getValue(material?.cellAlpha),
          lineCount: getPosition2(material?.lineCount),
          lineThickness: getPosition2(material?.lineThickness),
          lineOffset: getPosition2(material?.lineOffset)
        }
      }
    case 'Stripe':
      return {
        stripe: {
          orientation: getValue(material?.orientation),
          evenColor: getColor(material?.evenColor),
          oddColor: getColor(material?.oddColor),
          offset: getValue(material?.offset),
          repeat: getValue(material?.repeat)
        }
      }
    case 'Checkerboard':
      return {
        checkerboard: {
          evenColor: getColor(material?.evenColor),
          oddColor: getColor(material?.oddColor),
          repeat: getPosition2(material?.repeat)
        }
      }
    case 'CircleBlur':
      return {
        circleBlur: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'CircleDiffuse':
      return {
        circleDiffuse: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'CircleFade':
      return {
        circleFade: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'CirclePulse':
      return {
        circlePulse: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'CircleScan':
      return {
        circleScan: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'CircleSpiral':
      return {
        circleSpiral: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'CircleVary':
      return {
        circleVary: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'CircleWave':
      return {
        circleWave: {
          color: getColor(material?.color),
          speed: getValue(material?.speed),
          count: getValue(material?.count),
          gradient: getValue(material?.gradient)
        }
      }
    case 'EllipsoidElectric':
      return {
        ellipsoidElectric: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'EllipsoidTrail':
      return {
        ellipsoidTrail: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'RadarLine':
      return {
        radarLine: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'RadarScan':
      return {
        radarScan: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'RadarSweep':
      return {
        radarSweep: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'RadarWave':
      return {
        radarWave: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'WallImageTrail':
      return {
        radarWave: {
          color: getColor(material?.color),
          speed: getValue(material?.speed),
          image: getValue(material?.image),
          repeat: getPosition2(material?.repeat)
        }
      }
    case 'WallLineTrail':
      return {
        radarWave: {
          color: getColor(material?.color),
          speed: getValue(material?.speed),
          image: getValue(material?.image),
          repeat: getPosition2(material?.repeat)
        }
      }
    case 'WallTrail':
      return {
        radarWave: {
          color: getColor(material?.color),
          speed: getValue(material?.speed),
          image: getValue(material?.image)
        }
      }
  }
}

export const getLineType = (material: any) => {
  return material?.getType()
}

export const getLineMaterial = (material: any) => {
  const type = material?.getType()
  switch (type) {
    case 'Color':
      return {
        solidColor: {
          color: getColor(material?.color)
        }
      }
    case 'PolylineDash':
      return {
        polylineDash: {
          color: getColor(material?.color),
          gapColor: getColor(material?.gapColor),
          dashLength: getValue(material?.dashLength),
          dashPattern: getValue(material?.dashPattern)
        }
      }
    case 'PolylineOutline':
      return {
        polylineOutline: {
          color: getColor(material?.color),
          outlineColor: getColor(material?.outlineColor),
          outlineWidth: getValue(material?.outlineWidth)
        }
      }
    case 'PolylineArrow':
      return {
        polylineArrow: {
          color: getColor(material?.color)
        }
      }
    case 'PolylineGlow':
      return {
        polylineGlow: {
          color: getColor(material?.color),
          glowPower: getValue(material?.glowPower),
          taperPower: getValue(material?.taperPower)
        }
      }
    case 'PolylineFlicker':
      return {
        polylineFlicker: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
    case 'PolylineFlow':
      return {
        polylineFlow: {
          color: getColor(material?.color),
          speed: getValue(material?.speed),
          percent: getValue(material?.percent),
          gradient: getValue(material?.gradient)
        }
      }
    case 'PolylineImageTrail':
      return {
        polylineImageTrail: {
          color: getColor(material?.color),
          speed: getValue(material?.speed),
          image: getValue(material?.image),
          repeat: getPosition2(material?.repeat)
        }
      }
    case 'PolylineLightingTrail':
      return {
        polylineLightingTrail: {
          color: getColor(material?.color),
          speed: getValue(material?.speed),
          image: getValue(material?.image)
        }
      }
    case 'PolylineTrail':
      return {
        polylineTrail: {
          color: getColor(material?.color),
          speed: getValue(material?.speed)
        }
      }
  }
}

export const getHierarchy = (hierarchy: any) => {
  const val = getValue(hierarchy)
  if (val) {
    const positions: any = []
    val?.positions?.forEach((item: any) => {
      positions.push(item.x, item.y, item.z)
    })
    const holes: any = []
    val?.holes?.forEach((hole: any) => {
      const row: any = []
      hole?.positions?.forEach((pos: any) => {
        row.push(pos.x, pos.y, pos.z)
      })
      if (row.length) holes.push(row)
    })
    return {
      positions: {
        cartesian: positions
      },
      holes: {
        cartesian: holes
      }
    }
  }
}

export const getCoordinates = (coordinates: any) => {
  const val = getValue(coordinates)
  if (val) {
    return {
      wsenDegrees: [val?.west, val?.south, val?.east, val?.north]
    }
  }
}

export const getSampledPropertyQuaternion = (property: any) => {
  if (!property) return
  const result: any = {}
  if (property instanceof Cesium.SampledProperty) {
    const times = (property as any)._times
    if (!times.length) return
    const startTime = times[0]
    const unitQuaternion: any = []
    result.epoch = startTime?.toString()
    for (let i = 0; i < times.length; i++) {
      const t = times[i].secondsOfDay - startTime.secondsOfDay
      const val = getValue(property, times[i])
      unitQuaternion.push(t, val?.x, val?.y, val?.z, val?.w)
    }
    result.unitQuaternion = unitQuaternion
  } else {
    const val = getValue(property)
    if (!val) return
    result.unitQuaternion = [val?.x, val?.y, val?.z, val?.w]
  }
  return result
}

export const getSampledPropertyPosition = (property: any) => {
  if (!property) return
  const result: any = {}
  if (property instanceof Cesium.SampledProperty) {
    const times = (property as any)._times
    if (!times.length) return
    const startTime = times[0]
    const cartesian: any = []
    result.epoch = startTime?.toString()
    for (let i = 0; i < times.length; i++) {
      const t = times[i].secondsOfDay - startTime.secondsOfDay
      const val = getValue(property, times[i])
      cartesian.push(t, val?.x, val?.y, val?.z)
    }
    result.cartesian = cartesian
  } else {
    const val = getValue(property)
    if (!val) return
    result.cartesian = [val?.x, val?.y, val?.z]
  }
  return result
}

export const getNodeTransformations = (nodeTransformations: any) => {
  const val = getValue(nodeTransformations)
  if (val) {
    const propertyNames = val.propertyNames
    if (!propertyNames.length) return
    const result: any = {}
    for (let i = 0; i < propertyNames.length; i++) {
      const propertyName = propertyNames[i]
      const translation = getSampledPropertyPosition(
        nodeTransformations[propertyName].translation
      )
      const rotation = getSampledPropertyQuaternion(
        nodeTransformations[propertyName].rotation
      )
      const scale = getSampledPropertyPosition(
        nodeTransformations[propertyName].scale
      )
      result[propertyName] = {
        translation,
        rotation,
        scale
      }
    }
    return result
  }
}

export const getPlaneAttr = (plane: any) => {
  const val = getValue(plane)
  if (val) {
    return {
      normal: {
        cartesian: [val?.normal?.x, val?.normal?.y, val?.normal?.z]
      },
      distance: val?.distance
    }
  }
}
