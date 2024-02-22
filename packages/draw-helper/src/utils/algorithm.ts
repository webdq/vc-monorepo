import * as PlotUtils from './PlotUtils'

const arrowDefaultOptions = {
  // 头部高度系数
  headHeightFactor: 0.18,
  // 头部宽度系数
  headWidthFactor: 0.3,
  // 颈部高度系数
  neckHeightFactor: 0.85,
  // 颈部宽度系数
  neckWidthFactor: 0.15,
  // 尾宽宽度系数
  tailWidthFactor: 0.1,
  // 头尾系数
  headTailFactor: 0.8,
  // 燕尾系数
  swallowTailFactor: 1,
  // 头部角度
  headAngle: Math.PI / 8.5,
  // 颈部角度
  neckAngle: Math.PI / 13
}
const fineArrowDefaultOptions = {
  // 尾宽宽度系数
  tailWidthFactor: 0.15,
  // 颈部宽度系数
  neckWidthFactor: 0.2,
  // 头部宽度系数
  headWidthFactor: 0.25,
  // 头部角度
  headAngle: Math.PI / 8.5,
  // 颈部角度
  neckAngle: Math.PI / 13
}
const gatheringPlaceDefaultOptions = {
  fittingCount: 100,
  t: 0.4
}

/**
 * @description: 二维数组转一维数组
 */
export const array2Dto1D = function (array: any[]) {
  const newArray: any[] = []
  array.forEach((el: any) => {
    newArray.push(el[0])
    newArray.push(el[1])
  })
  return newArray
}
/**
 * @description: 去重
 */
export const removeDuplicate = function (array: any[]) {
  if (array.length < 2) return array
  const copy = [...array]
  let prev
  const result = []
  while ((prev = copy.shift())) {
    for (let i = 0; i < copy.length; i++) {
      const current = copy[i]
      if (prev[0] !== current[0] && prev[1] !== current[1]) {
        result.push(prev)
      }
    }
  }
  return result
}
/**
 * @description: 获取箭头点位
 */
export const getArrowPoints = function (
  point1: any,
  point2: any,
  point3: any,
  clockWise: any,
  options: any = {}
) {
  const options2 = Object.assign({}, arrowDefaultOptions, options)
  const midPoint = PlotUtils.mid(point1, point2)
  const dist = PlotUtils.distance(midPoint, point3)
  let midPoint1 = PlotUtils.getThirdPoint(point3, midPoint, 0, dist * 0.3, true)
  let midPoint2 = PlotUtils.getThirdPoint(point3, midPoint, 0, dist * 0.5, true)
  midPoint1 = PlotUtils.getThirdPoint(
    midPoint,
    midPoint1,
    PlotUtils.Constants.HALF_PI,
    dist / 5,
    clockWise
  )
  midPoint2 = PlotUtils.getThirdPoint(
    midPoint,
    midPoint2,
    PlotUtils.Constants.HALF_PI,
    dist / 4,
    clockWise
  )
  const points = [midPoint, midPoint1, midPoint2, point3]
  // 计算箭头部分
  const arrowPoints = getArrowHeadPoints(points, undefined, undefined, options2)
  const neckLeftPoint = arrowPoints[0]
  const neckRightPoint = arrowPoints[4]
  // 计算箭身部分
  const tailWidthFactor =
    PlotUtils.distance(point1, point2) / PlotUtils.getBaseLength(points) / 2
  const bodyPoints = getArrowBodyPoints(
    points,
    neckLeftPoint,
    neckRightPoint,
    tailWidthFactor
  )
  const count = bodyPoints.length
  let leftPoints = bodyPoints.slice(0, count / 2)
  let rightPoints = bodyPoints.slice(count / 2, count)
  leftPoints.push(neckLeftPoint)
  rightPoints.push(neckRightPoint)
  leftPoints = leftPoints.reverse()
  leftPoints.push(point2)
  rightPoints = rightPoints.reverse()
  rightPoints.push(point1)
  return leftPoints.reverse().concat(arrowPoints, rightPoints)
}
/**
 * @description: 获取箭头点位
 */
