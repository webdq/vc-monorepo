/// <reference types="vue-cesium/Cesium" />
/// <reference types="@webdq/vc-materials/Cesium" />

declare namespace Cesium {
  interface Viewer {
    cesiumInspector: any
    cesium3DTilesInspector: any
  }
  interface Scene {
    verticalExaggeration: number
  }
}
