<template>
  <div :style="toolbarStyle" class="vc-toolbar">
    <a-space :direction="toolbarDirection">
      <div v-if="showGeocoderButton" class="toolbar-item">
        <a-select
          v-show="showGeocodeInput"
          v-model:value="geocodeValue"
          show-search
          placeholder="请输入地理关键字"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          class="toolbar-geocoder-input"
          @search="geocodeSearch"
          @select="geocodeSelect"
        >
          <a-select-option
            v-for="item in geocodeList"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-button
          :disabled="disableToolbar"
          type="primary"
          class="toolbar-btn"
          @click="geocodeClick"
        >
          <search-outlined />
        </a-button>
      </div>
      <div v-if="showPositionButton" class="toolbar-item">
        <a-dropdown :trigger="['click']">
          <a-button
            :disabled="disableToolbar"
            type="primary"
            class="toolbar-btn"
            @click.prevent
          >
            <environment-outlined />
          </a-button>
          <template #overlay>
            <div class="overlay-group overlay-position">
              <a-input-number
                v-model:value="positionLongitude"
                addon-before="经度"
                :controls="false"
                :precision="2"
                :min="-180"
                :max="180"
                placeholder="-180 ~ 180"
              ></a-input-number>
              <a-input-number
                v-model:value="positionLatitude"
                addon-before="纬度"
                :controls="false"
                :precision="2"
                :min="-90"
                :max="90"
                placeholder="-90 ~ 90"
              ></a-input-number>
              <a-input-number
                v-model:value="positionHeight"
                addon-before="高度"
                addon-after="米"
                :controls="false"
                :precision="2"
                :min="0"
              ></a-input-number>
              <a-button
                type="primary"
                block
                class="position-btn"
                @click="positionClick"
                >确定</a-button
              >
            </div>
          </template>
        </a-dropdown>
      </div>
      <div v-if="showLayerButton" class="toolbar-item">
        <a-dropdown :trigger="['click']">
          <a-button
            :disabled="disableToolbar"
            type="primary"
            class="toolbar-btn"
            @click.prevent
          >
            <img :src="mapSelected?.img" class="toolbar-img" />
          </a-button>
          <template #overlay>
            <div class="overlay-group overlay-map">
              <div class="map-list">
                <div
                  v-for="item in mapList"
                  :key="item.id"
                  class="map-item"
                  @click="mapClick(item.id)"
                >
                  <div class="map-img">
                    <img :src="item.img" />
                  </div>
                  <div class="map-name">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </template>
        </a-dropdown>
      </div>
      <div v-if="showHomeButton" class="toolbar-item">
        <a-button
          :disabled="disableToolbar"
          type="primary"
          class="toolbar-btn"
          @click="homeClick"
        >
          <home-outlined />
        </a-button>
      </div>
      <div v-if="showZoomInButton" class="toolbar-item">
        <a-button
          :disabled="disableToolbar"
          type="primary"
          class="toolbar-btn"
          @click="zoomInClick"
        >
          <plus-outlined />
        </a-button>
      </div>
      <div v-if="showZoomOutButton" class="toolbar-item">
        <a-button
          :disabled="disableToolbar"
          type="primary"
          class="toolbar-btn"
          @click="zoomOutClick"
        >
          <minus-outlined />
        </a-button>
      </div>
      <div v-if="showSceneModeButton" class="toolbar-item">
        <a-dropdown :trigger="['click']">
          <a-button
            :disabled="disableToolbar"
            type="primary"
            class="toolbar-btn"
            @click="sceneModeClick"
          >
            <component
              :is="currentViewIcon"
              :class="is25D ? 'scene-mode-25D' : ''"
            ></component>
          </a-button>
          <template #overlay>
            <div class="overlay-group overlay-mode">
              <a-space>
                <a-button
                  v-if="is2D || is25D"
                  type="primary"
                  class="toolbar-btn"
                  @click="sceneModeChange(3)"
                >
                  <global-outlined />
                </a-button>
                <a-button
                  v-if="is3D || is25D"
                  type="primary"
                  class="toolbar-btn"
                  @click="sceneModeChange(2)"
                >
                  <table-outlined />
                </a-button>
                <a-button
                  v-if="is3D || is2D"
                  type="primary"
                  class="toolbar-btn"
                  @click="sceneModeChange(1)"
                >
                  <table-outlined class="scene-mode-25D" />
                </a-button>
              </a-space>
            </div>
          </template>
        </a-dropdown>
      </div>
      <div v-if="showGeolocationButton" class="toolbar-item">
        <a-button
          :disabled="disableToolbar"
          type="primary"
          class="toolbar-btn"
          @click="geolocationClick"
        >
          <aim-outlined />
        </a-button>
      </div>
      <div v-if="showSettingButton" class="toolbar-item">
        <a-dropdown :trigger="['click']">
          <a-button
            :disabled="disableToolbar"
            type="primary"
            class="toolbar-btn"
            @click.prevent
          >
            <setting-outlined />
          </a-button>
          <template #overlay>
            <div class="overlay-group overlay-setting">
              <div class="os-row">
                <div class="os-label">地形夸张</div>
                <a-slider
                  v-model:value="terrainExaggeration"
                  dots
                  :min="1"
                  :max="10"
                  @change="terrainExaggerationChange"
                >
                </a-slider>
              </div>
              <div class="os-row flex items-center">
                <span class="os-label">深度检测</span>
                <a-switch
                  v-model:checked="depthTestAgainstTerrain"
                  :checked-value="true"
                  :un-checked-value="false"
                  @change="depthTestAgainstTerrainChange"
                />
              </div>
              <div class="os-row flex items-center">
                <span class="os-label">光照</span>
                <a-switch
                  v-model:checked="enableLighting"
                  :checked-value="true"
                  :un-checked-value="false"
                  @change="enableLightingChange"
                />
              </div>
              <div class="os-row flex flex-wrap">
                <div class="shadows-group">
                  <span class="os-label">阴影</span>
                  <a-switch
                    v-model:checked="viewerShadows"
                    :checked-value="true"
                    :un-checked-value="false"
                    @change="viewerShadowsChange"
                  />
                </div>
                <div class="shadows-group">
                  <span class="os-label">地形阴影</span>
                  <a-switch
                    v-model:checked="terrainShadows"
                    :checked-value="true"
                    :un-checked-value="false"
                    @change="terrainShadowsChange"
                  />
                </div>
                <div class="shadows-group">
                  <span class="os-label">实体阴影</span>
                  <a-switch
                    v-model:checked="entityShadows"
                    :checked-value="1"
                    :un-checked-value="0"
                    @change="entityShadowsChange"
                  />
                </div>
              </div>
              <div class="os-row flex items-center">
                <span class="os-label">抗锯齿</span>
                <a-switch
                  v-model:checked="fxaa"
                  :checked-value="true"
                  :un-checked-value="false"
                  @change="fxaaChange"
                />
              </div>
            </div>
          </template>
        </a-dropdown>
      </div>
      <div v-if="showFullscreenButton" class="toolbar-item">
        <a-button
          :disabled="disableToolbar"
          type="primary"
          class="toolbar-btn"
          @click="fullscreenClick"
        >
          <fullscreen-outlined />
        </a-button>
      </div>
      <div v-if="showDebugButton" class="toolbar-item">
        <a-button type="primary" class="toolbar-btn" @click="debugClick">
          <bug-outlined />
        </a-button>
      </div>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import {
  Button as AButton,
  InputNumber as AInputNumber,
  Select as ASelect,
  Dropdown as ADropdown,
  Slider as ASlider,
  Switch as ASwitch,
  Space as ASpace
} from 'ant-design-vue'
import {
  EnvironmentOutlined,
  SearchOutlined,
  HomeOutlined,
  PlusOutlined,
  MinusOutlined,
  AimOutlined,
  SettingOutlined,
  FullscreenOutlined,
  BugOutlined,
  TableOutlined,
  GlobalOutlined
} from '@ant-design/icons-vue'
import { useVueCesium } from 'vue-cesium'
import { toolbarProps, toolbarEmits } from './toolbar'
import { useToolbarButton, useToolbarHandle } from './hooks/use-toolbar'
import { useGeocode } from './hooks/use-geocode'
import { usePosition } from './hooks/use-position'
import { useMapLayer } from './hooks/use-map-layer'
import { useZoom } from './hooks/use-zoom'
import { useSceneMode } from './hooks/use-scene-mode'
import { useMapSetting } from './hooks/use-map-setting'

