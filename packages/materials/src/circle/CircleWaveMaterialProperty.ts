import { CircleWaveType } from '../material-type'
import { setPropertyDescriptor } from '../utils'

const defaultOptions = {
  color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
  speed: 3.0,
  count: 1,
  gradient: 0.1
}

class CircleWaveMaterialProperty {
  _definitionChanged: Cesium.Event
  _color?: Cesium.Color
  _speed?: number
  _count?: number
  _gradient?: number
  _colorSubscription?: Cesium.Event.RemoveCallback
  _speedSubscription?: Cesium.Event.RemoveCallback
  _countSubscription?: Cesium.Event.RemoveCallback
  _gradientSubscription?: Cesium.Event.RemoveCallback
  constructor(options: Cesium.CircleWaveOptions = {}) {
    const opt = Object.assign({}, defaultOptions, options)
    this._definitionChanged = new Cesium.Event()
    this.color = opt.color
    this.speed = opt.speed
    this.count = Math.max(opt.count || 3, 1)
    this.gradient = Cesium.Math.clamp(opt.gradient || 0.1, 0, 1)
  }
  get isConstant() {
    return false
  }
  get definitionChanged() {
    return this._definitionChanged
  }
  get color() {
    return this._color
  }
  set color(value: any) {
    setPropertyDescriptor(this, 'color', value)
  }
  get speed() {
    return this._speed
  }
  set speed(value: any) {
    setPropertyDescriptor(this, 'speed', value)
  }
  get count() {
    return this._count
  }
  set count(value: any) {
    setPropertyDescriptor(this, 'count', value)
  }
  get gradient() {
    return this._gradient
  }
  set gradient(value: any) {
    setPropertyDescriptor(this, 'gradient', value)
  }
  getType() {
    return CircleWaveType
  }
  getValue(time: Cesium.JulianDate, result?: any) {
    result = Cesium.defaultValue(result, {})
    result.color = Cesium.Property.getValueOrClonedDefault(
      this._color,
      time,
      defaultOptions.color,
      result.color
    )
    result.speed = Cesium.Property.getValueOrDefault(
      this._speed,
      time,
      defaultOptions.speed
    )
    result.count = Cesium.Property.getValueOrDefault(
      this._count,
      time,
      defaultOptions.count
    )
    result.gradient = Cesium.Property.getValueOrDefault(
      this._gradient,
      time,
      defaultOptions.gradient
    )
    return result
  }
  equals(other: any) {
    return (
      this === other ||
      (other instanceof CircleWaveMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed) &&
        Cesium.Property.equals(this._count, other._count) &&
        Cesium.Property.equals(this._gradient, other._gradient))
    )
  }
}

export default CircleWaveMaterialProperty