export const getTempPoint4 = function (
  linePnt1: any,
  linePnt2: any,
  point: any
) {
  const midPnt = PlotUtils.mid(linePnt1, linePnt2)
  const len = PlotUtils.distance(midPnt, point)
  const angle = PlotUtils.getAngleOfThreePoints(linePnt1, midPnt, point)
  let symPnt, distance1, distance2, mid
  if (angle < PlotUtils.Constants.HALF_PI) {
    distance1 = len * Math.sin(angle)
    distance2 = len * Math.cos(angle)
    mid = PlotUtils.getThirdPoint(
      linePnt1,
      midPnt,
      PlotUtils.Constants.HALF_PI,
      distance1,
      false
    )
    symPnt = PlotUtils.getThirdPoint(
      midPnt,
      mid,
      PlotUtils.Constants.HALF_PI,
      distance2,
      true
    )
  } else if (angle >= PlotUtils.Constants.HALF_PI && angle < Math.PI) {
    distance1 = len * Math.sin(Math.PI - angle)
    distance2 = len * Math.cos(Math.PI - angle)
    mid = PlotUtils.getThirdPoint(
      linePnt1,
      midPnt,
      PlotUtils.Constants.HALF_PI,
      distance1,
      false
    )
    symPnt = PlotUtils.getThirdPoint(
      midPnt,
      mid,
      PlotUtils.Constants.HALF_PI,
      distance2,
      false
    )
  } else if (angle >= Math.PI && angle < Math.PI * 1.5) {
    distance1 = len * Math.sin(angle - Math.PI)
    distance2 = len * Math.cos(angle - Math.PI)
    mid = PlotUtils.getThirdPoint(
      linePnt1,
      midPnt,
      PlotUtils.Constants.HALF_PI,
      distance1,
      true
    )
    symPnt = PlotUtils.getThirdPoint(
      midPnt,
      mid,
      PlotUtils.Constants.HALF_PI,
      distance2,
      true
    )
  } else {
    distance1 = len * Math.sin(Math.PI * 2 - angle)
    distance2 = len * Math.cos(Math.PI * 2 - angle)
    mid = PlotUtils.getThirdPoint(
      linePnt1,
      midPnt,
      PlotUtils.Constants.HALF_PI,
      distance1,
      true
    )
    symPnt = PlotUtils.getThirdPoint(
      midPnt,
      mid,
      PlotUtils.Constants.HALF_PI,
      distance2,
      false
    )
  }
  return symPnt
}
/**
 * @description: 获取箭头的头部点位
 */
export const getArrowHeadPoints = function (
  points: any[],
  tailLeft?: any,
  tailRight?: any,
  options: any = {}
) {
  const {
    headTailFactor,
    headHeightFactor,
    headWidthFactor,
    neckHeightFactor,
    neckWidthFactor
  } = Object.assign({}, arrowDefaultOptions, options)

  let len = PlotUtils.getBaseLength(points)
  let headHeight = len * headHeightFactor
  const headPoint = points[points.length - 1]
  if (tailLeft && tailRight) {
    len = PlotUtils.distance(headPoint, points[points.length - 2])
    const tailWidth = PlotUtils.distance(tailLeft, tailRight)
    if (headHeight > tailWidth * headTailFactor) {
      headHeight = tailWidth * headTailFactor
    }
  }
  const headWidth = headHeight * headWidthFactor
  const neckWidth = headHeight * neckWidthFactor
  headHeight = headHeight > len ? len : headHeight
  const neckHeight = headHeight * neckHeightFactor

  const headEndPnt = PlotUtils.getThirdPoint(
    points[points.length - 2],
    headPoint,
    0,
    headHeight,
    true
  )
  const neckEndPnt = PlotUtils.getThirdPoint(
    points[points.length - 2],
    headPoint,
    0,
    neckHeight,
    true
  )
  const headLeft = PlotUtils.getThirdPoint(
    headPoint,
    headEndPnt,
    PlotUtils.Constants.HALF_PI,
    headWidth,
    false
  )
  const headRight = PlotUtils.getThirdPoint(
    headPoint,
    headEndPnt,
    PlotUtils.Constants.HALF_PI,
    headWidth,
    true
  )
  const neckLeft = PlotUtils.getThirdPoint(
    headPoint,
    neckEndPnt,
    PlotUtils.Constants.HALF_PI,
    neckWidth,
    false
  )
  const neckRight = PlotUtils.getThirdPoint(
    headPoint,
    neckEndPnt,
    PlotUtils.Constants.HALF_PI,
    neckWidth,
    true
  )
  return [neckLeft, headLeft, headPoint, headRight, neckRight]
}
/**
 * @description: 获取箭体的体点位
 */
