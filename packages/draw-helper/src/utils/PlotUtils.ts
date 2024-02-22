export const Constants = {
  TWO_PI: Math.PI * 2,
  HALF_PI: Math.PI / 2,
  FITTING_COUNT: 100,
  ZERO_TOLERANCE: 0.0001
}
/**
 * @description: 计算两个坐标之间的距离
 */
export const distance = function (point1: any[], point2: any[]) {
  return Math.sqrt(
    Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
  )
}
/**
 * 计算点集合的总距离
 */
export const wholeDistance = function (points: any[]) {
  let o = 0
  for (let i = 0; i < points.length - 1; i++)
    o += distance(points[i], points[i + 1])
  return o
}
/**
 * @description: 获取基础长度
 */
export const getBaseLength = function (points: any[]) {
  return Math.pow(wholeDistance(points), 0.99)
}
/**
 * @description: 求取两个坐标的中间值
 */
export const mid = function (point1: any[], point2: any[]) {
  return [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2]
}
/**
 * @description: 通过三个点确定一个圆的中心点
 */
export const getCircleCenterOfThreePoints = function (
  point1: any[],
  point2: any[],
  point3: any[]
) {
  const a = [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2],
    b = [a[0] - point1[1] + point2[1], a[1] + point1[0] - point2[0]],
    c = [(point1[0] + point3[0]) / 2, (point1[1] + point3[1]) / 2],
    d = [c[0] - point1[1] + point3[1], c[1] + point1[0] - point3[0]]
  return getIntersectPoint(a, b, c, d)
}
/**
 * @description: 获取交集的点
 */
export const getIntersectPoint = function (
  point1: any[],
  point2: any[],
  point3: any[],
  point4: any[]
) {
  if (point1[1] === point2[1]) {
    const f = (point4[0] - point3[0]) / (point4[1] - point3[1])
    const x = f * (point1[1] - point3[1]) + point3[0]
    const y = point1[1]
    return [x, y]
  }
  if (point3[1] === point4[1]) {
    const e = (point2[0] - point1[0]) / (point2[1] - point1[1])
    const x = e * (point3[1] - point1[1]) + point1[0]
    const y = point3[1]
    return [x, y]
  }
  const e = (point2[0] - point1[0]) / (point2[1] - point1[1])
  const f = (point4[0] - point3[0]) / (point4[1] - point3[1])
  const y = (e * point1[1] - point1[0] - f * point3[1] + point3[0]) / (e - f)
  const x = e * y - e * point1[1] + point1[0]
  return [x, y]
}
/**
 * @description: 获取方位角（地平经度）
 */
export const getAzimuth = function (startPoint: any[], endPoint: any[]) {
  let azimuth = 0
  const len = Math.abs(endPoint[1] - startPoint[1])
  const dist = distance(startPoint, endPoint)
  const val = len === 0 ? 0 : len / dist
  const angle = Math.asin(val)
  // const angle = Math.asin(
  //   Math.abs(endPoint[1] - startPoint[1]) / distance(startPoint, endPoint)
  // )
  if (endPoint[1] >= startPoint[1] && endPoint[0] >= startPoint[0]) {
    azimuth = angle + Math.PI
  } else if (endPoint[1] >= startPoint[1] && endPoint[0] < startPoint[0]) {
    azimuth = Math.PI * 2 - angle
  } else if (endPoint[1] < startPoint[1] && endPoint[0] < startPoint[0]) {
    azimuth = angle
  } else if (endPoint[1] < startPoint[1] && endPoint[0] >= startPoint[0]) {
    azimuth = Math.PI - angle
  }
  return azimuth
}
/**
 * @description: 通过三个点获取方位角
 */
export const getAngleOfThreePoints = function (
  point1: any[],
  point2: any[],
  point3: any[]
) {
  const r = getAzimuth(point2, point1) - getAzimuth(point2, point3)
  return r < 0 ? r + Math.PI * 2 : r
}
/**
 * @description: 判断是否是顺时针
 */
export const isClockWise = function (
  point1: any[],
  point2: any[],
  point3: any[]
) {
  return (
    (point3[1] - point1[1]) * (point2[0] - point1[0]) >
    (point2[1] - point1[1]) * (point3[0] - point1[0])
  )
}
/**
 * @description: 获取立方值
 */
export const getCubicValue = function (
  t: any,
  startPoint: any[],
  point1: any[],
  point2: any[],
  endPoint: any[]
) {
  t = Math.max(Math.min(t, 1), 0)
  const g = 1 - t,
    i = t * t,
    s = i * t,
    a = g * g,
    l = a * g,
    x =
      l * startPoint[0] +
      3 * a * t * point1[0] +
      3 * g * i * point2[0] +
      s * endPoint[0],
    y =
      l * startPoint[1] +
      3 * a * t * point1[1] +
      3 * g * i * point2[1] +
      s * endPoint[1]
  return [x, y]
}
/**
 * @description: 根据起止点和旋转方向求取第三个点
 */
