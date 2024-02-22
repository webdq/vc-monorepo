<template>
  <div class="page">
    <vc-earth
      :cesium-path="cesiumPath"
      :access-token="accessToken"
      drawings
      statusbar
      distance
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
}
</script>

<style scoped lang="less">
.page {
  height: 100%;
  position: relative;
}
</style>
