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
      <a-form-item label="宽度">
        <a-input-number
          v-model:value="formData.width"
          :min="1"
          :precision="0"
          class="form-input"
          @change="attrChange('width')"
        />
      </a-form-item>
      <a-form-item label="高度">
        <a-input-number
          v-model:value="formData.height"
          :min="1"
          :precision="0"
          class="form-input"
          @change="attrChange('height')"
        />
      </a-form-item>
      <a-form-item label="图片">
        <div class="icon-image-row">
          <img :src="formData.image" width="30" height="30" />
          <mark-icon
            v-model:iconUrl="formData.image"
            :mark-icon-images="markIconImages"
            @change="attrChange('image')"
          ></mark-icon>
        </div>
      </a-form-item>
      <a-form-item label="缩放">
        <a-input-number
          v-model:value="formData.scale"
          :min="1"
          :precision="2"
          class="form-input"
          @change="attrChange('scale')"
        />
      </a-form-item>
      <a-form-item label="颜色">
        <color-picker
          v-model:color="formData.color"
          :auto="false"
          :hide-copy-btn="true"
          @change="attrChange('color')"
        ></color-picker>
      </a-form-item>
      <a-form-item label="像素偏移(像素)">
        <a-row :gutter="5">
          <a-col span="12">
            <a-input-number
              v-model:value="formData.pixelOffsetX"
              :precision="0"
              addon-before="X"
              class="form-input"
              @change="pixelOffsetChange('billboard')"
            />
          </a-col>
          <a-col span="12">
            <a-input-number
              v-model:value="formData.pixelOffsetY"
              :precision="0"
              addon-before="Y"
              class="form-input"
              @change="pixelOffsetChange('billboard')"
            />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="视点偏移(米)">
        <a-row :gutter="5">
          <a-col span="8">
            <a-input-number
              v-model:value="formData.eyeOffsetX"
              :precision="2"
              addon-before="X"
              class="form-input"
              @change="eyeOffsetChange('billboard')"
            />
          </a-col>
          <a-col span="8">
            <a-input-number
              v-model:value="formData.eyeOffsetY"
              :precision="2"
              addon-before="Y"
              class="form-input"
              @change="eyeOffsetChange('billboard')"
            />
          </a-col>
          <a-col span="8">
            <a-input-number
              v-model:value="formData.eyeOffsetZ"
              :precision="2"
              addon-before="Z"
              class="form-input"
              @change="eyeOffsetChange('billboard')"
            />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="水平对齐">
        <a-select
          v-model:value="formData.horizontalOrigin"
          class="form-select"
          @change="attrChange('horizontalOrigin')"
        >
          <a-select-option
            v-for="item in horizontalOriginOptions"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="垂直对齐">
        <a-select
          v-model:value="formData.verticalOrigin"
          class="form-select"
          @change="attrChange('verticalOrigin')"
        >
          <a-select-option
            v-for="item in verticalOriginOptions"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="旋转">
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
      <a-form-item label="尺寸以米为单位">
        <a-switch
          v-model:checked="formData.sizeInMeters"
          class="form-switch"
          @change="attrChange('sizeInMeters')"
        />
      </a-form-item>

      <a-form-item label="是否按视距缩放">
        <a-switch
          v-model:checked="formData.isScaleByDistance"
          class="form-switch"
          @change="scaleByDistanceChange"
        />
      </a-form-item>
      <template v-if="formData.isScaleByDistance">
        <a-form-item label="上限">
          <a-input-number
            v-model:value="formData.scaleByDistanceFar"
            :min="0"
            :precision="2"
            addon-after="米"
            class="form-input"
            @change="scaleByDistanceChange"
          />
        </a-form-item>
        <a-form-item label="比例值">
          <a-input-number
            v-model:value="formData.scaleByDistanceFarValue"
            :min="0"
            :precision="2"
            class="form-input"
            @change="scaleByDistanceChange"
          />
        </a-form-item>
        <a-form-item label="下限">
          <a-input-number
            v-model:value="formData.scaleByDistanceNear"
            :min="0"
            :precision="2"
            addon-after="米"
            class="form-input"
            @change="scaleByDistanceChange"
          />
        </a-form-item>
        <a-form-item label="比例值">
          <a-input-number
            v-model:value="formData.scaleByDistanceNearValue"
            :min="0"
            :precision="2"
            class="form-input"
            @change="scaleByDistanceChange"
          />
        </a-form-item>
      </template>
      <a-form-item label="是否按视距透明">
        <a-switch
          v-model:checked="formData.isTranslucencyByDistance"
          class="form-switch"
          @change="translucencyByDistanceChange"
        />
      </a-form-item>
      <template v-if="formData.isTranslucencyByDistance">
        <a-form-item label="上限">
          <a-input-number
            v-model:value="formData.translucencyByDistanceFar"
            :min="0"
            :precision="2"
            addon-after="米"
            class="form-input"
            @change="translucencyByDistanceChange"
          />
        </a-form-item>
        <a-form-item label="比例值">
          <a-input-number
            v-model:value="formData.translucencyByDistanceFarValue"
            :min="0"
            :precision="2"
            class="form-input"
            @change="translucencyByDistanceChange"
          />
        </a-form-item>
        <a-form-item label="下限">
          <a-input-number
            v-model:value="formData.translucencyByDistanceNear"
            :min="0"
            :precision="2"
            addon-after="米"
            class="form-input"
            @change="translucencyByDistanceChange"
          />
        </a-form-item>
        <a-form-item label="比例值">
          <a-input-number
            v-model:value="formData.translucencyByDistanceNearValue"
            :min="0"
            :precision="2"
            class="form-input"
            @change="translucencyByDistanceChange"
          />
        </a-form-item>
      </template>
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
  Select as ASelect,
  InputNumber as AInputNumber,
  Slider as ASlider
} from 'ant-design-vue'
import ColorPicker from '../components/color-picker.vue'
import MarkIcon from '../components/mark-icon.vue'
import {
  horizontalOriginOptions,
  verticalOriginOptions
} from '../hooks/use-select-options'
import { useAttrsChange } from '../hooks/use-attrs-change'
import { MarkIconImage } from '../graphics-attr'

