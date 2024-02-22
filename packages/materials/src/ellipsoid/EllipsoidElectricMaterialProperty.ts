import { EllipsoidElectricType } from '../material-type'
import { setPropertyDescriptor } from '../utils'

const defaultOptions = {
  color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
  speed: 1.0
}

class EllipsoidElectricMaterialProperty {
  _definitionChanged: Cesium.Event
  _color?: Cesium.Color
  _speed?: number
  _colorSubscription?: Cesium.Event.RemoveCallback
  _speedSubscription?: Cesium.Event.RemoveCallback
  constructor(options: Cesium.EllipsoidElectricOptions = {}) {
    const opt = Object.assign({}, defaultOptions, options)
    this._definitionChanged = new Cesium.Event()
    this.color = opt.color
    this.speed = opt.speed
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
  getType() {
    return EllipsoidElectricType
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
    return result
  }
  equals(other: any) {
    return (
      this === other ||
      (other instanceof EllipsoidElectricMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed))
    )
  }
}

export default EllipsoidElectricMaterialProperty
