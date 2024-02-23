<template>
  <div class="container">
    <div class="menu-wrapper">
      <a-menu mode="inline" @click="click">
        <a-menu-item v-for="item in routes" :key="item.name">{{
          item.name
        }}</a-menu-item>
      </a-menu>
    </div>
    <div class="page-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { provide } from 'vue'
import { Menu as AMenu } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { routes } from './router'

const AMenuItem = AMenu.Item

const router = useRouter()
const click = ({ key }: any) => {
  router.push({ path: key })
}

window.CESIUM_BASE_URL =
  'http://192.168.110.105:18888/lib/cesium/1.113.0/Cesium/'

const cesiumPath =
  'http://192.168.110.105:18888/lib/cesium/1.113.0/Cesium/Cesium.js'

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNDIwYmQ3ZS04NTA0LTRmNmUtODEwMy1jNWVmYWM4MmI0MjYiLCJpZCI6ODU3NzMsImlhdCI6MTY0NzMxMDAwNX0.wki68cZzLIA5D__Cp-WRw9tS4yRsn2PnI_3-A10zBeQ'

provide('cesiumPath', cesiumPath)
provide('accessToken', accessToken)
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  display: flex;
  overflow: hidden;
  .menu-wrapper {
    flex: 0 0 150px;
  }
  .page-wrapper {
    flex: 1;
  }
}
</style>
