<template>
  <div class="graphics-form">
    <a-form
      :model="formData"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      label-wrap
    >
      <fill-material
        v-model:data="formData"
        @change="fillMaterialChange"
      ></fill-material>

      <a-form-item label="旋转角度">
        <a-row :gutter="10">
          <a-col :span="16">
            <a-slider
              v-model:value="formData.rotation"
              :min="0"
              :max="360"
              class="form-slider"
              @change="attrChange('rotation')"
            />
          </a-col>
          <a-col :span="8">
            <a-input-number
              v-model:value="formData.rotation"
              :min="0"
              :max="360"
              :precision="2"
              class="form-input"
              @change="attrChange('rotation')"
            />
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item label="是否显示边框">
        <a-switch
          v-model:checked="formData.outline"
          class="form-switch"
          @change="outlineChange"
        />
      </a-form-item>
      <template v-if="formData.outline">
        <a-form-item label="边框宽度">
          <a-input-number
            v-model:value="formData.outlineWidth"
            :min="0"
            :precision="0"
            class="form-input"
            @change="outlineChange"
          />
        </a-form-item>
        <a-form-item label="边框颜色">
          <color-picker
            v-model:color="formData.outlineColor"
            :auto="false"
            :hide-copy-btn="true"
            @change="outlineChange"
          ></color-picker>
        </a-form-item>
      </template>
      <a-form-item label="高度">
        <a-input-number
          v-model:value="formData.height"
          :min="0"
          :precision="2"
          class="form-input"
          @change="heightChange"
        />
      </a-form-item>
      <a-form-item label="挤压高度">
        <a-input-number
          v-model:value="formData.extrudedHeight"
          :min="0"
          :precision="2"
          class="form-input"
          @change="heightChange"
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
import { ref, watch, type PropType } from 'vue'
import {
  Form as AForm,
  InputNumber as AInputNumber,
  Slider as ASlider
} from 'ant-design-vue'
import ColorPicker from '../components/color-picker.vue'
import FillMaterial from '../components/fill-material.vue'
import { useAttrsChange } from '../hooks/use-attrs-change'

const emit = defineEmits(['updateAttr'])

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})

const labelCol = ref({ span: 8 })
const wrapperCol = ref({ span: 16 })
const formData = ref<any>({
  show: true,
  // 高度
  height: 0,
  // 相对于地形的位置
  heightReference: 0,
  // 纹理旋转角度
  stRotation: 0,
  // 旋转角度
  rotation: 0,
  // 是否填充
  fill: true,
  // 填充类型
  fillType: 'Color',
  // 填充颜色
  color: '#fff',
  // 材质
  material: '#fff',
  speed: 1,
  count: 1,
  gradient: 0.01,
  image: '/static/material/wall.png',
  // 填充图片
  fillImage: undefined,
  fillImageRepeatX: 1,
  fillImageRepeatY: 1,
  fillImageTransparent: false,
  // 填充网格
  fillGridCellAlpha: 0.1,
  fillGridLineCountX: 8,
  fillGridLineCountY: 8,
  fillGridLineThicknessX: 1,
  fillGridLineThicknessY: 1,
  fillGridLineOffsetX: 0,
  fillGridLineOffsetY: 0,
  // 填充条纹
  fillStripeOrientation: 0,
  fillStripeEvenColor: '#fff',
  fillStripeOddColor: '#000',
  fillStripeOffset: 0,
  fillStripeRepeat: 1,
  // 填充棋盘
  fillCheckerboardEvenColor: '#fff',
  fillCheckerboardOddColor: '#000',
  fillCheckerboardRepeatX: 2,
  fillCheckerboardRepeatY: 2,
  // 是否显示边框
  outline: false,
  // 外边框颜色
  outlineColor: '#000',
  // 外边框大小
  outlineWidth: 1,
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
  fillMaterialChange,
  heightChange,
  outlineChange,
  distanceDisplayConditionChange
} = useAttrsChange(formData, 'rectangle', emit)
</script>

<style lang="less" scoped>
@import '../css/style.less';
</style>
