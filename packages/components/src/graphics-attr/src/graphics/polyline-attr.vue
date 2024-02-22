<template>
  <div class="graphics-form">
    <a-form
      :model="formData"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      label-wrap
    >
      <a-form-item label="是否显示">
        <a-switch
          v-model:checked="formData.show"
          class="form-switch"
          @change="attrChange('show')"
        />
      </a-form-item>
      <a-form-item label="线型">
        <a-select
          v-model:value="formData.polylineType"
          class="form-select"
          @change="polylineTypeChange"
        >
          <a-select-option
            v-for="item in polylineTypeOptions"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="线宽">
        <a-input-number
          v-model:value="formData.width"
          :min="1"
          :precision="0"
          class="form-input"
          @change="attrChange('width')"
        />
      </a-form-item>
      <a-form-item label="颜色">
        <color-picker
          v-model:color="formData.color"
          :auto="false"
          :hide-copy-btn="true"
          @change="polylineTypeChange"
        ></color-picker>
      </a-form-item>
      <template v-if="isDash">
        <a-form-item label="虚线长度">
          <a-input-number
            v-model:value="formData.dashLength"
            :min="0"
            :precision="2"
            class="form-input"
            @change="polylineTypeChange"
          />
        </a-form-item>
        <a-form-item label="虚线样式">
          <a-input-number
            v-model:value="formData.dashPattern"
            :min="0"
            :precision="2"
            class="form-input"
            @change="polylineTypeChange"
          />
        </a-form-item>
      </template>
      <template v-if="isOutline">
        <a-form-item label="外边框宽度">
          <a-input-number
            v-model:value="formData.outlineWidth"
            :min="0"
            :precision="0"
            class="form-input"
            @change="polylineTypeChange"
          />
        </a-form-item>
        <a-form-item label="外边框颜色">
          <color-picker
            v-model:color="formData.outlineColor"
            :auto="false"
            :hide-copy-btn="true"
            @change="polylineTypeChange"
          ></color-picker>
        </a-form-item>
      </template>
      <template v-if="isGlow">
        <a-form-item label="发光强度">
          <a-input-number
            v-model:value="formData.glowPower"
            :min="0"
            :step="0.1"
            :precision="2"
            class="form-input"
            @change="polylineTypeChange"
          />
        </a-form-item>
        <a-form-item label="效果强度">
          <a-input-number
            v-model:value="formData.taperPower"
            :min="0"
            :step="0.1"
            :precision="2"
            class="form-input"
            @change="polylineTypeChange"
          />
        </a-form-item>
      </template>
      <template
        v-if="
          isPolylineFlicker ||
          isPolylineFlow ||
          isPolylineImageTrail ||
          isPolylineLightingTrail ||
          isPolylineTrail
        "
      >
        <a-form-item label="速度">
          <a-input-number
            v-model:value="formData.speed"
            :min="0"
            :step="0.1"
            :precision="2"
            class="form-input"
            @change="polylineTypeChange"
          />
        </a-form-item>
      </template>
      <template v-if="isPolylineFlow">
        <a-form-item label="百分比">
          <a-input-number
            v-model:value="formData.percent"
            :min="0"
            :step="0.1"
            :precision="2"
            class="form-input"
            @change="polylineTypeChange"
          />
        </a-form-item>
        <a-form-item label="变化率">
          <a-input-number
            v-model:value="formData.gradient"
            :min="0"
            :step="0.1"
            :precision="2"
            class="form-input"
            @change="polylineTypeChange"
          />
        </a-form-item>
      </template>
      <template v-if="isPolylineImageTrail || isPolylineLightingTrail">
        <a-form-item label="图片地址">
          <a-input
            v-model:value="formData.image"
            class="form-input"
            @change="polylineTypeChange"
          />
        </a-form-item>
        <!-- <a-form-item label="图片重复">
          <a-row :gutter="5">
            <a-col span="12">
              <a-input-number
                v-model:value="formData.repeat.x"
                :min="1"
                :precision="0"
                addon-before="X"
                class="form-input"
                @change="polylineTypeChange"
              />
            </a-col>
            <a-col span="12">
              <a-input-number
                v-model:value="formData.repeat.y"
                :min="1"
                :precision="0"
                addon-before="Y"
                class="form-input"
                @change="polylineTypeChange"
              />
            </a-col>
          </a-row>
        </a-form-item> -->
      </template>

      <a-form-item label="是否闭合">
        <a-switch
          v-model:checked="formData.loop"
          class="form-switch"
          @change="loopChange"
        />
      </a-form-item>
      <a-form-item label="是否贴地">
        <a-switch
          v-model:checked="formData.clampToGround"
          class="form-switch"
          @change="attrChange('clampToGround')"
        />
      </a-form-item>
      <a-form-item label="是否按视距显示">
        <a-switch
          v-model:checked="formData.isDistanceDisplayCondition"
          class="form-switch"
          @change="distanceDisplayConditionChange"
        />
      </a-form-item>
      <template v-if="formData.isDistanceDisplayCondition">
        <a-form-item label="上限">
          <a-input-number
            v-model:value="formData.distanceDisplayConditionFar"
            :min="0"
            :precision="2"
            addon-after="米"
            class="form-input"
            @change="distanceDisplayConditionChange"
          />
        </a-form-item>
        <a-form-item label="下限">
          <a-input-number
            v-model:value="formData.distanceDisplayConditionNear"
            :min="0"
            :precision="2"
            addon-after="米"
            class="form-input"
            @change="distanceDisplayConditionChange"
          />
        </a-form-item>
      </template>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, type PropType } from 'vue'
