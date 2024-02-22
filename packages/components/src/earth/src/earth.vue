<template>
  <div
    ref="earthRef"
    class="vc-earth"
    :class="{
      showAnimation: animation,
      showTimeline: timeline,
      compassDisable: compassDisable
    }"
  >
    <vc-config-provider :cesium-path="cesiumPath" :access-token="accessToken">
      <vc-viewer
        ref="viewerRef"
        :show-credit="showCredit"
        :selection-indicator="selectionIndicator"
        :info-box="infoBox"
        :animation="animation"
        :timeline="timeline"
        :should-animate="shouldAnimate"
        :home-button="homeButton"
        :scene-mode-picker="sceneModePicker"
        :fullscreen-button="fullscreenButton"
        :geocoder="geocoder"
        :remove-cesium-script="removeCesiumScript"
        @ready="onViewerReady"
      >
        <template v-if="isAMap">
          <vc-layer-imagery v-if="showMapLabel" :sort-order="20">
            <vc-imagery-provider-amap
              map-style="8"
              ltype="0"
              v-bind="{ ...labelConfig }"
            ></vc-imagery-provider-amap>
          </vc-layer-imagery>
          <vc-layer-imagery :sort-order="10">
            <vc-imagery-provider-amap
              map-style="6"
              ltype="0"
              v-bind="{ ...mapConfig }"
            ></vc-imagery-provider-amap>
          </vc-layer-imagery>
        </template>

        <template v-if="isBaiduMap">
          <vc-layer-imagery>
            <vc-imagery-provider-baidu
              map-style="img"
              ak="E4805d16520de693a3fe707cdc962045"
              v-bind="{ ...mapConfig }"
            ></vc-imagery-provider-baidu>
          </vc-layer-imagery>
        </template>

        <template v-if="isTencentMap">
          <vc-layer-imagery>
            <vc-imagery-provider-tencent
              map-style="img"
              style-id="1"
              v-bind="{ ...mapConfig }"
            ></vc-imagery-provider-tencent>
          </vc-layer-imagery>
        </template>

        <template v-if="isTiandituMap">
          <vc-layer-imagery v-if="showMapLabel" :sort-order="20">
            <vc-imagery-provider-tianditu
              map-style="cva_c"
              token="436ce7e50d27eede2f2929307e6b33c0"
              v-bind="{ ...labelConfig }"
            ></vc-imagery-provider-tianditu>
          </vc-layer-imagery>
          <vc-layer-imagery :sort-order="10">
            <vc-imagery-provider-tianditu
              map-style="img_c"
              token="436ce7e50d27eede2f2929307e6b33c0"
              v-bind="{ ...mapConfig }"
            ></vc-imagery-provider-tianditu>
          </vc-layer-imagery>
        </template>

        <template v-if="isBingMap">
          <vc-layer-imagery>
            <vc-imagery-provider-bing
              bm-key="AmGu3cvB_g1HbkQErEyvmLc9j0YIGWS7IdOqR7-hQbO8J92Fzrzkhy_bYKSsyoEx"
              map-style="AerialWithLabels"
              v-bind="{ ...mapConfig }"
            ></vc-imagery-provider-bing>
          </vc-layer-imagery>
        </template>

        <template v-if="isTmsMap">
          <vc-layer-imagery>
            <vc-imagery-provider-tms
              v-bind="{ ...mapConfig }"
            ></vc-imagery-provider-tms>
          </vc-layer-imagery>
        </template>

        <vc-terrain-provider-cesium
          v-if="terrain"
          :url="terrainUrl"
          :request-vertex-normals="requestVertexNormals"
          :request-water-mask="requestWaterMask"
          :request-metadata="requestMetadata"
        ></vc-terrain-provider-cesium>

        <div
          v-if="drawings"
          ref="drawingsWrapperRef"
          :style="drawingsStyle"
          class="drawings-wrapper"
        >
          <vc-drawings
            ref="drawingsRef"
            :position="drawingsPosition"
            :offset="drawingsOffset"
            :mode="drawingsMode"
            :drawings="drawingsBtnName"
            :active-color="drawingsActiveColor"
            :editable="drawingsEditable"
            :clamp-to-ground="drawingsClampToGround"
            :main-fab-opts="drawingsMainFabOpts"
            :fab-action-opts="drawingsFabActionOpts"
            :pin-action-opts="drawingsPinActionOpts"
            :pin-drawing-opts="drawingsPinDrawingOpts"
            :point-drawing-opts="drawingsPointDrawingOpts"
            :point-action-opts="drawingsPointActionOpts"
            :polyline-drawing-opts="drawingsPolylineDrawingOpts"
            :polyline-action-opts="drawingsPolylineActionOpts"
            :polygon-drawing-opts="drawingsPolygonDrawingOpts"
            :polygon-action-opts="drawingsPolygonActionOpts"
            :rectang-drawing-opts="drawingsRectangleDrawingOpts"
            :rectang-action-opts="drawingsRectangleActionOpts"
            :circle-drawing-opts="drawingsCircleDrawingOpts"
            :circle-action-opts="drawingsCircleActionOpts"
            :regular-drawing-opts="drawingsRegularDrawingOpts"
            :regular-action-opts="drawingsRegularActionOpts"
            :clear-action-opts="drawingsClearActionOpts"
            @draw-evt="drawingsDrawEvt"
            @editor-evt="drawingsEditorEvt"
            @mouse-evt="drawingsMouseEvt"
            @active-evt="drawingsActiveEvt"
            @clear-evt="drawingsClearEvt"
          >
            <template #body>
              <div class="drawing-btn-wrapper">
                <div
                  v-if="drawingsMoveBar"
                  ref="drawingsMoveBarRef"
                  class="drawing-move-bar"
                >
                  <slot
                    v-if="$slots['drawings-move-bar']"
                    name="drawings-move-bar"
                  ></slot>
                  <span v-else>标绘</span>
                </div>
                <div class="drawing-btn-group">
                  <a-tooltip
                    v-for="item in drawingsBtnList"
                    :key="item.name"
                    :title="item.tip"
                    placement="right"
                  >
                    <a-button
                      :class="[
                        'drawing-btn',
                        drawingsBtnActiveName === item.name
                          ? 'drawing-btn-active'
                          : ''
                      ]"
                      @click="drawingsBtnToggle(item.name)"
                    >
                      <slot
                        v-if="$slots[`drawings-icon-${item.name}`]"
                        :name="`drawings-icon-${item.name}`"
                      ></slot>
                      <vc-icon v-else :name="item.icon"></vc-icon>
                    </a-button>
                  </a-tooltip>
                </div>
              </div>
            </template>
          </vc-drawings>
        </div>

        <div
          v-if="measurements"
          ref="measurementsWrapperRef"
          :style="measurementsStyle"
          class="measurements-wrapper"
        >
          <vc-measurements
            ref="measurementsRef"
            :position="measurementsPosition"
            :offset="measurementsOffset"
            :show="measurementsShow"
            :mode="measurementsMode"
            :measurements="measurementsBtnName"
            :active-color="measurementsActiveColor"
            :editable="measurementsEditable"
            :main-fab-opts="measurementsMainFabOpts"
            :fab-action-opts="measurementsFabActionOpts"
            :distance-action-opts="measurementsDistanceActionOpts"
            :distance-measurement-opts="measurementsDistanceMeasurementOpts"
            :component-distance-action-opts="
              measurementsComponentDistanceActionOpts
            "
            :component-distance-measurement-opts="
              measurementsComponentDistanceMeasurementOpts
            "
            :polyline-action-opts="measurementsPolylineActionOpts"
            :polyline-measurement-opts="measurementsPolylineMeasurementOpts"
            :horizontal-action-opts="measurementsHorizontalActionOpts"
            :horizontal-measurement-opts="measurementsHorizontalMeasurementOpts"
            :vertical-action-opts="measurementsVerticalActionOpts"
            :vertical-measurement-opts="measurementsVerticalMeasurementOpts"
            :height-action-opts="measurementsHeightActionOpts"
            :height-measurement-opts="measurementsHeightMeasurementOpts"
            :area-action-opts="measurementsAreaActionOpts"
            :area-measurement-opts="measurementsAreaMeasurementOpts"
            :point-action-opts="measurementsPointActionOpts"
            :point-measurement-opts="measurementsPointMeasurementOpts"
            :rectangle-action-opts="measurementsRectangleActionOpts"
            :rectangle-measurement-opts="measurementsRectangleMeasurementOpts"
            :circle-action-opts="measurementsCircleActionOpts"
            :circle-measurement-opts="measurementsCircleMeasurementOpts"
            :regular-action-opts="measurementsRegularActionOpts"
            :regular-measurement-opts="measurementsRegularMeasurementOpts"
            :clear-action-opts="measurementsClearActionOpts"
            @draw-evt="measurementsDrawEvt"
            @editor-evt="measurementsEditorEvt"
            @mouse-evt="measurementsMouseEvt"
            @active-evt="measurementsActiveEvt"
            @clear-evt="measurementsClearEvt"
          >
            <template #body>
              <div class="drawing-btn-wrapper">
                <div
                  v-if="measurementsMoveBar"
                  ref="measurementsMoveBarRef"
                  class="drawing-move-bar"
                >
                  <slot
                    v-if="$slots['measurements-move-bar']"
                    name="measurements-move-bar"
                  ></slot>
                  <span v-else>量算</span>
                </div>
                <div class="drawing-btn-group">
                  <a-tooltip
                    v-for="item in measurementsBtnList"
                    :key="item.name"
                    :title="item.tip"
                    placement="right"
                  >
                    <a-button
                      :class="[
                        'drawing-btn',
                        measurementsBtnActiveName === item.name
                          ? 'drawing-btn-active'
                          : ''
                      ]"
                      @click="measurementsBtnToggle(item.name)"
                    >
                      <slot
                        v-if="$slots[`measurements-icon-${item.name}`]"
                        :name="`measurements-icon-${item.name}`"
                      ></slot>
                      <vc-icon v-else :name="item.icon"></vc-icon>
                    </a-button>
                  </a-tooltip>
                </div>
              </div>
            </template>
          </vc-measurements>
        </div>

        <div v-if="compass" :style="compassStyle" class="compass-wrapper">
          <vc-compass
            :teleport-to-viewer="false"
            v-bind="{ ...compassOpts }"
          ></vc-compass>
          <div class="compass-mask"></div>
        </div>

        <div
          v-if="statusbar || distance"
          :style="statusbarElStyle"
          class="statusbar-wrapper"
        >
          <vc-status-bar
            v-if="statusbar"
            :teleport-to-viewer="false"
            v-bind="{ ...statusbarOpts }"
          ></vc-status-bar>
          <vc-distance-legend
            v-if="distance"
            :teleport-to-viewer="false"
            v-bind="{ ...distanceOpts }"
          ></vc-distance-legend>
        </div>

        <slot></slot>
      </vc-viewer>
    </vc-config-provider>
  </div>
