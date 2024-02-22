declare global {
  interface Window {
    CESIUM_BASE_URL: string
    Cesium: Cesium
    __cesium_viewer__: Cesium.Viewer
    viewer: Cesium.Viewer
  }
}

export {}