export const getArrowBodyPoints = function (
  points: any[],
  neckLeft: any,
  neckRight: any,
  tailWidthFactor: any
) {
  const allLen = PlotUtils.wholeDistance(points)
  const len = PlotUtils.getBaseLength(points)
  const tailWidth = len * tailWidthFactor
  const neckWidth = PlotUtils.distance(neckLeft, neckRight)
  const widthDif = (tailWidth - neckWidth) / 2
  const leftBodyPnts = []
  const rightBodyPnts = []
  let n = 0
  for (let i = 1; i < points.length - 1; i++) {
    const angle =
      PlotUtils.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) /
      2
    n += PlotUtils.distance(points[i - 1], points[i])
    const w = (tailWidth / 2 - (n / allLen) * widthDif) / Math.sin(angle)
    const left = PlotUtils.getThirdPoint(
      points[i - 1],
      points[i],
      Math.PI - angle,
      w,
      true
    )
    const right = PlotUtils.getThirdPoint(
      points[i - 1],
      points[i],
      angle,
      w,
      false
    )
    leftBodyPnts.push(left)
    rightBodyPnts.push(right)
  }
  return leftBodyPnts.concat(rightBodyPnts)
}
/**
 * @description: 直箭头
 */
export const fineArrow = function (
  tailPoint: any,
  headerPoint: any,
  options: any = {}
) {
  if (tailPoint.length < 2 || headerPoint.length < 2) return []
  const {
    tailWidthFactor,
    neckWidthFactor,
    headWidthFactor,
    headAngle,
    neckAngle
  } = Object.assign({}, fineArrowDefaultOptions, options)
  const points = [tailPoint, headerPoint]
  const point1 = points[0]
  const point2 = points[1]
  const n = PlotUtils.getBaseLength(points)
  const tailWidth = n * tailWidthFactor
  const neckWidth = n * neckWidthFactor
  const headWidth = n * headWidthFactor
  // 尾部左侧
  const tailLeft = PlotUtils.getThirdPoint(
    point2,
    point1,
    PlotUtils.Constants.HALF_PI,
    tailWidth,
    true
  )
  // 尾部右侧
  const tailRight = PlotUtils.getThirdPoint(
    point2,
    point1,
    PlotUtils.Constants.HALF_PI,
    tailWidth,
    false
  )
  // 头部左侧
  const headLeft = PlotUtils.getThirdPoint(
    point1,
    point2,
    headAngle,
    headWidth,
    false
  )
  // 头部右侧
  const headRight = PlotUtils.getThirdPoint(
    point1,
    point2,
    headAngle,
    headWidth,
    true
  )
  // 颈部左侧
  const neckLeft = PlotUtils.getThirdPoint(
    point1,
    point2,
    neckAngle,
    neckWidth,
    false
  )
  // 颈部右侧
  const neckRight = PlotUtils.getThirdPoint(
    point1,
    point2,
    neckAngle,
    neckWidth,
    true
  )
  const positions = [
    tailLeft,
    neckLeft,
    headLeft,
    point2,
    headRight,
    neckRight,
    tailRight
  ]
  const result = array2Dto1D(positions).filter((item) => Number.isFinite(item))
  return result
}
/**
 * @description: 攻击箭头
 */
