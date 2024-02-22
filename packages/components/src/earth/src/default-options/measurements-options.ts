import {
  actionOptions,
  circleDrawingActionDefault,
  editorOptsDefault,
  labelOptsDefault,
  pointDrawingDefault,
  pointOptsDefault,
  polygonDrawingDefault,
  polylineDrawingDefault,
  polylineOptsDefault,
  polylinePrimitiveOptsDefault,
  regularDrawingActionDefault,
  segmentDrawingDefault
} from './drawings-options'

const distanceMeasurementActionDefault: any = Object.assign({}, actionOptions, {
  icon: 'vc-icons-measure-distance'
})

const distanceMeasurementDefault: any = Object.assign(
  {},
  segmentDrawingDefault,
  {
    labelOpts: Object.assign({}, labelOptsDefault, {
      horizontalOrigin: 1, // left
      verticalOrigin: -1, // top
      pixelOffset: [10, 10]
    }),
    // measureUnits: new MeasureUnits(),
    decimals: {
      distance: 2,
      angle: 2
    },
    locale: undefined,
    autoUpdateLabelPosition: true
  }
)

const componentDistanceMeasurementActionDefault: any = Object.assign(
  {},
  actionOptions,
  {
    icon: 'vc-icons-measure-component-distance'
  }
)

const componentDistanceMeasurementDefault: any = Object.assign(
  {},
  distanceMeasurementDefault,
  {
    showComponentLines: true,
    xLabelOpts: labelOptsDefault,
    xAngleLabelOpts: Object.assign({}, labelOptsDefault, {
      horizontalOrigin: 1, // left
      verticalOrigin: 0, // center
      pixelOffset: [9, 0]
    }),
    yLabelOpts: Object.assign({}, labelOptsDefault, {
      horizontalOrigin: -1, // right
      pixelOffset: [-9, 0]
    }),
    yAngleLabelOpts: Object.assign({}, labelOptsDefault, {
      verticalOrigin: -1, // top
      pixelOffset: [0, 9]
    })
  }
)

const polylineMeasurementActionDefault: any = Object.assign({}, actionOptions, {
  icon: 'vc-icons-measure-polyline-distance'
})

const polylineMeasurementDefault: any = Object.assign(
  {},
  polylineDrawingDefault,
  {
    // measureUnits: new MeasureUnits(),
    labelOpts: labelOptsDefault,
    labelsOpts: Object.assign({}, labelOptsDefault, {
      scale: 0.8,
      horizontalOrigin: 1, // left
      verticalOrigin: -1, // tOP,
      pixelOffset: [5, 5]
    }),
    decimals: {
      distance: 2,
      angle: 2
    },
    showLabel: true,
    showAngleLabel: true,
    showDistanceLabel: true,
    locale: undefined,
    loop: false,
    autoUpdateLabelPosition: true
  }
)

const horizontalMeasurementActionDefault: any = Object.assign(
  {},
  actionOptions,
  {
    icon: 'vc-icons-measure-horizontal-distance'
  }
)

const horizontalMeasurementDefault: any = Object.assign(
  {},
  polylineMeasurementDefault,
  {
    dashLineOpts: {
      width: 2
    },
    dashLinePrimitiveOpts: Object.assign({}, polylinePrimitiveOptsDefault, {
      appearance: {
        type: 'PolylineMaterialAppearance',
        options: {
          material: {
            fabric: {
              type: 'PolylineDash',
              uniforms: {
                color: [255, 255, 0, 255]
              }
            }
          }
        }
      },
      depthFailAppearance: {
        type: 'PolylineMaterialAppearance',
        options: {
          material: {
            fabric: {
              type: 'PolylineDash',
              uniforms: {
                color: [255, 255, 0, 255]
              }
            }
          }
        }
      }
    }),
    labelOpts: Object.assign({}, labelOptsDefault, {
      horizontalOrigin: 1,
      verticalOrigin: 1,
      pixelOffset: [10, -10]
    }),
    labelsOpts: Object.assign({}, labelOptsDefault, {
      scale: 0.8,
      horizontalOrigin: 1, // left
      verticalOrigin: -1, // tOP,
      pixelOffset: [5, 5]
    }),
    showDashedLine: true
  }
)

const verticalMeasurementActionDefault: any = Object.assign({}, actionOptions, {
  icon: 'vc-icons-measure-vertical-distance'
})

const verticalMeasurementDefault: any = Object.assign(
  {},
  segmentDrawingDefault,
  {
    labelOpts: Object.assign({}, labelOptsDefault, {
      horizontalOrigin: 1, // left
      verticalOrigin: -1, // top
      pixelOffset: [10, 10]
    }),
    // measureUnits: new MeasureUnits(),
    decimals: {
      distance: 2,
      angle: 2
    },
    locale: undefined,
    autoUpdateLabelPosition: true
  }
)

