const actionOptions: any = {
  externalLabel: false,
  label: '',
  labelPosition: 'right',
  hideLabel: false,
  tabindex: undefined,
  disable: false,
  outline: false,
  push: false,
  flat: false,
  unelevated: false,
  color: 'primary',
  textColor: undefined,
  glossy: false,
  labelClass: undefined,
  labelStyle: undefined,
  square: false,
  tooltip: {
    delay: 500,
    anchor: 'bottom middle',
    offset: [0, 20],
    tip: undefined
  }
}

const polylinePrimitiveOptsDefault: any = {
  show: true,
  enableMouseEvent: true,
  asynchronous: false,
  classificationType: 2,
  appearance: {
    type: 'PolylineMaterialAppearance',
    options: {
      material: {
        fabric: {
          type: 'Color',
          uniforms: {
            color: '#51ff00'
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
            color: [255, 0, 0, 127]
          }
        }
      }
    }
  }
}

const pinOptsDefault: any = Object.assign({}, actionOptions, {
  icon: 'vc-icons-drawing-pin'
})

const pointOptsDefault: any = {
  show: true,
  color: 'rgb(255,229,0)',
  pixelSize: 8,
  outlineColor: 'black',
  outlineWidth: 1,
  disableDepthTestDistance: Number.POSITIVE_INFINITY
}

const billboardOptsDefault: any = {
  show: true,
  disableDepthTestDistance: Number.POSITIVE_INFINITY,
  verticalOrigin: 1,
  image: ''
}

const polylineOptsDefault: any = {
  width: 2,
  arcType: 0,
  ellipsoid: undefined
}

const polygonOptsDefault: any = {
  show: true,
  enableMouseEvent: true,
  asynchronous: false,
  classificationType: 2,
  appearance: {
    type: 'MaterialAppearance',
    options: {
      material: {
        fabric: {
          type: 'Color',
          uniforms: {
            color: [255, 165, 0, 125]
          }
        }
      },
      faceForward: true,
      renderState: {
        cull: {
          enabled: false
        },
        depthTest: {
          enabled: false
        }
      }
    }
  }
}

const labelOptsDefault: any = {
  show: true,
  font: '16px Arial Microsoft YaHei sans-serif',
  scale: 1,
  fillColor: 'white',
  showBackground: true,
  backgroundColor: { x: 0.165, y: 0.165, z: 0.165, w: 0.8 },
  backgroundPadding: [7, 5],
  horizontalOrigin: 0, // center
  verticalOrigin: 1, // bottom
  pixelOffset: [0, -9],
  disableDepthTestDistance: Number.POSITIVE_INFINITY
}

const editorOptsDefault: any = {
  icon: 'vc-icons-move',
  size: '24px',
  color: '#1296db',
  background: '#fff',
  round: true,
  flat: false,
  label: undefined,
  stack: false,
  dense: true,
  tooltip: {
    delay: 1000, // 鼠标悬浮多久显示提示信息
    anchor: 'bottom middle', // 提示信息锚点
    offset: [0, 20] // 提示信息位置偏移
  }
}

const pointDrawingDefault: any = {
  show: true,
  drawtip: {
    show: true,
    pixelOffset: [32, 32]
  },
  pointOpts: pointOptsDefault,
  editorOpts: {
    delay: 1000,
    hideDelay: 1000,
    pixelOffset: [16, -8],
    move: Object.assign({}, editorOptsDefault),
    remove: Object.assign({}, editorOptsDefault, {
      icon: 'vc-icons-remove'
    })
  },
  heightReference: 1,
  disableDepthTest: false,
  showLabel: false,
  labelOpts: Object.assign({}, labelOptsDefault, {
    horizontalOrigin: 1, // left
    verticalOrigin: 0, // center
    pixelOffset: [10, 0]
  })
}

const segmentDrawingDefault: any = {
  show: true,
  showComponentLines: false,
  drawtip: {
    show: true,
    pixelOffset: [32, 32]
  },
  pointOpts: pointOptsDefault,
  polylineOpts: polylineOptsDefault,
  primitiveOpts: polylinePrimitiveOptsDefault,
  editorOpts: {
    pixelOffset: [16, -8],
    delay: 1000,
    hideDelay: 1000,
    move: Object.assign({}, editorOptsDefault),
    removeAll: Object.assign({}, editorOptsDefault, {
      icon: 'vc-icons-delete'
    })
  },
  disableDepthTest: false
}

