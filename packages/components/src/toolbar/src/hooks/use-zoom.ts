import type { VcViewerProvider } from 'vue-cesium/es/utils/types'
import type { ToolbarProps } from '../toolbar'

export const useZoom = (props: ToolbarProps, $vc: VcViewerProvider) => {
  // 点击放大按钮
  const zoomInClick = (e: MouseEvent) => {
    zoom(1 / props.zoomAmount, e)
  }
  // 点击缩小按钮
  const zoomOutClick = (e: MouseEvent) => {
    zoom(props.zoomAmount, e)
  }
  // 缩放
  const zoom = (relativeAmount: number, e: MouseEvent) => {
    if ($vc.viewer) {
      const scene = $vc.viewer.scene
      const sscc = scene.screenSpaceCameraController
      // do not zoom if it is disabled
      if (!sscc.enableInputs || !sscc.enableZoom) {
        return
      }
      // TODO
      if (
        scene.mode === Cesium.SceneMode.COLUMBUS_VIEW &&
        !sscc.enableTranslate
      ) {
        return
      }

      const camera = scene.camera
      let orientation: any

      switch (scene.mode) {
        case Cesium.SceneMode.MORPHING: {
          break
        }
        case Cesium.SceneMode.SCENE2D: {
          camera.zoomIn(
            camera.positionCartographic.height * (1 - relativeAmount)
          )
          break
        }
        default: {
          let focus: Cesium.Cartesian3

          if ($vc.viewer.trackedEntity) {
            focus = new Cesium.Cartesian3()
          } else {
            focus = getCameraFocus($vc.viewer.scene)
          }

          if (!focus) {
            // Camera direction is not pointing at the globe, so use the ellipsoid horizon point as
            // the focal point.
            const ray = new Cesium.Ray(
              camera.worldToCameraCoordinatesPoint(
                scene.globe.ellipsoid.cartographicToCartesian(
                  camera.positionCartographic
                )
              ),
              camera.directionWC
            )
            focus = Cesium.IntersectionTests.grazingAltitudeLocation(
              ray,
              scene.globe.ellipsoid
            )

            orientation = {
              heading: camera.heading,
              pitch: camera.pitch,
              roll: camera.roll
            }
          } else {
            orientation = {
              direction: camera.direction,
              up: camera.up
            }
          }
          const cartesian3Scratch = new Cesium.Cartesian3()
          const direction = Cesium.Cartesian3.subtract(
            camera.position,
            focus,
            cartesian3Scratch
          )
          const movementVector = Cesium.Cartesian3.multiplyByScalar(
            direction,
            relativeAmount,
            direction
          )
          const endPosition = Cesium.Cartesian3.add(
            focus,
            movementVector,
            focus
          )
          // const type = relativeAmount < 1 ? 'zoomIn' : 'zoomOut'
          // const target = e.currentTarget
          // const level = heightToLevel(
          //   camera.positionCartographic.height
          // ).toFixed(0)
          // emit('zoomEvt', {
          //   type: type,
          //   camera: $vc.viewer.camera,
          //   status: 'start',
          //   target: target,
          //   level
          // })

          if (
            Cesium.defined($vc.viewer.trackedEntity) ||
            scene.mode === Cesium.SceneMode.COLUMBUS_VIEW
          ) {
            // sometimes flyTo does not work (jumps to wrong position) so just set the position without any animation
            // do not use flyTo when tracking an entity because during animatiuon the position of the entity may change
            camera.position = endPosition
          } else {
            camera.flyTo({
              destination: endPosition,
              orientation: orientation,
              duration: props.zoomDuration,
              convert: false
              // complete: () => {
              //   emit('zoomEvt', {
              //     type: type,
              //     camera: $vc.viewer.camera,
              //     status: 'end',
              //     target,
              //     level
              //   })
              // },
              // cancel: () => {
              //   emit('zoomEvt', {
              //     type: type,
              //     camera: $vc.viewer.camera,
              //     status: 'cancel',
              //     target,
              //     level
              //   })
              // }
            })
          }
        }
      }
    }
  }
  // 视图高度级别
  const heightToLevel = (altitude: number) => {
    // 粗略计算
    const A = 40487.57
    const B = 0.00007096758
    const C = 91610.74
    const D = -40467.74

    return Math.round(D + (A - D) / (1 + Math.pow(altitude / C, B)))
  }
  const getCameraFocus = (scene: Cesium.Scene) => {
    const ray = new Cesium.Ray(
      scene.camera.positionWC,
      scene.camera.directionWC
    )
    const intersections = Cesium.IntersectionTests.rayEllipsoid(
      ray,
      scene.globe.ellipsoid
    )
    if (intersections) {
      return Cesium.Ray.getPoint(ray, intersections.start)
    }
    // Camera direction is not pointing at the globe, so use the ellipsoid horizon point as
    // the focal point.
    return Cesium.IntersectionTests.grazingAltitudeLocation(
      ray,
      scene.globe.ellipsoid
    )
  }

  return {
    zoomInClick,
    zoomOutClick,
    zoom,
    heightToLevel,
    getCameraFocus
  }
}
