<template>
  <div class="page">
    <vc-earth
      :cesium-path="cesiumPath"
      :access-token="accessToken"
      measurements
      :measurements-mode="1"
      statusbar
      distance
      timeline
      animation
      @measurements-active-evt="measurementsActiveEvt"
      @measurements-clear="measurementsClear"
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

const measurementsActiveEvt = (evt: any, viewer: any) => {
  console.log('measurementsActiveEvt', evt, viewer)
}
const measurementsClear = (evt: any, viewer: any) => {
  console.log('measurementsClear', evt, viewer)
}
</script>

<style scoped lang="less">
.page {
  height: 100%;
  position: relative;
}
</style>
