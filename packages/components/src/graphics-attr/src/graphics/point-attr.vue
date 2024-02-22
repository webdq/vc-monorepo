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
      <a-form-item label="大小">
        <a-input-number
          v-model:value="formData.pixelSize"
          :min="1"
          :precision="0"
          class="form-input"
          @change="attrChange('pixelSize')"
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
      <a-form-item label="边框宽度">
        <a-input-number
          v-model:value="formData.outlineWidth"
          :min="0"
          :precision="0"
          class="form-input"
          @change="attrChange('outlineWidth')"
        />
      </a-form-item>
      <a-form-item label="边框颜色">
        <color-picker
          v-model:color="formData.outlineColor"
          :auto="false"
          :hide-copy-btn="true"
          @change="attrChange('outlineColor')"
        ></color-picker>
      </a-form-item>
      <a-form-item label="是否贴地">
        <a-switch
          v-model:checked="formData.heightReference"
          :un-checked-value="0"
          :checked-value="1"
          class="form-switch"
          @change="attrChange('heightReference')"
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
import { Form as AForm, InputNumber as AInputNumber } from 'ant-design-vue'
import ColorPicker from '../components/color-picker.vue'
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
  // 大小
  pixelSize: 1,
  // 相对于地形的位置
  heightReference: 0,
  // 颜色
  color: '#fff',
  // 外边框颜色
  outlineColor: '#000',
  // 外边框大小
  outlineWidth: 0,
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
  attrChange,
  scaleByDistanceChange,
  translucencyByDistanceChange,
  distanceDisplayConditionChange
} = useAttrsChange(formData, 'point', emit)
</script>

<style lang="less" scoped>
@import '../css/style.less';
</style>
