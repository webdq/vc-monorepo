<template>
  <div class="page">
    <vc-earth
      :cesium-path="cesiumPath"
      :access-token="accessToken"
      :map-id="mapId"
      :map-list="mapList"
      compass
      :compass-opts="compassOpts"
      :compass-style="compassStyle"
      statusbar
      distance
      :timeline="timeline"
      :animation="animation"
      @viewer-ready="viewerReady"
    >
      <vc-toolbar
        v-model:mapId="mapId"
        :map-list="mapList"
        :toolbar-style="toolbarStyle"
        toolbar-direction="vertical"
        :toolbar-btns="toolbarBtns"
        :access-token="accessToken"
      ></vc-toolbar>
    </vc-earth>

    <div class="bar">
      <button @click="mapChange">mapChange</button>
      <button @click="timelineClick">timelineClick</button>
      <button @click="animationClick">animationClick</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from 'vue'

const cesiumPath = inject<string>('cesiumPath')
const accessToken = inject<string>('accessToken')

const viewerReady = (readyObj: any) => {
  const viewer = readyObj.viewer
  window.__cesium_viewer__ = viewer

  // if (window?.serverConfig?.removeDoubleClickTrackEntity) {
  //   viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
  //     Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  //   )
  //   viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(() => {
  //     if (Cesium.defined(viewer.trackedEntity)) {
  //       viewer.trackedEntity = undefined
  //     }
  //   }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  // }
  // if (window?.serverConfig?.removeLeftClickSelectEntity) {
  //   viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
  //     Cesium.ScreenSpaceEventType.LEFT_CLICK
  //   )
  // }
  // viewer.scene.postProcessStages.fxaa.enabled = true
  // viewer.scene.msaaSamples = 4
  // viewer.resolutionScale = window.devicePixelRatio
  // viewer.useBrowserRecommendedResolution = true
}

// 罗盘配置
const compassOpts = ref({
  outerOptions: {
    // icon: 'svguse:#icon-compass-outer',
    size: '50px',
    color: '#3f4854',
    background: 'transparent'
  },
  innerOptions: {
    size: '20px',
    color: '#fff',
    background: 'transparent'
  },
  markerOptions: {
    size: '50px',
    color: '#4ea1ff'
  }
})
// 罗盘样式
const compassStyle = ref({
  right: '20px',
  top: '100px'
})
// 工具栏样式
const toolbarStyle = reactive({
  top: '200px',
  right: '30px'
})
// 工具栏按钮
const toolbarBtns = ref<any>([
  'geocoder',
  'position',
  'layer',
  'home',
  'zoom-in',
  'zoom-out',
  'mode',
  'geolocation',
  'setting',
  'fullscreen',
  'debug'
])

const mapId = ref('2')
const mapList = ref<any[]>([
  {
    type: 'tms',
    id: '1',
    name: '本地地图',
    img: 'http://192.168.110.105:18888/stgic/static/images/map-tms.png',
    mapConfig: {
      url: 'http://192.168.110.105:18888/mapdata/imagery/world',
      maximumLevel: 7
    }
  },
  {
    type: 'amap',
    id: '2',
    name: '高德地图',
    img: 'http://192.168.110.105:18888/stgic/static/images/map-gaode.png',
    mapConfig: {
      mapStyle: '6',
      ltype: '0'
    },
    labelConfig: {
      mapStyle: '8',
      ltype: '0'
    }
  },
  {
    type: 'amap',
    id: '3',
    name: '高德道路图',
    img: 'http://192.168.110.105:18888/stgic/static/images/map-gaode-daolu.png',
    mapConfig: {
      mapStyle: '7',
      ltype: '0'
    }
  },
  {
    type: 'tianditu',
    id: '4',
    name: '天地图',
    img: 'http://192.168.110.105:18888/stgic/static/images/map-tianditu.png',
    mapConfig: {
      mapStyle: 'img_c',
      token: '436ce7e50d27eede2f2929307e6b33c0'
    },
    labelConfig: {}
  },
  {
    type: 'tianditu',
    id: '5',
    name: '天地图道路',
    img: 'http://192.168.110.105:18888/stgic/static/images/map-tianditu-daolu.png',
    mapConfig: {
      mapStyle: 'vec_c',
      token: '436ce7e50d27eede2f2929307e6b33c0'
    },
    labelConfig: {}
  },
  {
    type: 'tencent',
    id: '6',
    name: '腾讯地图',
    img: 'http://192.168.110.105:18888/stgic/static/images/map-tengxun.png',
    mapConfig: {
      mapStyle: 'img',
      styleId: '1'
    }
  },
  {
    type: 'tencent',
    id: '7',
    name: '腾讯道路图',
    img: 'http://192.168.110.105:18888/stgic/static/images/map-tengxun-daolu.png',
    mapConfig: {
      mapStyle: 'vector',
      styleId: '1'
    }
  },
  {
    type: 'baidu',
    id: '10',
    name: '百度地图',
    img: 'http://192.168.110.105:18888/stgic/static/images/map-tengxun.png',
    mapConfig: {
      mapStyle: 'img',
      ak: 'E4805d16520de693a3fe707cdc962045'
    }
  },
  {
    type: 'baidu',
    id: '11',
    name: '百度道路图',
    img: 'http://192.168.110.105:18888/stgic/static/images/map-tengxun.png',
    mapConfig: {
      mapStyle: 'vec',
      ak: 'E4805d16520de693a3fe707cdc962045'
    }
  },
  {
    type: 'bing',
    id: '12',
    name: '必应地图',
    img: 'http://192.168.110.105:18888/stgic/static/images/map-tengxun.png',
    mapConfig: {
      mapStyle: 'AerialWithLabels',
      bmKey: 'AmGu3cvB_g1HbkQErEyvmLc9j0YIGWS7IdOqR7-hQbO8J92Fzrzkhy_bYKSsyoEx'
    }
  },
  {
    type: 'bing',
    id: '13',
    name: '必应道路图',
    img: 'http://192.168.110.105:18888/stgic/static/images/map-tengxun.png',
    mapConfig: {
      mapStyle: 'Road',
      bmKey: 'AmGu3cvB_g1HbkQErEyvmLc9j0YIGWS7IdOqR7-hQbO8J92Fzrzkhy_bYKSsyoEx'
    }
  }
])
const mapChange = () => {
  mapId.value = '3'
}

const timeline = ref(true)
const timelineClick = () => {
  timeline.value = !timeline.value
}
const animation = ref(true)
const animationClick = () => {
  animation.value = !animation.value
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