const polylineDrawingDefault: any = {
  show: true,
  drawtip: {
    show: true,
    pixelOffset: [32, 32]
  },
  pointOpts: pointOptsDefault,
  polylineOpts: polylineOptsDefault,
  primitiveOpts: polylinePrimitiveOptsDefault,
  editorOpts: {
    pixelOffset: [16, -8],
    delay: 1000,
    hideDelay: 1000,
    move: Object.assign({}, editorOptsDefault),
    insert: Object.assign({}, editorOptsDefault, {
      icon: 'vc-icons-insert'
    }),
    remove: Object.assign({}, editorOptsDefault, {
      icon: 'vc-icons-remove'
    }),
    removeAll: Object.assign({}, editorOptsDefault, {
      icon: 'vc-icons-delete'
    })
  },
  loop: false,
  disableDepthTest: false,
  showLabel: false,
  showAngleLabel: false,
  showDistanceLabel: false,
  labelOpts: labelOptsDefault,
  labelsOpts: Object.assign({}, labelOptsDefault, {
    scale: 0.8,
    horizontalOrigin: 1, // left
    verticalOrigin: -1, // top,
    pixelOffset: [5, 5]
  })
}

const polygonDrawingDefault: any = {
  show: true,
  drawtip: {
    show: true,
    pixelOffset: [32, 32]
  },
  pointOpts: pointOptsDefault,
  polylineOpts: polylineOptsDefault,
  primitiveOpts: Object.assign({}, polylinePrimitiveOptsDefault, {
    depthFailAppearance: {
      type: 'PolylineMaterialAppearance',
      options: {
        material: {
          fabric: {
            type: 'Color',
            uniforms: {
              color: '#51ff00'
            }
          }
        }
      }
    }
  }),
  polygonOpts: polygonOptsDefault,
  editorOpts: {
    pixelOffset: [16, -8],
    delay: 1000,
    hideDelay: 1000,
    move: Object.assign({}, editorOptsDefault),
    insert: Object.assign({}, editorOptsDefault, {
      icon: 'vc-icons-insert'
    }),
    remove: Object.assign({}, editorOptsDefault, {
      icon: 'vc-icons-remove'
    }),
    removeAll: Object.assign({}, editorOptsDefault, {
      icon: 'vc-icons-delete'
    })
  },
  loop: true,
  disableDepthTest: false,
  showDistanceLabel: false,
  showLabel: false,
  showAngleLabel: false,
  labelOpts: labelOptsDefault,
  labelsOpts: Object.assign({}, labelOptsDefault, {
    scale: 0.8,
    horizontalOrigin: 1, // left
    verticalOrigin: -1, // top,
    pixelOffset: [5, 5]
  })
}

const rectangleDrawingDefault: any = Object.assign({}, polygonDrawingDefault, {
  pointOpts: Object.assign({}, pointOptsDefault, {
    show: false
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
  edge: 4,
  loop: false,
  disableDepthTest: false,
  showLabel: false,
  showAngleLabel: false,
  showDistanceLabel: false,
  labelOpts: labelOptsDefault,
  labelsOpts: Object.assign({}, labelOptsDefault, {
    scale: 0.8,
    horizontalOrigin: 1, // left
    verticalOrigin: -1, // top,
    pixelOffset: [5, 5]
  })
})

const circleDrawingDefault: any = Object.assign({}, rectangleDrawingDefault, {
  edge: 360
})

const regularDrawingDefault: any = Object.assign({}, rectangleDrawingDefault, {
  edge: 6,
  loop: true
})

const clearActionDefault: any = Object.assign({}, actionOptions, {
  icon: 'vc-icons-clear',
  color: 'red'
})

const regularDrawingActionDefault: any = Object.assign({}, actionOptions, {
  icon: 'vc-icons-drawing-regular'
})

const circleDrawingActionDefault: any = Object.assign({}, actionOptions, {
  icon: 'vc-icons-drawing-circle'
})

const regularOptsDefault: any = Object.assign({}, actionOptions, {
  icon: 'vc-icons-drawing-regular'
})

const circleOptsDefault: any = Object.assign({}, actionOptions, {
  icon: 'vc-icons-drawing-circle'
})

export {
  actionOptions,
  polylinePrimitiveOptsDefault,
  pinOptsDefault,
  pointOptsDefault,
  billboardOptsDefault,
  polylineOptsDefault,
  polygonOptsDefault,
  labelOptsDefault,
  editorOptsDefault,
  pointDrawingDefault,
  segmentDrawingDefault,
  polylineDrawingDefault,
  polygonDrawingDefault,
  rectangleDrawingDefault,
  circleDrawingDefault,
  regularDrawingDefault,
  clearActionDefault,
  regularDrawingActionDefault,
  circleDrawingActionDefault,
  regularOptsDefault,
  circleOptsDefault
}