const heightMeasurementActionDefault: any = Object.assign({}, actionOptions, {
  icon: 'vc-icons-measure-height-from-terrain'
})

const heightMeasurementDefault: any = Object.assign({}, pointDrawingDefault, {
  polylineOpts: polylineOptsDefault,
  labelOpts: Object.assign({}, labelOptsDefault, {
    horizontalOrigin: 1, // left
    verticalOrigin: -1, // top
    pixelOffset: [10, 10]
  }),
  editorOpts: {
    pixelOffset: [16, -8],
    delay: 1000,
    hideDelay: 1000,
    move: Object.assign({}, editorOptsDefault),
    removeAll: Object.assign({}, editorOptsDefault, {
      icon: 'vc-icons-delete'
    })
  },
  // measureUnits: new MeasureUnits(),
  decimals: {
    distance: 2
  },
  locale: undefined,
  primitiveOpts: polylinePrimitiveOptsDefault
})

const areaMeasurementActionDefault: any = Object.assign({}, actionOptions, {
  icon: 'vc-icons-measure-area'
})

const areaMeasurementDefault: any = Object.assign({}, polygonDrawingDefault, {
  labelOpts: labelOptsDefault,
  labelsOpts: Object.assign({}, labelOptsDefault, {
    scale: 0.8,
    horizontalOrigin: 1, // left
    verticalOrigin: -1, // tOP,
    pixelOffset: [5, 5]
  }),
  showDistanceLabel: true,
  showAngleLabel: true,
  showLabel: true,
  // measureUnits: new MeasureUnits(),
  decimals: {
    area: 2,
    distance: 2,
    angle: 2
  },
  loop: true,
  locale: undefined,
  autoUpdateLabelPosition: true
})

const pointMeasurementActionDefault: any = Object.assign({}, actionOptions, {
  icon: 'vc-icons-measure-point-coordinates'
})

const pointMeasurementDefault: any = Object.assign({}, pointDrawingDefault, {
  heightReference: 1, // 0: NONE, 1: CLAMP_TO_GROUND
  // measureUnits: new MeasureUnits(),
  drawtip: {
    show: true,
    pixelOffset: [32, 48]
  },
  labelOpts: Object.assign({}, labelOptsDefault, {
    horizontalOrigin: 1, // left
    verticalOrigin: 0, // center
    pixelOffset: [10, 0]
  }),
  decimals: {
    lng: 6,
    lat: 6,
    height: 2,
    slope: 3
  },
  locale: undefined,
  showLabel: true
})

const rectangleMeasurementActionDefault: any = Object.assign(
  {},
  actionOptions,
  {
    icon: 'vc-icons-drawing-rectangle'
  }
)

const rectangleMeasurementDefault: any = Object.assign(
  {},
  areaMeasurementDefault,
  {
    pointOpts: Object.assign({}, pointOptsDefault, {
      show: false
    }),
    drawtip: {
      show: true,
      pixelOffset: [32, 32]
    },
    editorOpts: {
      pixelOffset: [16, -8],
      delay: 1000,
      hideDelay: 1000,
      move: Object.assign({}, editorOptsDefault),
      removeAll: Object.assign({}, editorOptsDefault, {
        icon: 'vc-icons-delete'
      })
    },
    edge: 4,
    loop: false,
    showAngleLabel: false
  }
)

const regularMeasurementDefault: any = Object.assign(
  {},
  rectangleMeasurementDefault,
  {
    edge: 6,
    loop: true
  }
)

const circleMeasurementDefault: any = Object.assign(
  {},
  rectangleMeasurementDefault,
  {
    edge: 360,
    loop: true,
    showDistanceLabel: false,
    showAngleLabel: false
  }
)

const fabActionOptsDefault: any = Object.assign({}, {})

const mainFabDefault: any = Object.assign({}, actionOptions, {
  direction: 'right',
  icon: 'vc-icons-measurement-button',
  activeIcon: 'vc-icons-measurement-button',
  verticalActionsAlign: 'center',
  hideIcon: false,
  persistent: false,
  modelValue: true,
  hideActionOnClick: false,
  color: 'info'
})

export {
  distanceMeasurementActionDefault,
  distanceMeasurementDefault,
  componentDistanceMeasurementActionDefault,
  componentDistanceMeasurementDefault,
  polylineMeasurementActionDefault,
  polylineMeasurementDefault,
  horizontalMeasurementActionDefault,
  horizontalMeasurementDefault,
  verticalMeasurementActionDefault,
  verticalMeasurementDefault,
  heightMeasurementActionDefault,
  heightMeasurementDefault,
  areaMeasurementActionDefault,
  areaMeasurementDefault,
  pointMeasurementActionDefault,
  pointMeasurementDefault,
  rectangleMeasurementActionDefault,
  rectangleMeasurementDefault,
  regularMeasurementDefault,
  circleMeasurementDefault,
  fabActionOptsDefault,
  mainFabDefault
}