const emit = defineEmits(['updateAttr'])

const props = defineProps({
  markIconImages: {
    type: Array as PropType<MarkIconImage[]>,
    default: () => []
  },
  data: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})

const labelCol = ref({ span: 8 })
const wrapperCol = ref({ span: 16 })
const formData = ref<any>({
  show: true,
  // 图片地址
  image: '',
  // 缩放
  scale: 1,
  // 像素偏移
  pixelOffsetX: 0,
  pixelOffsetY: 0,
  // 位置偏移
  eyeOffsetX: 0,
  eyeOffsetY: 0,
  eyeOffsetZ: 0,
  // 水平对齐
  horizontalOrigin: 0,
  // 垂直对齐
  verticalOrigin: 0,
  // 相对于地形的位置
  heightReference: 0,
  // 旋转度数
  rotation: 0,
  // 按米计算尺寸
  sizeInMeters: false,
  // 宽度
  width: 30,
  // 高度
  height: 30,
  // 颜色
  color: '#fff',
  // 是否按视距缩放
  isScaleByDistance: false,
  scaleByDistance: undefined,
  scaleByDistanceNear: 1000,
  scaleByDistanceNearValue: 1,
  scaleByDistanceFar: 1000000,
  scaleByDistanceFarValue: 0.1,
  // 是否按视距透明
  isTranslucencyByDistance: false,
  translucencyByDistance: undefined,
  translucencyByDistanceNear: 1000,
  translucencyByDistanceNearValue: 1,
  translucencyByDistanceFar: 1000000,
  translucencyByDistanceFarValue: 0.1,
  // 是否按视距显示
  isDistanceDisplayCondition: false,
  distanceDisplayCondition: undefined,
  distanceDisplayConditionNear: 0,
  distanceDisplayConditionFar: 100000,
  // 禁用深度检测
  disableDepthTestDistance: undefined
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
  pixelOffsetChange,
  eyeOffsetChange,
  attrChange,
  scaleByDistanceChange,
  translucencyByDistanceChange,
  distanceDisplayConditionChange
} = useAttrsChange(formData, 'billboard', emit)
</script>

<style lang="less" scoped>
@import '../css/style.less';
</style>
