<template>
  <div class="page">
    <vc-earth
      :cesium-path="cesiumPath"
      :access-token="accessToken"
      @viewer-ready="viewerReady"
    >
    </vc-earth>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

const cesiumPath = inject<string>('cesiumPath')
const accessToken = inject<string>('accessToken')

const viewerReady = (readyObj: any) => {
  const viewer = readyObj.viewer
  window.__cesium_viewer__ = viewer

  addMaterialCircle(viewer)
  addMaterialEllipsoid(viewer)
  addMaterialPolyline(viewer)
  addMaterialRadar(viewer)
  addMaterialWall(viewer)
  viewer.zoomTo(viewer.entities)
}

const addMaterialCircle = (viewer: Cesium.Viewer) => {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      114.98514154344694,
      36.57279487017833,
      -174.42390662389755
    ),
    ellipse: {
      semiMajorAxis: 50000.0,
      semiMinorAxis: 50000.0,
      material: new Cesium.CircleBlurMaterialProperty({
        color: Cesium.Color.BLUE,
        speed: 50
      })
    }
  })
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      115.98514154344694,
      36.57279487017833,
      -174.42390662389755
    ),
    ellipse: {
      semiMajorAxis: 50000.0,
      semiMinorAxis: 50000.0,
      material: new Cesium.CircleDiffuseMaterialProperty({
        color: Cesium.Color.YELLOW,
        speed: 50
      })
    }
  })
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      116.98514154344694,
      36.57279487017833,
      -174.42390662389755
    ),
    ellipse: {
      semiMajorAxis: 50000.0,
      semiMinorAxis: 50000.0,
      material: new Cesium.CircleFadeMaterialProperty({
        color: Cesium.Color.BROWN,
        speed: 30
      })
    }
  })
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      117.98514154344694,
      36.57279487017833,
      -174.42390662389755
    ),
    ellipse: {
      semiMajorAxis: 50000.0,
      semiMinorAxis: 50000.0,
      material: new Cesium.CirclePulseMaterialProperty({
        color: Cesium.Color.AQUA,
        speed: 20
      })
    }
  })
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      118.98514154344694,
      36.57279487017833,
      -174.42390662389755
    ),
    ellipse: {
      semiMajorAxis: 50000.0,
      semiMinorAxis: 50000.0,
      material: new Cesium.CircleScanMaterialProperty({
        color: Cesium.Color.DARKGOLDENROD,
        speed: 20
      })
    }
  })
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      119.98514154344694,
      36.57279487017833,
      -174.42390662389755
    ),
    ellipse: {
      semiMajorAxis: 50000.0,
      semiMinorAxis: 50000.0,
      material: new Cesium.CircleSpiralMaterialProperty({
        color: Cesium.Color.DARKSALMON,
        speed: 20
      })
    }
  })
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      120.98514154344694,
      36.57279487017833,
      -174.42390662389755
    ),
    ellipse: {
      semiMajorAxis: 50000.0,
      semiMinorAxis: 50000.0,
      material: new Cesium.CircleVaryMaterialProperty({
        color: Cesium.Color.GREEN,
        speed: 20
      })
    }
  })
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      121.98514154344694,
      36.57279487017833,
      -174.42390662389755
    ),
    ellipse: {
      semiMajorAxis: 50000.0,
      semiMinorAxis: 50000.0,
      material: new Cesium.CircleWaveMaterialProperty({
        color: Cesium.Color.INDIGO,
        speed: 20
      })
    }
  })
}
const addMaterialEllipsoid = (viewer: Cesium.Viewer) => {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      114.98514154344694,
      35.57279487017833,
      -174.42390662389755
    ),
    ellipsoid: {
      radii: new Cesium.Cartesian3(50000.0, 50000.0, 50000.0),
      material: new Cesium.EllipsoidElectricMaterialProperty({
        color: Cesium.Color.MEDIUMPURPLE,
        speed: 50
      })
    }
  })
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      115.98514154344694,
      35.57279487017833,
      -174.42390662389755
    ),
    ellipsoid: {
      radii: new Cesium.Cartesian3(50000.0, 50000.0, 50000.0),
      material: new Cesium.EllipsoidTrailMaterialProperty({
        color: Cesium.Color.MISTYROSE,
        speed: 50
      })
    }
  })
}
const addMaterialPolyline = (viewer: Cesium.Viewer) => {
  viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        114.7286454749102, 34.69071928492438, 118.24888517342589,
        34.7179844332465
      ]),
      width: 20,
      material: new Cesium.PolylineFlickerMaterialProperty({
        color: Cesium.Color.SALMON,
        speed: 20
      })
    }
  })
  viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        114.7286454749102, 33.69071928492438, 118.24888517342589,
        33.7179844332465
      ]),
      width: 20,
      material: new Cesium.PolylineFlowMaterialProperty({
        color: Cesium.Color.FORESTGREEN,
        speed: 20,
        percent: 0.2,
        gradient: 0.4
      })
    }
  })
  viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        114.7286454749102, 32.69071928492438, 118.24888517342589,
        32.7179844332465
      ]),
      width: 20,
      material: new Cesium.PolylineImageTrailMaterialProperty({
        color: Cesium.Color.DARKTURQUOISE,
        speed: 20,
        image: 'http://192.168.110.105:18888/lib/material/line.png'
      })
    }
  })
  viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        114.7286454749102, 31.69071928492438, 118.24888517342589,
        31.7179844332465
      ]),
      width: 20,
      material: new Cesium.PolylineLightingTrailMaterialProperty({
        color: Cesium.Color.BISQUE,
        speed: 20,
        image: 'http://192.168.110.105:18888/lib/material/line3.png'
      })
    }
  })
  viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        114.7286454749102, 30.69071928492438, 118.24888517342589,
        30.7179844332465
      ]),
      width: 20,
      material: new Cesium.PolylineTrailMaterialProperty({
        color: Cesium.Color.MEDIUMVIOLETRED,
        speed: 20
      })
    }
  })
}
const addMaterialRadar = (viewer: Cesium.Viewer) => {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      120.09847630349241,
      34.444318863843655,
      -27.695515802223163
    ),
    ellipse: {
      semiMajorAxis: 50000.0,
      semiMinorAxis: 50000.0,
      material: new Cesium.RadarLineMaterialProperty({
        color: Cesium.Color.CHOCOLATE,
        speed: 50
      })
    }
  })
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      121.59847630349241,
      34.444318863843655,
      -27.695515802223163
    ),
    ellipse: {
      semiMajorAxis: 50000.0,
      semiMinorAxis: 50000.0,
      material: new Cesium.RadarScanMaterialProperty({
        color: Cesium.Color.DARKMAGENTA,
        speed: 50
      })
    }
  })
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      123.09847630349241,
      34.444318863843655,
      -27.695515802223163
    ),
    ellipse: {
      semiMajorAxis: 50000.0,
      semiMinorAxis: 50000.0,
      material: new Cesium.RadarSweepMaterialProperty({
        color: Cesium.Color.DARKVIOLET,
        speed: 50
      })
    }
  })
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      124.59847630349241,
      34.444318863843655,
      -27.695515802223163
    ),
    ellipse: {
      semiMajorAxis: 50000.0,
      semiMinorAxis: 50000.0,
      material: new Cesium.RadarWaveMaterialProperty({
        color: Cesium.Color.GOLD,
        speed: 50
      })
    }
  })
}
const addMaterialWall = (viewer: Cesium.Viewer) => {
  viewer.entities.add({
    wall: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        119.77912197702695, 33.35272686286581, 121.0605639285393,
        33.35272686286581, 121.0605639285393, 32.27483624951616,
        119.77912197702695, 32.27483624951616
      ]),
      minimumHeights: [40000, 40000, 40000, 40000],
      material: new Cesium.WallImageTrailMaterialProperty({
        color: Cesium.Color.CHOCOLATE,
        speed: 50,
        repeat: new Cesium.Cartesian2(2, 1),
        image: 'http://192.168.110.105:18888/lib/material/wall.png'
      })
    }
  })
  viewer.entities.add({
    wall: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        121.77912197702695, 33.35272686286581, 123.0605639285393,
        33.35272686286581, 123.0605639285393, 32.27483624951616,
        121.77912197702695, 32.27483624951616
      ]),
      minimumHeights: [40000, 40000, 40000, 40000],
      material: new Cesium.WallLineTrailMaterialProperty({
        color: Cesium.Color.DARKGREEN,
        speed: -50,
        repeat: new Cesium.Cartesian2(2, 2),
        image: 'http://192.168.110.105:18888/lib/material/wall5.png'
      })
    }
  })
  viewer.entities.add({
    wall: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        123.77912197702695, 33.35272686286581, 125.0605639285393,
        33.35272686286581, 125.0605639285393, 32.27483624951616,
        123.77912197702695, 32.27483624951616
      ]),
      minimumHeights: [40000, 40000, 40000, 40000],
      material: new Cesium.WallTrailMaterialProperty({
        color: Cesium.Color.DARKSLATEGREY,
        speed: -50,
        image: 'http://192.168.110.105:18888/lib/material/wall2.png'
      })
    }
  })
}
</script>

<style scoped lang="less">
.page {
  width: 100%;
  height: 100%;
  position: relative;
  .bar {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }
}
</style>
