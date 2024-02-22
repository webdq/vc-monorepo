import CircleBlurMaterialProperty from './circle/CircleBlurMaterialProperty'
import CircleDiffuseMaterialProperty from './circle/CircleDiffuseMaterialProperty'
import CircleFadeMaterialProperty from './circle/CircleFadeMaterialProperty'
import CirclePulseMaterialProperty from './circle/CirclePulseMaterialProperty'
import CircleScanMaterialProperty from './circle/CircleScanMaterialProperty'
import CircleSpiralMaterialProperty from './circle/CircleSpiralMaterialProperty'
import CircleVaryMaterialProperty from './circle/CircleVaryMaterialProperty'
import CircleWaveMaterialProperty from './circle/CircleWaveMaterialProperty'

import EllipsoidElectricMaterialProperty from './ellipsoid/EllipsoidElectricMaterialProperty'
import EllipsoidTrailMaterialProperty from './ellipsoid/EllipsoidTrailMaterialProperty'

import PolylineFlickerMaterialProperty from './polyline/PolylineFlickerMaterialProperty'
import PolylineFlowMaterialProperty from './polyline/PolylineFlowMaterialProperty'
import PolylineImageTrailMaterialProperty from './polyline/PolylineImageTrailMaterialProperty'
import PolylineLightingTrailMaterialProperty from './polyline/PolylineLightingTrailMaterialProperty'
import PolylineTrailMaterialProperty from './polyline/PolylineTrailMaterialProperty'

import RadarLineMaterialProperty from './radar/RadarLineMaterialProperty'
import RadarScanMaterialProperty from './radar/RadarScanMaterialProperty'
import RadarSweepMaterialProperty from './radar/RadarSweepMaterialProperty'
import RadarWaveMaterialProperty from './radar/RadarWaveMaterialProperty'

import WallImageTrailMaterialProperty from './wall/WallImageTrailMaterialProperty'
import WallLineTrailMaterialProperty from './wall/WallLineTrailMaterialProperty'
import WallTrailMaterialProperty from './wall/WallTrailMaterialProperty'

import {
  CircleBlurType,
  CircleDiffuseType,
  CircleFadeType,
  CirclePulseType,
  CircleScanType,
  CircleSpiralType,
  CircleVaryType,
  CircleWaveType,
  EllipsoidElectricType,
  EllipsoidTrailType,
  PolylineFlickerType,
  PolylineFlowType,
  PolylineImageTrailType,
  PolylineLightingTrailType,
  PolylineTrailType,
  RadarLineType,
  RadarScanType,
  RadarSweepType,
  RadarWaveType,
  WallImageTrailType,
  WallLineTrailType,
  WallTrailType
} from './material-type'

import {
  CircleBlurSource,
  CircleDiffuseSource,
  CircleFadeSource,
  CirclePulseSource,
  CircleScanSource,
  CircleSpiralSource,
  CircleVarySource,
  CircleWaveSource,
  EllipsoidElectricSource,
  EllipsoidTrailSource,
  PolylineFlickerSource,
  PolylineFlowSource,
  PolylineImageTrailSource,
  PolylineLightingTrailSource,
  PolylineTrailSource,
  RadarLineSource,
  RadarScanSource,
  RadarSweepSource,
  RadarWaveSource,
  WallImageTrailSource,
  WallLineTrailSource,
  WallTrailSource
} from './material-source'