defineOptions({
  name: 'VcToolbar'
})

const emit = defineEmits(toolbarEmits)

const props = defineProps(toolbarProps)

const $vc = useVueCesium()

const {
  showGeocoderButton,
  showPositionButton,
  showLayerButton,
  showHomeButton,
  showZoomInButton,
  showZoomOutButton,
  showSceneModeButton,
  showGeolocationButton,
  showSettingButton,
  showFullscreenButton,
  showDebugButton
} = useToolbarButton(props)

const {
  showGeocodeInput,
  geocodeClick,
  geocodeValue,
  geocodeList,
  geocodeSearch,
  geocodeSelect
} = useGeocode(props, $vc)

const { positionLongitude, positionLatitude, positionHeight, positionClick } =
  usePosition($vc)

const { currentMapId, mapSelected, mapClick } = useMapLayer(props, emit)

const { zoomInClick, zoomOutClick } = useZoom(props, $vc)

const { sceneModeClick, sceneModeChange, currentViewIcon, is25D, is2D, is3D } =
  useSceneMode($vc)

const {
  terrainExaggeration,
  terrainExaggerationChange,
  depthTestAgainstTerrain,
  depthTestAgainstTerrainChange,
  enableLighting,
  enableLightingChange,
  viewerShadows,
  viewerShadowsChange,
  terrainShadows,
  terrainShadowsChange,
  entityShadows,
  entityShadowsChange,
  fxaa,
  fxaaChange
} = useMapSetting($vc)

