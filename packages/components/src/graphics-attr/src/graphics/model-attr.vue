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
      <a-form-item label="模型地址">
        <a-input
          v-model:value="formData.uri"
          class="form-input"
          @change="attrChange('uri')"
        />
      </a-form-item>
      <a-form-item label="缩放比例">
        <a-input-number
          v-model:value="formData.scale"
          :min="1"
          :precision="2"
          class="form-input"
          @change="attrChange('scale')"
        />
      </a-form-item>
      <a-form-item label="最小像素大小">
        <a-input-number
          v-model:value="formData.minimumPixelSize"
          :min="0"
          :precision="0"
          class="form-input"
          @change="attrChange('minimumPixelSize')"
        />
      </a-form-item>
      <a-form-item label="最大缩放比例">
        <a-input-number
          v-model:value="formData.maximumScale"
          :min="1"
          :precision="2"
          class="form-input"
          @change="attrChange('maximumScale')"
        />
      </a-form-item>
      <!-- <a-form-item label="增量加载纹理">
          <a-switch
            v-model:checked="formData.incrementallyLoadTextures"
            :unCheckedValue="false"
            :checkedValue="true"
            class="form-switch"
            @change="attrChange('incrementallyLoadTextures')"
          />
        </a-form-item> -->
      <!-- <a-form-item label="运行gltf动画">
          <a-switch
            v-model:checked="formData.runAnimations"
            :unCheckedValue="false"
            :checkedValue="true"
            class="form-switch"
            @change="attrChange('runAnimations')"
          />
        </a-form-item> -->
      <!-- <a-form-item label="glTF动画在没有关键帧的持续时间内保持最后一个姿势">
          <a-switch
            v-model:checked="formData.clampAnimations"
            :unCheckedValue="false"
            :checkedValue="true"
            class="form-switch"
            @change="attrChange('clampAnimations')"
          />
        </a-form-item> -->
      <a-form-item label="阴影模式">
        <a-select
          v-model:value="formData.shadows"
          class="form-select"
          @change="attrChange('shadows')"
        >
          <a-select-option
            v-for="item in shadowsOptions"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</a-select-option
          >
        </a-select>
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
      <a-form-item label="模型边框颜色">
        <color-picker
          v-model:color="formData.silhouetteColor"
          :auto="false"
          :hide-copy-btn="true"
          @change="attrChange('silhouetteColor')"
        ></color-picker>
      </a-form-item>
      <a-form-item label="模型边框大小">
        <a-input-number
          v-model:value="formData.silhouetteSize"
          :min="0"
          :precision="0"
          class="form-input"
          @change="attrChange('silhouetteSize')"
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
      <a-form-item label="颜色混合模式">
        <a-select
          v-model:value="formData.colorBlendMode"
          class="form-select"
          @change="attrChange('colorBlendMode')"
        >
          <a-select-option
            v-for="item in colorBlendModeOptions"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="混合强度">
        <a-input-number
          v-model:value="formData.colorBlendAmount"
          :min="0"
          :max="1"
          :step="0.1"
          class="form-input"
          @change="attrChange('colorBlendAmount')"
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
  Select as ASelect,
  InputNumber as AInputNumber
} from 'ant-design-vue'
import ColorPicker from '../components/color-picker.vue'
import {
  shadowsOptions,
  colorBlendModeOptions
} from '../hooks/use-select-options'
import { useAttrsChange } from '../hooks/use-attrs-change'

const ASelectOption = ASelect.Option

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
  // 模型 url
  uri: '',
  // 放大比例
  scale: 1,
  // 用于指定模型的最小像素大小，而不考虑缩放
  minimumPixelSize: 0,
  // 模型最大比例尺大小.
  // 在这个比例尺内模型模型大小缩放受minimumPixelSize限制，
  // 超过这个比例尺，不受minimumPixelSize限制
  maximumScale: undefined,
  // 设置在加载模型后纹理是否可以继续流入
  incrementallyLoadTextures: true,
  // 是否启动模型中指定的gltf动画
  runAnimations: true,
  // 指定glTF动画是否应在没有关键帧的持续时间内保持最后一个姿势
  clampAnimations: true,
  // 从每个光源投射或接收阴影的模式
  // DISABLED = 0, ENABLED = 1, CAST_ONLY = 2, RECEIVE_ONLY = 3
  shadows: 0,
  // 相对于地形的位置
  // NONE = 0, CLAMP_TO_GROUND = 1, RELATIVE_TO_GROUND = 2
  heightReference: 0,
  // 指定的模型边框颜色 Color
  silhouetteColor: '#FF0000',
  // 边框大小（像素）
  silhouetteSize: 0,
  // 颜色
  color: '#fff',
  // 指定颜色混合模式
  // HIGHLIGHT = 0, REPLACE = 1, MIX = 2
  colorBlendMode: 0,
  // 混合模式的强度值 范围0-1
  colorBlendAmount: 0.5,
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

const { attrChange, distanceDisplayConditionChange } = useAttrsChange(
  formData,
  'model',
  emit
)
</script>

<style lang="less" scoped>
@import '../css/style.less';
</style>
