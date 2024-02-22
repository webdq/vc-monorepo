<template>
  <a-form-item label="是否填充">
    <a-switch
      v-model:checked="formData.fill"
      class="form-switch"
      @change="handleChange('fill')"
    />
  </a-form-item>
  <template v-if="formData.fill">
    <a-form-item label="填充材质">
      <a-select
        v-model:value="formData.fillType"
        class="dark-select"
        @change="handleChange('fillType')"
      >
        <a-select-option
          v-for="item in fillTypeOptions"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</a-select-option
        >
      </a-select>
    </a-form-item>

    <template v-if="showColorFormItem">
      <a-form-item label="颜色">
        <color-picker
          v-model:color="formData.color"
          :auto="false"
          :hide-copy-btn="true"
          @change="handleChange('color')"
        ></color-picker>
      </a-form-item>
    </template>

    <template v-if="showSpeedFormItem">
      <a-form-item label="速度">
        <a-input-number
          v-model:value="formData.speed"
          :min="0"
          :step="0.1"
          :precision="2"
          class="form-input"
          @change="handleChange('speed')"
        />
      </a-form-item>
    </template>
    <template v-if="isCircleWave">
      <a-form-item label="数量">
        <a-input-number
          v-model:value="formData.count"
          :min="0"
          :step="0.1"
          :precision="2"
          class="form-input"
          @change="handleChange('count')"
        />
      </a-form-item>
    </template>
    <template v-if="isCircleWave">
      <a-form-item label="变化率">
        <a-input-number
          v-model:value="formData.gradient"
          :min="0"
          :step="0.1"
          :precision="2"
          class="form-input"
          @change="handleChange('gradient')"
        />
      </a-form-item>
    </template>
    <template v-if="isWallImageTrail || isWallTrail">
      <a-form-item label="图片地址">
        <a-input
          v-model:value="formData.image"
          class="form-input"
          @change="handleChange('image')"
        />
      </a-form-item>
    </template>
    <!-- <template v-if="isWallImageTrail">
      <a-form-item label="图片重复">
        <a-row :gutter="5">
          <a-col span="12">
            <a-input-number
              v-model:value="formData.wallImageTrailRepeatX"
              :min="1"
              :precision="0"
              addon-before="X"
              class="form-input"
              @change="handleChange('wallImageTrailRepeatX')"
            />
          </a-col>
          <a-col span="12">
            <a-input-number
              v-model:value="formData.wallImageTrailRepeatY"
              :min="1"
              :precision="0"
              addon-before="Y"
              class="form-input"
              @change="handleChange('wallImageTrailRepeatY')"
            />
          </a-col>
        </a-row>
      </a-form-item>
    </template> -->

    <template v-if="isFillImage">
      <a-form-item label="图片">
        <a-input
          v-model:value="formData.fillImage"
          class="form-input"
          @change="handleChange('fillImage')"
        />
      </a-form-item>
      <a-form-item label="是否透明">
        <a-switch
          v-model:checked="formData.fillImageTransparent"
          class="form-switch"
          @change="handleChange('fillImageTransparent')"
        />
      </a-form-item>
      <a-form-item label="X重复次数">
        <a-input-number
          v-model:value="formData.fillImageRepeatX"
          :min="0"
          :precision="0"
          class="form-input"
          @change="handleChange('fillImageRepeatX')"
        />
      </a-form-item>
      <a-form-item label="Y重复次数">
        <a-input-number
          v-model:value="formData.fillImageRepeatY"
          :min="0"
          :precision="0"
          class="form-input"
          @change="handleChange('fillImageRepeatY')"
        />
      </a-form-item>
    </template>

    <template v-if="isFillGrid">
      <a-form-item label="透明度">
        <a-row :gutter="10">
          <a-col :span="16">
            <a-slider
              v-model:value="formData.fillGridCellAlpha"
              :min="0"
              :max="1"
              :step="0.1"
              class="form-slider"
              @change="handleChange('fillGridCellAlpha')"
            />
          </a-col>
          <a-col :span="8">
            <a-input-number
              v-model:value="formData.fillGridCellAlpha"
              :min="0"
              :max="1"
              :precision="2"
              :step="0.1"
              class="dark-input"
              @change="handleChange('fillGridCellAlpha')"
            />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="网格数量">
        <a-row :gutter="5">
          <a-col span="12">
            <a-input-number
              v-model:value="formData.fillGridLineCountX"
              :min="0"
              :precision="0"
              addon-before="X"
              class="form-input"
              @change="handleChange('fillGridLineCountX')"
            />
          </a-col>
          <a-col span="12">
            <a-input-number
              v-model:value="formData.fillGridLineCountY"
              :min="0"
              :precision="0"
              addon-before="Y"
              class="form-input"
              @change="handleChange('fillGridLineCountY')"
            />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="网格宽度">
        <a-row :gutter="5">
          <a-col span="12">
            <a-input-number
              v-model:value="formData.fillGridLineThicknessX"
              :min="0"
              :precision="0"
              addon-before="X"
              class="form-input"
              @change="handleChange('fillGridLineThicknessX')"
            />
          </a-col>
          <a-col span="12">
            <a-input-number
              v-model:value="formData.fillGridLineThicknessY"
              :min="0"
              :precision="0"
              addon-before="Y"
              class="form-input"
              @change="handleChange('fillGridLineThicknessY')"
            />
          </a-col>
        </a-row>
      </a-form-item>
      <!-- <a-form-item label="网格偏移量">
            <a-row :gutter="5">
              <a-col span="12">
                <a-input-number
                  v-model:value="formData.fillGridLineOffsetX"
                  :min="0"
                  :precision="0"
                  addon-before="X"
                  class="form-input"
                  @change="handleChange('fillGridLineOffsetX')"
                />
              </a-col>
              <a-col span="12">
                <a-input-number
                  v-model:value="formData.fillGridLineOffsetY"
                  :min="0"
                  :precision="0"
                  addon-before="Y"
                  class="form-input"
                  @change="handleChange('fillGridLineOffsetY')"
                />
              </a-col>
            </a-row>
          </a-form-item> -->
    </template>

    <template v-if="isFillStripe">
      <a-form-item label="主色">
        <color-picker
          v-model:color="formData.fillStripeEvenColor"
          :auto="false"
          :hide-copy-btn="true"
          @change="handleChange('fillStripeEvenColor')"
        ></color-picker>
      </a-form-item>
      <a-form-item label="衬色">
        <color-picker
          v-model:color="formData.fillStripeOddColor"
          :auto="false"
          :hide-copy-btn="true"
          @change="handleChange('fillStripeOddColor')"
        ></color-picker>
      </a-form-item>
      <a-form-item label="重复次数">
        <a-input-number
          v-model:value="formData.fillStripeRepeat"
          :min="0"
          :precision="0"
          class="form-input"
          @change="handleChange('fillStripeRepeat')"
        />
      </a-form-item>
      <!-- <a-form-item label="偏移量">
            <a-input-number
              v-model:value="formData.fillStripeOffset"
              :min="0"
              :precision="2"
              class="form-input"
              @change="handleChange('fillStripeOffset')"
            />
          </a-form-item> -->
      <a-form-item label="方向">
        <a-switch
          v-model:checked="formData.fillStripeOrientation"
          :checked-value="1"
          :un-checked-value="0"
          checked-children="垂直"
          un-checked-children="水平"
          class="form-switch"
          @change="handleChange('fillStripeOrientation')"
        />
      </a-form-item>
    </template>

    <template v-if="isFillCheckerboard">
      <a-form-item label="主色">
        <color-picker
          v-model:color="formData.fillCheckerboardEvenColor"
          :auto="false"
          :hide-copy-btn="true"
          @change="handleChange('fillCheckerboardEvenColor')"
        ></color-picker>
      </a-form-item>
      <a-form-item label="衬色">
        <color-picker
          v-model:color="formData.fillCheckerboardOddColor"
          :auto="false"
          :hide-copy-btn="true"
          @change="handleChange('fillCheckerboardOddColor')"
        ></color-picker>
      </a-form-item>
      <a-form-item label="重复次数">
        <a-row :gutter="5">
          <a-col span="12">
            <a-input-number
              v-model:value="formData.fillCheckerboardRepeatX"
              :min="0"
              :precision="0"
              addon-before="X"
              class="form-input"
              @change="handleChange('fillCheckerboardRepeatX')"
            />
          </a-col>
          <a-col span="12">
            <a-input-number
              v-model:value="formData.fillCheckerboardRepeatY"
              :min="0"
              :precision="0"
              addon-before="Y"
              class="form-input"
              @change="handleChange('fillCheckerboardRepeatY')"
            />
          </a-col>
        </a-row>
      </a-form-item>
    </template>

    <a-form-item label="填充方向">
      <a-row :gutter="10">
        <a-col :span="16">
          <a-slider
            v-model:value="formData.stRotation"
            :min="0"
            :max="360"
            class="form-slider"
            @change="handleChange('stRotation')"
          />
        </a-col>
        <a-col :span="8">
          <a-input-number
            v-model:value="formData.stRotation"
            :min="0"
            :max="360"
            :precision="2"
            class="form-input"
            @change="handleChange('stRotation')"
          />
        </a-col>
      </a-row>
    </a-form-item>
  </template>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { PropType } from 'vue'