Cesium.CircleBlurMaterialProperty = CircleBlurMaterialProperty
Cesium.Material.CircleBlurType = CircleBlurType
Cesium.Material._materialCache.addMaterial(CircleBlurType, {
  fabric: {
    type: CircleBlurType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0
    },
    source: CircleBlurSource
  },
  translucent: function () {
    return true
  }
})
Cesium.CircleDiffuseMaterialProperty = CircleDiffuseMaterialProperty
Cesium.Material.CircleDiffuseType = CircleDiffuseType
Cesium.Material._materialCache.addMaterial(CircleDiffuseType, {
  fabric: {
    type: CircleDiffuseType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      speed: 10.0
    },
    source: CircleDiffuseSource
  },
  translucent: function () {
    return true
  }
})
Cesium.CircleFadeMaterialProperty = CircleFadeMaterialProperty
Cesium.Material.CircleFadeType = CircleFadeType
Cesium.Material._materialCache.addMaterial(CircleFadeType, {
  fabric: {
    type: CircleFadeType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0
    },
    source: CircleFadeSource
  },
  translucent: function () {
    return true
  }
})
Cesium.CirclePulseMaterialProperty = CirclePulseMaterialProperty
Cesium.Material.CirclePulseType = CirclePulseType
Cesium.Material._materialCache.addMaterial(CirclePulseType, {
  fabric: {
    type: CirclePulseType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 12.0
    },
    source: CirclePulseSource
  },
  translucent: function () {
    return true
  }
})
Cesium.CircleScanMaterialProperty = CircleScanMaterialProperty
Cesium.Material.CircleScanType = CircleScanType
Cesium.Material._materialCache.addMaterial(CircleScanType, {
  fabric: {
    type: CircleScanType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 1.0
    },
    source: CircleScanSource
  },
  translucent: function () {
    return true
  }
})
Cesium.CircleSpiralMaterialProperty = CircleSpiralMaterialProperty
Cesium.Material.CircleSpiralType = CircleSpiralType
Cesium.Material._materialCache.addMaterial(CircleSpiralType, {
  fabric: {
    type: CircleSpiralType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0
    },
    source: CircleSpiralSource
  },
  translucent: function () {
    return true
  }
})
Cesium.CircleVaryMaterialProperty = CircleVaryMaterialProperty
Cesium.Material.CircleVaryType = CircleVaryType
Cesium.Material._materialCache.addMaterial(CircleVaryType, {
  fabric: {
    type: CircleVaryType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0
    },
    source: CircleVarySource
  },
  translucent: function () {
    return true
  }
})
Cesium.CircleWaveMaterialProperty = CircleWaveMaterialProperty
Cesium.Material.CircleWaveType = CircleWaveType
Cesium.Material._materialCache.addMaterial(CircleWaveType, {
  fabric: {
    type: CircleWaveType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0,
      count: 1,
      gradient: 0.1
    },
    source: CircleWaveSource
  },
  translucent: function () {
    return true
  }
})
Cesium.EllipsoidElectricMaterialProperty = EllipsoidElectricMaterialProperty
Cesium.Material.EllipsoidElectricType = EllipsoidElectricType
Cesium.Material._materialCache.addMaterial(EllipsoidElectricType, {
  fabric: {
    type: EllipsoidElectricType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 1.0
    },
    source: EllipsoidElectricSource
  },
  translucent: function () {
    return true
  }
})
Cesium.EllipsoidTrailMaterialProperty = EllipsoidTrailMaterialProperty
Cesium.Material.EllipsoidTrailType = EllipsoidTrailType
Cesium.Material._materialCache.addMaterial(EllipsoidTrailType, {
  fabric: {
    type: EllipsoidTrailType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0
    },
    source: EllipsoidTrailSource
  },
  translucent: function () {
    return true
  }
})
Cesium.PolylineFlickerMaterialProperty = PolylineFlickerMaterialProperty
Cesium.Material.PolylineFlickerType = PolylineFlickerType
Cesium.Material._materialCache.addMaterial(PolylineFlickerType, {
  fabric: {
    type: PolylineFlickerType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 1
    },
    source: PolylineFlickerSource
  },
  translucent: function () {
    return true
  }
})
Cesium.PolylineFlowMaterialProperty = PolylineFlowMaterialProperty
Cesium.Material.PolylineFlowType = PolylineFlowType
Cesium.Material._materialCache.addMaterial(PolylineFlowType, {
  fabric: {
    type: PolylineFlowType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 1,
      percent: 0.03,
      gradient: 0.1
    },
    source: PolylineFlowSource
  },
  translucent: function () {
    return true
  }
})
Cesium.PolylineImageTrailMaterialProperty = PolylineImageTrailMaterialProperty
Cesium.Material.PolylineImageTrailType = PolylineImageTrailType
Cesium.Material._materialCache.addMaterial(PolylineImageTrailType, {
  fabric: {
    type: PolylineImageTrailType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 1,
      image: '',
      repeat: new Cesium.Cartesian2(1, 1)
    },
    source: PolylineImageTrailSource
  },
  translucent: function () {
    return true
  }
})
Cesium.PolylineLightingTrailMaterialProperty =
  PolylineLightingTrailMaterialProperty