</template>

<script setup lang="ts">
import type { VcReadyObject } from 'vue-cesium/es/utils/types'
import {
  VcConfigProvider,
  VcViewer,
  VcLayerImagery,
  VcImageryProviderAmap,
  VcImageryProviderBaidu,
  VcImageryProviderTencent,
  VcImageryProviderTianditu,
  VcImageryProviderBing,
  VcImageryProviderTms,
  VcTerrainProviderCesium,
  VcCompass,
  VcStatusBar,
  VcDistanceLegend,
  VcDrawings,
  VcMeasurements,
  VcIcon
} from 'vue-cesium'
import { Button as AButton, Tooltip as ATooltip } from 'ant-design-vue'
import { earthProps, earthEmits } from './earth'
import { useEarth } from './hooks/use-earth'
import { useMap } from './hooks/use-map'
import { useDrawings } from './hooks/use-drawings'
import { useMeasurements } from './hooks/use-measurements'
import { useElDraggable } from './hooks/use-el-draggable'

defineOptions({
  name: 'VcEarth'
})

const emit = defineEmits(earthEmits)

const props = defineProps(earthProps)

const {
  earthRef,
  viewerRef,
  compassOpts,
  statusbarOpts,
  distanceOpts,
  statusbarElStyle
} = useEarth(props)