import {
  Form as AForm,
  Select as ASelect,
  InputNumber as AInputNumber,
  Slider as ASlider
} from 'ant-design-vue'
import ColorPicker from './color-picker.vue'
import { fillTypeOptions } from '../hooks/use-select-options'

const AFormItem = AForm.Item

const emit = defineEmits(['update:data', 'change'])

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})

const formData = ref<any>({})

const isFillColor = computed(() => formData.value.fillType === 'Color')
const isFillImage = computed(() => formData.value.fillType === 'Image')
const isFillGrid = computed(() => formData.value.fillType === 'Grid')
const isFillStripe = computed(() => formData.value.fillType === 'Stripe')
const isFillCheckerboard = computed(
  () => formData.value.fillType === 'Checkerboard'
)
const isCircleBlur = computed(() => formData.value.fillType === 'CircleBlur')
const isCircleDiffuse = computed(
  () => formData.value.fillType === 'CircleDiffuse'
)
const isCircleFade = computed(() => formData.value.fillType === 'CircleFade')
const isCirclePulse = computed(() => formData.value.fillType === 'CirclePulse')
const isCircleScan = computed(() => formData.value.fillType === 'CircleScan')
const isCircleSpiral = computed(
  () => formData.value.fillType === 'CircleSpiral'
)
const isCircleVary = computed(() => formData.value.fillType === 'CircleVary')
const isCircleWave = computed(() => formData.value.fillType === 'CircleWave')
const isEllipsoidElectric = computed(
  () => formData.value.fillType === 'EllipsoidElectric'
)
const isEllipsoidTrail = computed(
  () => formData.value.fillType === 'EllipsoidTrail'
)
const isRadarLine = computed(() => formData.value.fillType === 'RadarLine')
const isRadarScan = computed(() => formData.value.fillType === 'RadarScan')
const isRadarSweep = computed(() => formData.value.fillType === 'RadarSweep')
const isRadarWave = computed(() => formData.value.fillType === 'RadarWave')
const isWallImageTrail = computed(
  () => formData.value.fillType === 'WallImageTrail'
)
const isWallTrail = computed(() => formData.value.fillType === 'WallTrail')