export const getThirdPoint = function (
  startPoint: any[],
  endPoint: any[],
  angle: any,
  distance: any,
  clockWise: any
) {
  const azimuth = getAzimuth(startPoint, endPoint),
    alpha = clockWise ? azimuth + angle : azimuth - angle,
    dx = distance * Math.cos(alpha),
    dy = distance * Math.sin(alpha)
  return [endPoint[0] + dx, endPoint[1] + dy]
}
/**
 * @description: 插值弓形线段点
 */
export const getArcPoints = function (
  center: any[],
  radius: any,
  startAngle: any,
  endAngle: any
) {
  let angleDiff = endAngle - startAngle
  angleDiff = angleDiff < 0 ? angleDiff + Math.PI * 2 : angleDiff
  const points = []
  for (let i = 0; i < Constants.FITTING_COUNT; i++) {
    const angle = startAngle + (angleDiff * i) / Constants.FITTING_COUNT
    const x = center[0] + radius * Math.cos(angle)
    const y = center[1] + radius * Math.sin(angle)
    points.push([x, y])
  }
  return points
}
/**
 * @description: getBisectorNormals
 */
export const getBisectorNormals = function (
  t: any,
  point1: any[],
  point2: any[],
  point3: any[]
) {
  const normal = getNormal(point1, point2, point3)
  const dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
  const uX = normal[0] / dist
  const uY = normal[1] / dist
  const d1 = distance(point1, point2)
  const d2 = distance(point2, point3)
  let bisectorNormalRight, bisectorNormalLeft, dt, x, y
  if (dist > Constants.ZERO_TOLERANCE) {
    if (isClockWise(point1, point2, point3)) {
      dt = t * d1
      x = point2[0] - dt * uY
      y = point2[1] + dt * uX
      bisectorNormalRight = [x, y]
      dt = t * d2
      x = point2[0] + dt * uY
      y = point2[1] - dt * uX
      bisectorNormalLeft = [x, y]
    } else {
      dt = t * d1
      x = point2[0] + dt * uY
      y = point2[1] - dt * uX
      bisectorNormalRight = [x, y]
      dt = t * d2
      x = point2[0] - dt * uY
      y = point2[1] + dt * uX
      bisectorNormalLeft = [x, y]
    }
  } else {
    x = point2[0] + t * (point1[0] - point2[0])
    y = point2[1] + t * (point1[1] - point2[1])
    bisectorNormalRight = [x, y]
    x = point2[0] + t * (point3[0] - point2[0])
    y = point2[1] + t * (point3[1] - point2[1])
    bisectorNormalLeft = [x, y]
  }
  return [bisectorNormalRight, bisectorNormalLeft]
}
/**
 * @description: 获取默认三点的内切圆
 */
export const getNormal = function (
  point1: any[],
  point2: any[],
  point3: any[]
) {
  let dX1 = point1[0] - point2[0]
  let dY1 = point1[1] - point2[1]
  const d1 = Math.sqrt(dX1 * dX1 + dY1 * dY1)
  dX1 /= d1
  dY1 /= d1
  let dX2 = point3[0] - point2[0]
  let dY2 = point3[1] - point2[1]
  const d2 = Math.sqrt(dX2 * dX2 + dY2 * dY2)
  dX2 /= d2
  dY2 /= d2
  const x = dX1 + dX2
  const y = dY1 + dY2
  return [x, y]
}
/**
 * @description: 获取左边控制点
 */
export const getLeftMostControlPoint = function (controlPoints: any[], t: any) {
  let controlX, controlY
  const point1 = controlPoints[0]
  const point2 = controlPoints[1]
  const point3 = controlPoints[2]
  const points = getBisectorNormals(0, point1, point2, point3)
  const normalRight = points[0]
  const normal = getNormal(point1, point2, point3)
  const dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
  if (dist > Constants.ZERO_TOLERANCE) {
    const midPoint = mid(point1, point2)
    const pX = point1[0] - midPoint[0]
    const pY = point1[1] - midPoint[1]
    const d1 = distance(point1, point2)
    const n = 2 / d1
    const nX = -n * pY
    const nY = n * pX
    const a11 = nX * nX - nY * nY
    const a12 = 2 * nX * nY
    const a22 = nY * nY - nX * nX
    const dX = normalRight[0] - midPoint[0]
    const dY = normalRight[1] - midPoint[1]
    controlX = midPoint[0] + a11 * dX + a12 * dY
    controlY = midPoint[1] + a12 * dX + a22 * dY
  } else {
    controlX = point1[0] + t * (point2[0] - point1[0])
    controlY = point1[1] + t * (point2[1] - point1[1])
  }
  return [controlX, controlY]
}
/**
 * @description: 获取右边控制点
 */
