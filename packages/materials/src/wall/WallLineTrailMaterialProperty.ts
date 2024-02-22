import { WallLineTrailType } from '../material-type'
import { setPropertyDescriptor } from '../utils'

const defaultOptions = {
  color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
  speed: 3.0,
  image: '',
  repeat: new Cesium.Cartesian2(1, 1)
}

class WallLineTrailMaterialProperty {
  _definitionChanged: Cesium.Event
  _color?: Cesium.Color
  _speed?: number
  _image?: string
  _repeat?: Cesium.Cartesian2
  _colorSubscription?: Cesium.Event.RemoveCallback
  _speedSubscription?: Cesium.Event.RemoveCallback
  _imageSubscription?: Cesium.Event.RemoveCallback
  _repeatSubscription?: Cesium.Event.RemoveCallback
  constructor(options: Cesium.WallLineTrailOptions = {}) {
    const opt = Object.assign({}, defaultOptions, options)
    this._definitionChanged = new Cesium.Event()
    this.color = opt.color
    this.speed = opt.speed
    this.image = opt.image
    const { x = 1, y = 1 } = opt.repeat || { x: 1, y: 1 }
    this.repeat = new Cesium.Cartesian2(x, y)
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
  get image() {
    return this._image
  }
  set image(value: any) {
    setPropertyDescriptor(this, 'image', value)
  }
  get repeat() {
    return this._repeat
  }
  set repeat(value: any) {
    setPropertyDescriptor(this, 'repeat', value)
  }
  getType() {
    return WallLineTrailType
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
    result.image = Cesium.Property.getValueOrDefault(
      this._image,
      time,
      defaultOptions.image,
      result.image
    )
    result.repeat = Cesium.Property.getValueOrClonedDefault(
      this._repeat,
      time,
      defaultOptions.repeat,
      result.repeat
    )
    return result
  }
  equals(other: any) {
    return (
      this === other ||
      (other instanceof WallLineTrailMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._image, other._image) &&
        Cesium.Property.equals(this._repeat, other._repeat) &&
        Cesium.Property.equals(this._speed, other._speed))
    )
  }
}

export default WallLineTrailMaterialProperty
