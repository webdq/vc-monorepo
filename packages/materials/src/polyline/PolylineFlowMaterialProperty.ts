import { PolylineFlowType } from '../material-type'
import { setPropertyDescriptor } from '../utils'

const defaultOptions = {
  color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
  speed: 1,
  percent: 0.03,
  gradient: 0.1
}

class PolylineFlowMaterialProperty {
  _definitionChanged: Cesium.Event
  _color?: Cesium.Color
  _speed?: number
  _percent?: number
  _gradient?: number
  _colorSubscription?: Cesium.Event.RemoveCallback
  _speedSubscription?: Cesium.Event.RemoveCallback
  _percentSubscription?: Cesium.Event.RemoveCallback
  _gradientSubscription?: Cesium.Event.RemoveCallback
  constructor(options: Cesium.PolylineFlowOptions = {}) {
    const opt = Object.assign({}, defaultOptions, options)
    this._definitionChanged = new Cesium.Event()
    this.color = opt.color
    this.speed = opt.speed
    this.percent = opt.percent
    this.gradient = opt.gradient
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
  get percent() {
    return this._percent
  }
  set percent(value: any) {
    setPropertyDescriptor(this, 'percent', value)
  }
  get gradient() {
    return this._gradient
  }
  set gradient(value: any) {
    setPropertyDescriptor(this, 'gradient', value)
  }
  getType() {
    return PolylineFlowType
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
      defaultOptions.speed,
      result.speed
    )
    result.percent = Cesium.Property.getValueOrDefault(
      this._percent,
      time,
      defaultOptions.percent,
      result.percent
    )
    result.gradient = Cesium.Property.getValueOrDefault(
      this._gradient,
      time,
      defaultOptions.gradient,
      result.gradient
    )
    return result
  }
  equals(other: any) {
    return (
      this === other ||
      (other instanceof PolylineFlowMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed) &&
        Cesium.Property.equals(this._percent, other._percent) &&
        Cesium.Property.equals(this._gradient, other._gradient))
    )
  }
}

export default PolylineFlowMaterialProperty