import {
  Form as AForm,
  Select as ASelect,
  InputNumber as AInputNumber
} from 'ant-design-vue'
import ColorPicker from '../components/color-picker.vue'
import { polylineTypeOptions } from '../hooks/use-select-options'
import { useAttrsChange } from '../hooks/use-attrs-change'

const ASelectOption = ASelect.Option

const emit = defineEmits(['updateAttr'])

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})

const isDash = computed(() => formData.value.polylineType === 'PolylineDash')
const isOutline = computed(
  () => formData.value.polylineType === 'PolylineOutline'
)
const isGlow = computed(() => formData.value.polylineType === 'PolylineGlow')
const isPolylineFlicker = computed(
  () => formData.value.polylineType === 'PolylineFlicker'
)
const isPolylineFlow = computed(
  () => formData.value.polylineType === 'PolylineFlow'
)
const isPolylineImageTrail = computed(
  () => formData.value.polylineType === 'PolylineImageTrail'
)
const isPolylineLightingTrail = computed(
  () => formData.value.polylineType === 'PolylineLightingTrail'
)
const isPolylineTrail = computed(
  () => formData.value.polylineType === 'PolylineTrail'
)

const labelCol = ref({ span: 8 })
const wrapperCol = ref({ span: 16 })
const formData = ref<any>({
  show: true,
  // 线形
  polylineType: 'Color',
  // 线宽
  width: 1,
  // 材质
  material: '#fff',
  // 颜色
  color: '#fff',
  // 虚线的长度
  dashLength: 16,
  // 虚线的样式
  dashPattern: 255,
  // 外边框颜色
  outlineColor: '#000',
  // 外边框宽度
  outlineWidth: 1,
  // 发光强度
  glowPower: 0.25,
  // 效果强度
  taperPower: 1,
  // 速度
  speed: 1,
  // 百分比
  percent: 0.03,
  // 变化率
  gradient: 0.1,
  // 线条图片地址
  image: '/static/material/line.png',
  // 线条图片重复
  repeat: {
    x: 1,
    y: 1
  },
  // 是否闭合
  loop: false,
  // 是否贴地
  clampToGround: false,
  // 是否按视距显示
  isDistanceDisplayCondition: false,
  distanceDisplayCondition: undefined,
  distanceDisplayConditionNear: 0,
  distanceDisplayConditionFar: 100000
})

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

const {
  attrChange,
  polylineTypeChange,
  loopChange,
  distanceDisplayConditionChange
} = useAttrsChange(formData, 'polyline', emit)
</script>

<style lang="less" scoped>
@import '../css/style.less';
</style>