const {
  mapConfig,
  labelConfig,
  showMapLabel,
  isAMap,
  isBaiduMap,
  isTencentMap,
  isTiandituMap,
  isBingMap,
  isTmsMap
} = useMap(props)

const {
  drawingsBtnActiveName,
  drawingsBtnList,
  drawingsBtnName,
  drawingsBtnToggle,
  drawingsWrapperRef,
  drawingsMoveBarRef,
  drawingsRef,
  drawingsDrawEvt,
  drawingsEditorEvt,
  drawingsMouseEvt,
  drawingsActiveEvt,
  drawingsClearEvt
} = useDrawings(props, emit)

// 标绘组件拖拽
const { style: drawingsStyle } = useElDraggable(
  earthRef,
  drawingsWrapperRef,
  drawingsMoveBarRef,
  props.drawingsLeft,
  props.drawingsTop
)

const {
  measurementsBtnActiveName,
  measurementsBtnList,
  measurementsBtnName,
  measurementsBtnToggle,
  measurementsWrapperRef,
  measurementsMoveBarRef,
  measurementsRef,
  measurementsDrawEvt,
  measurementsEditorEvt,
  measurementsMouseEvt,
  measurementsActiveEvt,
  measurementsClearEvt
} = useMeasurements(props, emit)

// 量算组件拖拽
const { style: measurementsStyle } = useElDraggable(
  earthRef,
  measurementsWrapperRef,
  measurementsMoveBarRef,
  props.measurementsLeft,
  props.measurementsTop
)