export const attackArrow = function (points: any[], options: any = {}) {
  if (points.length < 3) return []
  const options2 = Object.assign({}, arrowDefaultOptions, options)
  // 是否是顺时针
  const isClockWise = PlotUtils.isClockWise(points[0], points[1], points[2])
  // 尾部左侧点
  const tailLeft = isClockWise ? points[1] : points[0]
  // 尾部右侧点
  const tailRight = isClockWise ? points[0] : points[1]
  // 尾部中间点
  const midTail = PlotUtils.mid(tailLeft, tailRight)
  // 骨架的点
  const bonePnts = [midTail].concat(points.slice(2))
  // 计算箭头部分
  const headPoints = getArrowHeadPoints(bonePnts, tailLeft, tailRight, options2)
  // 颈部左侧点
  const neckLeft = headPoints[0]
  // 颈部右侧点
  const neckRight = headPoints[4]
  const tailWidthFactor =
    PlotUtils.distance(tailLeft, tailRight) / PlotUtils.getBaseLength(bonePnts)
  // 计算箭身部分
  const bodyPoints = getArrowBodyPoints(
    bonePnts,
    neckLeft,
    neckRight,
    tailWidthFactor
  )
  // 整合
  const count = bodyPoints.length
  // 左半边的点
  let leftPoints = [tailLeft].concat(bodyPoints.slice(0, count / 2))
  leftPoints.push(neckLeft)
  // 右半边的点
  let rightPoints = [tailRight].concat(bodyPoints.slice(count / 2, count))
  rightPoints.push(neckRight)
  leftPoints = PlotUtils.getQBSplinePoints(leftPoints)
  rightPoints = PlotUtils.getQBSplinePoints(rightPoints)

  const positions = leftPoints.concat(
    headPoints.slice(1, 4),
    rightPoints.reverse()
  )
  const result = array2Dto1D(positions).filter((item) => Number.isFinite(item))
  return result
}
/**
 * @description: 燕尾箭头
 */
export const tailedAttackArrow = function (points: any[], options: any = {}) {
  if (points.length < 3) return []
  const options2 = Object.assign({}, arrowDefaultOptions, options)
  const { tailWidthFactor, swallowTailFactor } = options2
  // 是否是顺时针
  const isClockWise = PlotUtils.isClockWise(points[0], points[1], points[2])
  // 尾部左侧点
  const tailLeft = isClockWise ? points[1] : points[0]
  // 尾部右侧点
  const tailRight = isClockWise ? points[0] : points[1]
  // 尾部中间点
  const midTail = PlotUtils.mid(tailLeft, tailRight)
  // 骨架的点
  const bonePnts = [midTail].concat(points.slice(2))
  // 计算箭头部分
  const headPnts = getArrowHeadPoints(bonePnts, tailLeft, tailRight, options2)
  // 颈部左侧点
  const neckLeft = headPnts[0]
  // 颈部右侧点
  const neckRight = headPnts[4]
  const tailWidth = PlotUtils.distance(tailLeft, tailRight)
  const allLen = PlotUtils.getBaseLength(bonePnts)
  const len = allLen * tailWidthFactor * swallowTailFactor
  // 燕尾的点
  const swallowTailPnt = PlotUtils.getThirdPoint(
    bonePnts[1],
    bonePnts[0],
    0,
    len,
    true
  )
  const factor = tailWidth / allLen
  // 计算箭身部分
  const bodyPnts = getArrowBodyPoints(bonePnts, neckLeft, neckRight, factor)
  const count = bodyPnts.length
  // 左半边的点
  let leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2))
  leftPnts.push(neckLeft)
  // 右半边的点
  let rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count))
  rightPnts.push(neckRight)
  leftPnts = PlotUtils.getQBSplinePoints(leftPnts)
  rightPnts = PlotUtils.getQBSplinePoints(rightPnts)
  const positions = leftPnts.concat(headPnts.slice(1, 4), rightPnts.reverse(), [
    swallowTailPnt
  ])
  const result = array2Dto1D(positions).filter((item) => Number.isFinite(item))
  return result
}
/**
 * @description: 双箭头
 */