const showColorFormItem = computed(
  () =>
    isFillColor.value ||
    isFillGrid.value ||
    isCircleBlur.value ||
    isCircleBlur.value ||
    isCircleDiffuse.value ||
    isCircleFade.value ||
    isCirclePulse.value ||
    isCircleScan.value ||
    isCircleSpiral.value ||
    isCircleVary.value ||
    isCircleWave.value ||
    isEllipsoidElectric.value ||
    isEllipsoidTrail.value ||
    isRadarLine.value ||
    isRadarScan.value ||
    isRadarSweep.value ||
    isRadarWave.value ||
    isWallImageTrail.value ||
    isWallTrail.value
)
const showSpeedFormItem = computed(
  () =>
    isCircleBlur.value ||
    isCircleBlur.value ||
    isCircleDiffuse.value ||
    isCircleFade.value ||
    isCirclePulse.value ||
    isCircleScan.value ||
    isCircleSpiral.value ||
    isCircleVary.value ||
    isCircleWave.value ||
    isEllipsoidElectric.value ||
    isEllipsoidTrail.value ||
    isRadarLine.value ||
    isRadarScan.value ||
    isRadarSweep.value ||
    isRadarWave.value ||
    isWallImageTrail.value ||
    isWallTrail.value
)

watch(
  () => props.data,
  (val) => {
    formData.value = { ...formData.value, ...val }
  },
  {
    immediate: true,
    deep: true
  }
)

const handleChange = (key: string) => {
  emit('update:data', formData.value)
  emit('change', key)
}
</script>

<style lang="less" scoped></style>
