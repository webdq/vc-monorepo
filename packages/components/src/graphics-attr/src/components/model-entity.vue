<template>
  <div class="graphics-form model-entity-wrapper">
    <div class="setting-group">
      <div class="setting-label">模型位置</div>
      <div class="setting-control">
        <div class="setting-grid">
          <div class="setting-grid-label">经度：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="position.longitude"
              :min="-180"
              :max="180"
              :precision="10"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">纬度：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="position.latitude"
              :min="-90"
              :max="90"
              :precision="10"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">高度：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="position.height"
              :precision="2"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-label">模型初始姿态</div>
      <div class="setting-control">
        <div class="setting-grid">
          <div class="setting-grid-label">偏航角：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="orientation.heading"
              :min="-180"
              :max="180"
              :precision="2"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">俯仰角：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="orientation.pitch"
              :min="-180"
              :max="180"
              :precision="2"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">翻滚角：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="orientation.roll"
              :min="-180"
              :max="180"
              :precision="2"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-label">视角</div>
      <div class="setting-control">
        <div class="setting-grid">
          <div class="setting-grid-label">显示视角：</div>
          <div class="setting-grid-control">
            <a-switch
              v-model:checked="frustum.show"
              :un-checked-value="false"
              :checked-value="true"
              class="form-switch"
            />
          </div>
        </div>

        <!-- <div class="setting-grid">
          <div class="setting-grid-label">X轴偏移：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.offsetX"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">Y轴偏移：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.offsetY"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">Z轴偏移：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.offsetZ"
              :controls="false"
              class="form-input"
            />
          </div>
        </div> -->

        <div class="setting-grid">
          <div class="setting-grid-label">视场的角度(FOV)：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.fov"
              :min="0"
              :max="179"
              :precision="0"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">近平面的距离：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.near"
              :min="0"
              :precision="2"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">远平面的距离：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.far"
              :min="0"
              :precision="2"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <!-- <div class="setting-grid">
          <div class="setting-grid-label">x方向上的偏移量：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.xOffset"
              :controls="false"
              class="form-input"
            />
          </div>
        </div> -->

        <!-- <div class="setting-grid">
          <div class="setting-grid-label">y方向上的偏移量：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.yOffset"
              :controls="false"
              class="form-input"
            />
          </div>
        </div> -->

        <div class="setting-grid">
          <div class="setting-grid-label">偏航角：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.heading"
              :min="-180"
              :max="180"
              :precision="2"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">俯仰角：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.pitch"
              :min="-180"
              :max="180"
              :precision="2"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">翻滚角：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.roll"
              :min="-180"
              :max="180"
              :precision="2"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">视锥宽度：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.aspectWidth"
              :min="0"
              :precision="2"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">视锥高度：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="frustum.aspectHeight"
              :min="0"
              :precision="2"
              :controls="false"
              class="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useModel } from '../hooks/use-model'

const emit = defineEmits([
  'update:frustumData',
  'update:modelPositionData',
  'update:modelOrientationData'
])
const props = defineProps({
  frustumData: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  modelPositionData: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  modelOrientationData: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})

const frustum = useModel(props, 'frustumData', emit)
const position = useModel(props, 'modelPositionData', emit)
const orientation = useModel(props, 'modelOrientationData', emit)
</script>

<style lang="less" scoped>
@import '../css/style.less';
</style>
