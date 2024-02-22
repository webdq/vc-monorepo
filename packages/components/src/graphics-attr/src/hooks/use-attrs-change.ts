import { unref } from 'vue'

export const useAttrsChange = (
  formData: any,
  graphicsName: string,
  emit: any
) => {
  const attrChange = (key: string, value?: any, name?: string) => {
    const data = unref(formData)
    let val = undefined
    if (value === '@@undefined') {
      val = undefined
    } else if (typeof value === 'boolean') {
      val = value
    } else if (value) {
      val = value
    } else if (key === 'rotation' || key === 'stRotation') {
      val = Cesium.Math.toRadians(data[key as keyof typeof data])
    } else {
      val = data[key as keyof typeof data]
    }
    const type = name ?? graphicsName
    emit('updateAttr', type, key, val)
  }

  const scaleByDistanceChange = () => {
    const {
      isScaleByDistance,
      scaleByDistanceNear,
      scaleByDistanceNearValue,
      scaleByDistanceFar,
      scaleByDistanceFarValue
    } = unref(formData)
    let scaleByDistance: any
    if (isScaleByDistance) {
      scaleByDistance = new Cesium.NearFarScalar(
        scaleByDistanceNear,
        scaleByDistanceNearValue,
        scaleByDistanceFar,
        scaleByDistanceFarValue
      )
    } else {
      scaleByDistance = undefined
    }
    formData.value.scaleByDistance = scaleByDistance
    attrChange('scaleByDistance')
  }

  const translucencyByDistanceChange = () => {
    const {
      isTranslucencyByDistance,
      translucencyByDistanceNear,
      translucencyByDistanceNearValue,
      translucencyByDistanceFar,
      translucencyByDistanceFarValue
    } = unref(formData)
    let translucencyByDistance: any
    if (isTranslucencyByDistance) {
      translucencyByDistance = new Cesium.NearFarScalar(
        translucencyByDistanceNear,
        translucencyByDistanceNearValue,
        translucencyByDistanceFar,
        translucencyByDistanceFarValue
      )
    } else {
      translucencyByDistance = undefined
    }
    formData.value.translucencyByDistance = translucencyByDistance
    attrChange('translucencyByDistance')
  }

  const distanceDisplayConditionChange = () => {
    const {
      isDistanceDisplayCondition,
      distanceDisplayConditionNear,
      distanceDisplayConditionFar
    } = unref(formData)
    let distanceDisplayCondition: any
    if (isDistanceDisplayCondition) {
      distanceDisplayCondition = new Cesium.DistanceDisplayCondition(
        distanceDisplayConditionNear,
        distanceDisplayConditionFar
      )
    } else {
      distanceDisplayCondition = undefined
    }
    formData.value.distanceDisplayCondition = distanceDisplayCondition
    attrChange('distanceDisplayCondition')
  }

  const fillMaterialKey = ['fill', 'stRotation', 'rotation']

  const fillMaterialChange = (key: string) => {
    if (fillMaterialKey.includes(key)) {
      attrChange(key)
    } else {
      const data = unref(formData)
      const {
        speed,
        count,
        gradient,
        image,
        color,
        fillImage,
        fillImageRepeatX,
        fillImageRepeatY,
        fillImageTransparent,
        fillGridCellAlpha,
        fillGridLineCountX,
        fillGridLineCountY,
        fillGridLineThicknessX,
        fillGridLineThicknessY,
        fillGridLineOffsetX,
        fillGridLineOffsetY,
        fillStripeOrientation,
        fillStripeEvenColor,
        fillStripeOddColor,
        fillStripeOffset,
        fillStripeRepeat,
        fillCheckerboardEvenColor,
        fillCheckerboardOddColor,
        fillCheckerboardRepeatX,
        fillCheckerboardRepeatY
      } = unref(formData)
      let material: any
      switch (data.fillType) {
        case 'Color':
          material = new Cesium.ColorMaterialProperty(
            Cesium.Color.fromCssColorString(color)
          )
          break
        case 'Image':
          material = new Cesium.ImageMaterialProperty({
            image: fillImage,
            repeat: new Cesium.Cartesian2(fillImageRepeatX, fillImageRepeatY),
            transparent: fillImageTransparent
          })
          break
        case 'Grid':
          material = new Cesium.GridMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            cellAlpha: fillGridCellAlpha,
            lineCount: new Cesium.Cartesian2(
              fillGridLineCountX,
              fillGridLineCountY
            ),
            lineThickness: new Cesium.Cartesian2(
              fillGridLineThicknessX,
              fillGridLineThicknessY
            ),
            lineOffset: new Cesium.Cartesian2(
              fillGridLineOffsetX,
              fillGridLineOffsetY
            )
          })
          break
        case 'Stripe':
          material = new Cesium.StripeMaterialProperty({
            orientation: fillStripeOrientation,
            evenColor: Cesium.Color.fromCssColorString(fillStripeEvenColor),
            oddColor: Cesium.Color.fromCssColorString(fillStripeOddColor),
            offset: fillStripeOffset,
            repeat: fillStripeRepeat
          })
          break
        case 'Checkerboard':
          material = new Cesium.CheckerboardMaterialProperty({
            evenColor: Cesium.Color.fromCssColorString(
              fillCheckerboardEvenColor
            ),
            oddColor: Cesium.Color.fromCssColorString(fillCheckerboardOddColor),
            repeat: new Cesium.Cartesian2(
              fillCheckerboardRepeatX,
              fillCheckerboardRepeatY
            )
          })
          break
        case 'CircleBlur':
          material = new Cesium.CircleBlurMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'CircleDiffuse':
          material = new Cesium.CircleDiffuseMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'CircleFade':
          material = new Cesium.CircleFadeMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'CirclePulse':
          material = new Cesium.CirclePulseMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'CircleScan':
          material = new Cesium.CircleScanMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'CircleSpiral':
          material = new Cesium.CircleSpiralMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'CircleVary':
          material = new Cesium.CircleVaryMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'CircleWave':
          material = new Cesium.CircleWaveMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed,
            count,
            gradient
          })
          break
        case 'EllipsoidElectric':
          material = new Cesium.EllipsoidElectricMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'EllipsoidTrail':
          material = new Cesium.EllipsoidTrailMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'RadarLine':
          material = new Cesium.RadarLineMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'RadarScan':
          material = new Cesium.RadarScanMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'RadarSweep':
          material = new Cesium.RadarSweepMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'RadarWave':
          material = new Cesium.RadarWaveMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed
          })
          break
        case 'WallImageTrail':
          material = new Cesium.WallImageTrailMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed,
            image
          })
          break
        case 'WallLineTrail':
          material = new Cesium.WallLineTrailMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed,
            image
          })
          break
        case 'WallTrail':
          material = new Cesium.WallTrailMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            speed,
            image
          })
          break
      }
      formData.value.material = material
      attrChange('material')
    }
  }

  const heightChange = () => {
    attrChange('height')
    attrChange('extrudedHeight')
    outlineChange()
  }

  const outlineChange = () => {
    const { height, extrudedHeight, outline, outlineWidth, outlineColor } =
      unref(formData)
    const isHeight = !!(height || extrudedHeight)
    const isPolygonOutline = isHeight && outline
    const isPolylineOutline = !isHeight && outline
    attrChange('outline', isPolygonOutline)
    attrChange('outlineWidth', outlineWidth)
    attrChange('outlineColor', outlineColor)
    attrChange('width', outlineWidth, 'polyline')
    attrChange(
      'material',
      new Cesium.ColorMaterialProperty(
        Cesium.Color.fromCssColorString(outlineColor)
      ),
      'polyline'
    )
    attrChange('show', isPolylineOutline, 'polyline')
  }

  const radiusChange = () => {
    const { radius } = unref(formData)
    attrChange('updateRadius', [radius], '@@function')
  }

  const polylineTypeChange = () => {
    const {
      polylineType,
      color,
      dashLength,
      dashPattern,
      outlineColor,
      outlineWidth,
      glowPower,
      taperPower,
      speed,
      image,
      percent,
      gradient
    } = unref(formData)
    let material: any
    switch (polylineType) {
      case 'Color':
        material = new Cesium.ColorMaterialProperty(
          Cesium.Color.fromCssColorString(color)
        )
        break
      case 'PolylineDash':
        material = new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.fromCssColorString(color),
          gapColor: Cesium.Color.TRANSPARENT,
          dashLength,
          dashPattern
        })
        break
      case 'PolylineOutline':
        material = new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.fromCssColorString(color),
          outlineColor: Cesium.Color.fromCssColorString(outlineColor),
          outlineWidth
        })
        break
      case 'PolylineArrow':
        material = new Cesium.PolylineArrowMaterialProperty(
          Cesium.Color.fromCssColorString(color)
        )
        break
      case 'PolylineGlow':
        material = new Cesium.PolylineGlowMaterialProperty({
          color: Cesium.Color.fromCssColorString(color),
          glowPower,
          taperPower
        })
        break
      case 'PolylineFlicker':
        material = new Cesium.PolylineFlickerMaterialProperty({
          color: Cesium.Color.fromCssColorString(color),
          speed
        })
        break
      case 'PolylineFlow':
        material = new Cesium.PolylineFlowMaterialProperty({
          color: Cesium.Color.fromCssColorString(color),
          speed,
          percent,
          gradient
        })
        break
      case 'PolylineImageTrail':
        material = new Cesium.PolylineImageTrailMaterialProperty({
          color: Cesium.Color.fromCssColorString(color),
          speed,
          image
          // repeat
        })
        break
      case 'PolylineLightingTrail':
        material = new Cesium.PolylineLightingTrailMaterialProperty({
          color: Cesium.Color.fromCssColorString(color),
          speed,
          image
        })
        break
      case 'PolylineTrail':
        material = new Cesium.PolylineTrailMaterialProperty({
          color: Cesium.Color.fromCssColorString(color),
          speed
        })
        break
    }
    formData.value.material = material
    attrChange('material')
  }

  const loopChange = () => {
    const { loop } = unref(formData)
    attrChange('updateLoop', [loop], '@@function')
  }

  const positionChange = (
    longitude: number,
    latitude: number,
    height: number
  ) => {
    if (
      longitude === null ||
      longitude === undefined ||
      latitude === null ||
      latitude === undefined ||
      height === null ||
      height === undefined
    )
      return
    const graphicsName = '@@entity'
    const key = 'position'
    const val = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
    emit('updateAttr', graphicsName, key, val)
  }

  const pixelOffsetChange = (name = 'label') => {
    const { pixelOffsetX, pixelOffsetY } = unref(formData)
    attrChange(
      'pixelOffset',
      new Cesium.Cartesian2(pixelOffsetX, pixelOffsetY),
      name
    )
  }

  const backgroundPaddingChange = (name = 'label') => {
    const { backgroundPaddingX, backgroundPaddingY } = unref(formData)
    attrChange(
      'backgroundPadding',
      new Cesium.Cartesian2(backgroundPaddingX, backgroundPaddingY),
      name
    )
  }

  const eyeOffsetChange = (name = 'label') => {
    const { eyeOffsetX, eyeOffsetY, eyeOffsetZ } = unref(formData)
    attrChange(
      'eyeOffset',
      new Cesium.Cartesian3(eyeOffsetX, eyeOffsetY, eyeOffsetZ),
      name
    )
  }

  return {
    pixelOffsetChange,
    backgroundPaddingChange,
    eyeOffsetChange,
    positionChange,
    attrChange,
    scaleByDistanceChange,
    translucencyByDistanceChange,
    distanceDisplayConditionChange,
    fillMaterialKey,
    fillMaterialChange,
    heightChange,
    outlineChange,
    radiusChange,
    polylineTypeChange,
    loopChange
  }
}