const { homeClick, geolocationClick, fullscreenClick, debugClick } =
  useToolbarHandle($vc)
</script>

<style lang="less" scoped>
.vc-toolbar {
  position: absolute;
  z-index: 1;
  .toolbar-item {
    position: relative;
    .toolbar-btn {
      width: 32px;
      height: 32px;
      padding: 2px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .toolbar-img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .toolbar-geocoder-input {
      position: absolute;
      right: 32px;
      top: 0;
      width: 200px;
    }
  }
  .scene-mode-25D {
    transform: perspective(5px) scale(1.3) rotateX(6deg);
    transform-origin: bottom;
  }
}
body {
  .overlay-group {
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(0, 0, 0, 0.8);
    border-radius: 6px;
  }
  .overlay-position {
    width: 205px;
    .position-btn {
      margin-top: 10px;
    }
  }
  .overlay-map {
    width: 210px;
    height: 250px;
    overflow-y: auto;
    .map-list {
      display: flex;
      flex-wrap: wrap;
      .map-item {
        flex: 0 0 33.3333%;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .map-img {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          border: 2px solid transparent;
          overflow: hidden;
          &:hover {
            border-color: #fff;
          }
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .map-name {
          text-align: center;
          font-size: 12px;
          margin-top: 2px;
          color: #fff;
        }
      }
    }
  }
  .overlay-setting {
    width: 210px;
    .os-row {
      padding: 5px;
      & + .os-row {
        border-top: 1px solid rgba(0, 0, 0, 0.6);
      }
      &.flex {
        display: flex;
      }
      &.items-center {
        align-items: center;
      }
      &.flex-wrap {
        flex-wrap: wrap;
      }
      .os-label {
        color: #fff;
        padding-right: 5px;
      }
    }
    .shadows-group {
      display: flex;
      flex-wrap: wrap;
      padding-right: 5px;
      padding-bottom: 5px;
    }
  }
}
</style>