// 视图加载完毕
const onViewerReady = (readyObj: VcReadyObject) => {
  emit('viewer-ready', readyObj)
}
</script>

<style lang="less" scoped>
.vc-earth {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  --drawing-bar-bg-color: rgba(4, 92, 217, 0.7);
  --drawing-btn-bg-color: rgba(0, 0, 0, 0.6);
  .drawings-wrapper {
    position: absolute;
    z-index: 1;
  }
  .measurements-wrapper {
    position: absolute;
    z-index: 1;
  }
  .drawing-btn-wrapper {
    border: 1px solid var(--drawing-bar-bg-color);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    width: 30px;
    .drawing-move-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      min-height: 35px;
      padding: 2px;
      background-color: var(--drawing-bar-bg-color);
      color: #fff;
      border: 0;
      border-radius: 0;
      font-size: 12px;
      text-align: center;
      cursor: move;
    }
    .drawing-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 30px;
      padding: 4px;
      background-color: var(--drawing-btn-bg-color);
      color: #fff;
      border: 0;
      border-radius: 0;
      font-size: 16px;
      & + .drawing-btn {
        border-top: 1px solid var(--drawing-bar-bg-color);
      }
      &.drawing-btn-active {
        background-color: var(--drawing-bar-bg-color);
      }
    }
  }
  .compass-wrapper {
    position: absolute;
    z-index: 1;
    .compass-mask {
      display: none;
      background: transparent;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 1002;
      cursor: not-allowed;
    }
    :deep(.vc-compass) {
      .vc-btn:before {
        box-shadow: none;
      }
    }
  }
  .statusbar-wrapper {
    position: absolute;
    z-index: 1;
    display: flex;
    justify-content: center;
    background: rgba(0, 0, 0, 0.8);
    :deep(.vc-status-bar) {
      margin-top: 0;
      margin-right: 0;
      background-color: transparent !important;
    }
    :deep(.vc-distance-legend) {
      margin-top: 0;
      margin-right: 0;
      background-color: transparent !important;
    }
  }
  &.showTimeline {
    :deep(.vc-location-other-controls) {
      bottom: 30px;
    }
  }
  &.showAnimation {
    :deep(.vc-location-other-controls) {
      left: 175px;
    }
  }
  &.compassDisable {
    .compass-wrapper {
      .compass-mask {
        display: block;
      }
    }
  }

  :deep(.vc-drawings-container) {
    position: unset;
  }
  :deep(.cesium-viewer-timelineContainer) {
    right: 0 !important;
  }
  :deep(.cesium-viewer-cesiumInspectorContainer) {
    top: 50px;
    right: 85px;
    .cesium-cesiumInspector-visible {
      width: 210px;
    }
  }
  :deep(.cesium-viewer-cesium3DTilesInspectorContainer) {
    top: 50px;
    right: 305px;
  }
}
</style>