export const getRightMostControlPoint = function (
  controlPoints: any[],
  t: any
) {
  let controlX, controlY
  const count = controlPoints.length
  const point1 = controlPoints[count - 3]
  const point2 = controlPoints[count - 2]
  const point3 = controlPoints[count - 1]
  const points = getBisectorNormals(0, point1, point2, point3)
  const normalLeft = points[1]
  const normal = getNormal(point1, point2, point3)
  const dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
  if (dist > Constants.ZERO_TOLERANCE) {
    const midPoint = mid(point2, point3)
    const pX = point3[0] - midPoint[0]
    const pY = point3[1] - midPoint[1]
    const d1 = distance(point2, point3)
    const n = 2.0 / d1
    const nX = -n * pY
    const nY = n * pX
    const a11 = nX * nX - nY * nY
    const a12 = 2 * nX * nY
    const a22 = nY * nY - nX * nX
    const dX = normalLeft[0] - midPoint[0]
    const dY = normalLeft[1] - midPoint[1]
    controlX = midPoint[0] + a11 * dX + a12 * dY
    controlY = midPoint[1] + a12 * dX + a22 * dY
  } else {
    controlX = point3[0] + t * (point2[0] - point3[0])
    controlY = point3[1] + t * (point2[1] - point3[1])
  }
  return [controlX, controlY]
}
/**
 * @description: 插值曲线点
 */
export const getCurvePoints = function (t: any, controlPoints: any[]) {
  const leftControl = getLeftMostControlPoint(controlPoints, t)
  let point1, point2, point3
  let normals = [leftControl]
  const points = []
  for (let i = 0; i < controlPoints.length - 2; i++) {
    point1 = controlPoints[i]
    point2 = controlPoints[i + 1]
    point3 = controlPoints[i + 2]
    const normalPoints = getBisectorNormals(t, point1, point2, point3)
    normals = normals.concat(normalPoints)
  }
  const rightControl = getRightMostControlPoint(controlPoints, t)
  if (rightControl) {
    normals.push(rightControl)
  }
  for (let i = 0; i < controlPoints.length - 1; i++) {
    point1 = controlPoints[i]
    point2 = controlPoints[i + 1]
    points.push(point1)
    for (let t = 0; t < Constants.FITTING_COUNT; t++) {
      const pnt = getCubicValue(
        t / Constants.FITTING_COUNT,
        point1,
        normals[i * 2],
        normals[i * 2 + 1],
        point2
      )
      points.push(pnt)
    }
    points.push(point2)
  }
  return points
}
/**
 * @description: 贝塞尔曲线
 */
export const getBezierPoints = function (points: any[]) {
  if (points.length <= 2) return points
  const bezierPoints = []
  const n = points.length - 1
  for (let t = 0; t <= 1; t += 0.01) {
    let x = 0
    let y = 0
    for (let index = 0; index <= n; index++) {
      const factor = getBinomialFactor(n, index)
      const a = Math.pow(t, index)
      const b = Math.pow(1 - t, n - index)
      x += factor * a * b * points[index][0]
      y += factor * a * b * points[index][1]
    }
    bezierPoints.push([x, y])
  }
  bezierPoints.push(points[n])
  return bezierPoints
}
/**
 * @description: 获取阶乘数据
 */
export const getFactorial = function (n: any) {
  if (n <= 1) return 1
  if (n === 2) return 2
  if (n === 3) return 6
  if (n === 4) return 24
  if (n === 5) return 120
  let result = 1
  for (let i = 1; i <= n; i++) result *= i
  return result
}
/**
 * @description: 获取二项分布
 */
export const getBinomialFactor = function (n: any, o: any) {
  return getFactorial(n) / (getFactorial(o) * getFactorial(n - o))
}
/**
 * @description: 插值线性点
 */
export const getQBSplinePoints = function (points: any[]) {
  if (points.length <= 2) return points
  const n = 2
  const bSplinePoints = []
  const m = points.length - n - 1
  bSplinePoints.push(points[0])
  for (let i = 0; i <= m; i++)
    for (let t = 0; t <= 1; t += 0.05) {
      let x = 0
      let y = 0
      for (let k = 0; k <= n; k++) {
        const factor = getQuadricBSplineFactor(k, t)
        x += factor * points[i + k][0]
        y += factor * points[i + k][1]
      }
      bSplinePoints.push([x, y])
    }
  bSplinePoints.push(points[points.length - 1])
  return bSplinePoints
}
/**
 * @description: 得到二次线性因子
 */
export const getQuadricBSplineFactor = (k: any, t: any) => {
  let res = 0
  if (k === 0) {
    res = Math.pow(t - 1, 2) / 2
  } else if (k === 1) {
    res = (-2 * Math.pow(t, 2) + 2 * t + 1) / 2
  } else if (k === 2) {
    res = Math.pow(t, 2) / 2
  }
  return res
}