export const doubleArrow = function (points: any[], options: any = {}) {
  if (points.length < 3) return []
  const options2 = Object.assign({}, arrowDefaultOptions, options)
  let tempPoint4 = undefined
  let connPoint = undefined
  const count = points.length
  const pnts = points
  const pnt1 = pnts[0]
  const pnt2 = pnts[1]
  const pnt3 = pnts[2]
  if (count === 3) tempPoint4 = getTempPoint4(pnt1, pnt2, pnt3)
  else tempPoint4 = pnts[3]
  if (count === 3 || count === 4) connPoint = PlotUtils.mid(pnt1, pnt2)
  else connPoint = pnts[4]
  let leftArrowPnts, rightArrowPnts
  if (PlotUtils.isClockWise(pnt1, pnt2, pnt3)) {
    leftArrowPnts = getArrowPoints(pnt1, connPoint, tempPoint4, false, options2)
    rightArrowPnts = getArrowPoints(connPoint, pnt2, pnt3, true, options2)
  } else {
    leftArrowPnts = getArrowPoints(pnt2, connPoint, pnt3, false, options2)
    rightArrowPnts = getArrowPoints(connPoint, pnt1, tempPoint4, true, options2)
  }
  const m = leftArrowPnts.length
  const t = (m - 5) / 2
  const llBodyPnts = leftArrowPnts.slice(0, t)
  const lArrowPnts = leftArrowPnts.slice(t, t + 5)
  let lrBodyPnts = leftArrowPnts.slice(t + 5, m)
  let rlBodyPnts = rightArrowPnts.slice(0, t)
  const rArrowPnts = rightArrowPnts.slice(t, t + 5)
  const rrBodyPnts = rightArrowPnts.slice(t + 5, m)
  rlBodyPnts = PlotUtils.getBezierPoints(rlBodyPnts)
  const bodyPnts = PlotUtils.getBezierPoints(
    rrBodyPnts.concat(llBodyPnts.slice(1))
  )
  lrBodyPnts = PlotUtils.getBezierPoints(lrBodyPnts)
  const positions = rlBodyPnts.concat(
    rArrowPnts.slice(1, 4),
    bodyPnts,
    lArrowPnts.slice(1, 4),
    lrBodyPnts
  )
  const result = array2Dto1D(positions).filter((item) => Number.isFinite(item))
  return result
}
/**
 * @description: 集结地
 */
export const gatheringPlace = function (points: any[], options: any = {}) {
  if (points.length < 2) return []
  const { t, fittingCount } = Object.assign(
    {},
    gatheringPlaceDefaultOptions,
    options
  )
  let pnts = [...points]
  if (pnts.length === 2) {
    const mid = PlotUtils.mid(pnts[0], pnts[1])
    const d = PlotUtils.distance(pnts[0], mid) / 0.9
    const pnt = PlotUtils.getThirdPoint(
      pnts[0],
      mid,
      PlotUtils.Constants.HALF_PI,
      d,
      true
    )
    pnts = [pnts[0], pnt, pnts[1]]
  }
  const mid = PlotUtils.mid(pnts[0], pnts[2])
  pnts.push(mid, pnts[0], pnts[1])
  let normals: any[] = []
  for (let i = 0; i < pnts.length - 2; i++) {
    const pnt1 = pnts[i]
    const pnt2 = pnts[i + 1]
    const pnt3 = pnts[i + 2]
    const normalPoints = PlotUtils.getBisectorNormals(t, pnt1, pnt2, pnt3)
    normals = normals.concat(normalPoints)
  }
  const count = normals.length
  normals = [normals[count - 1]].concat(normals.slice(0, count - 1))
  const positions = []
  for (let i = 0; i < pnts.length - 2; i++) {
    const pnt1 = pnts[i]
    const pnt2 = pnts[i + 1]
    positions.push(pnt1)
    for (let j = 0; j <= fittingCount; j++) {
      const pnt = PlotUtils.getCubicValue(
        j / fittingCount,
        pnt1,
        normals[i * 2],
        normals[i * 2 + 1],
        pnt2
      )
      positions.push(pnt)
    }
    positions.push(pnt2)
  }
  const result = array2Dto1D(positions).filter((item) => Number.isFinite(item))
  return result
}