Cesium.Material.PolylineLightingTrailType = PolylineLightingTrailType
Cesium.Material._materialCache.addMaterial(PolylineLightingTrailType, {
  fabric: {
    type: PolylineLightingTrailType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0,
      image: ''
    },
    source: PolylineLightingTrailSource
  },
  translucent: function () {
    return true
  }
})
Cesium.PolylineTrailMaterialProperty = PolylineTrailMaterialProperty
Cesium.Material.PolylineTrailType = PolylineTrailType
Cesium.Material._materialCache.addMaterial(PolylineTrailType, {
  fabric: {
    type: PolylineTrailType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 1
    },
    source: PolylineTrailSource
  },
  translucent: function () {
    return true
  }
})
Cesium.RadarLineMaterialProperty = RadarLineMaterialProperty
Cesium.Material.RadarLineType = RadarLineType
Cesium.Material._materialCache.addMaterial(RadarLineType, {
  fabric: {
    type: RadarLineType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0
    },
    source: RadarLineSource
  },
  translucent: function () {
    return true
  }
})
Cesium.RadarScanMaterialProperty = RadarScanMaterialProperty
Cesium.Material.RadarScanType = RadarScanType
Cesium.Material._materialCache.addMaterial(RadarScanType, {
  fabric: {
    type: RadarScanType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0
    },
    source: RadarScanSource
  },
  translucent: function () {
    return true
  }
})
Cesium.RadarSweepMaterialProperty = RadarSweepMaterialProperty
Cesium.Material.RadarSweepType = RadarSweepType
Cesium.Material._materialCache.addMaterial(RadarSweepType, {
  fabric: {
    type: RadarSweepType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0
    },
    source: RadarSweepSource
  },
  translucent: function () {
    return true
  }
})
Cesium.RadarWaveMaterialProperty = RadarWaveMaterialProperty
Cesium.Material.RadarWaveType = RadarWaveType
Cesium.Material._materialCache.addMaterial(RadarWaveType, {
  fabric: {
    type: RadarWaveType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0
    },
    source: RadarWaveSource
  },
  translucent: function () {
    return true
  }
})
Cesium.WallImageTrailMaterialProperty = WallImageTrailMaterialProperty
Cesium.Material.WallImageTrailType = WallImageTrailType
Cesium.Material._materialCache.addMaterial(WallImageTrailType, {
  fabric: {
    type: WallImageTrailType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0,
      image: '',
      repeat: new Cesium.Cartesian2(1, 1)
    },
    source: WallImageTrailSource
  },
  translucent: function () {
    return true
  }
})
Cesium.WallLineTrailMaterialProperty = WallLineTrailMaterialProperty
Cesium.Material.WallLineTrailType = WallLineTrailType
Cesium.Material._materialCache.addMaterial(WallLineTrailType, {
  fabric: {
    type: WallLineTrailType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0,
      image: '',
      repeat: new Cesium.Cartesian2(1, 1)
    },
    source: WallLineTrailSource
  },
  translucent: function () {
    return true
  }
})
Cesium.WallTrailMaterialProperty = WallTrailMaterialProperty
Cesium.Material.WallTrailType = WallTrailType
Cesium.Material._materialCache.addMaterial(WallTrailType, {
  fabric: {
    type: WallTrailType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 1.0,
      image: ''
    },
    source: WallTrailSource
  },
  translucent: function () {
    return true
  }
})
