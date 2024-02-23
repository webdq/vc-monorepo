<template>
  <div class="graphics-form">
    <a-form
      :model="formData"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      label-wrap
    >
      <a-form-item label="显示文字">
        <a-switch
          v-model:checked="formData.show"
          class="form-switch"
          @change="attrChange('show')"
        />
      </a-form-item>
      <a-form-item label="文字内容">
        <a-input
          v-model:value="formData.text"
          class="form-input"
          @change="attrChange('text')"
        />
      </a-form-item>
      <a-form-item label="字体大小">
        <a-input
          v-model:value="formData.font"
          class="form-input"
          @change="attrChange('font')"
        />
      </a-form-item>
      <!-- <a-form-item label="样式">
        <a-select
          v-model:value="formData.style"
          class="form-select"
          @change="attrChange('style')"
        >
          <a-select-option
            v-for="item in labelStyleOptions"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</a-select-option
          >
        </a-select>
      </a-form-item> -->
      <a-form-item label="缩放比例">
        <a-input-number
          v-model:value="formData.scale"
          :min="1"
          :precision="2"
          class="form-input"
          @change="attrChange('scale')"
        />
      </a-form-item>
      <a-form-item label="显示背景色">
        <a-switch
          v-model:checked="formData.showBackground"
          class="form-switch"
          @change="attrChange('showBackground')"
        />
      </a-form-item>
      <a-form-item label="背景色">
        <color-picker
          v-model:color="formData.backgroundColor"
          :auto="false"
          :hide-copy-btn="true"
          @change="attrChange('backgroundColor')"
        ></color-picker>
      </a-form-item>
      <a-form-item label="背景框边距">
        <a-row :gutter="5">
          <a-col span="12">
            <a-input-number
              v-model:value="formData.backgroundPaddingX"
              :min="0"
              :precision="0"
              addon-before="X"
              class="form-input"
              @change="backgroundPaddingChange('label')"
            />
          </a-col>
          <a-col span="12">
            <a-input-number
              v-model:value="formData.backgroundPaddingY"
              :min="0"
              :precision="0"
              addon-before="Y"
              class="form-input"
              @change="backgroundPaddingChange('label')"
            />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="像素偏移(像素)">
        <a-row :gutter="5">
          <a-col span="12">
            <a-input-number
              v-model:value="formData.pixelOffsetX"
              :precision="0"
              addon-before="X"
              class="form-input"
              @change="pixelOffsetChange('label')"
            />
          </a-col>
          <a-col span="12">
            <a-input-number
              v-model:value="formData.pixelOffsetY"
              :precision="0"
              addon-before="Y"
              class="form-input"
              @change="pixelOffsetChange('label')"
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
              @change="eyeOffsetChange('label')"
            />
          </a-col>
          <a-col span="8">
            <a-input-number
              v-model:value="formData.eyeOffsetY"
              :precision="2"
              addon-before="Y"
              class="form-input"
              @change="eyeOffsetChange('label')"
            />
          </a-col>
          <a-col span="8">
            <a-input-number
              v-model:value="formData.eyeOffsetZ"
              :precision="2"
              addon-before="Z"
              class="form-input"
              @change="eyeOffsetChange('label')"
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
      <a-form-item label="是否贴地">
        <a-switch
          v-model:checked="formData.heightReference"
          :un-checked-value="0"
          :checked-value="1"
          class="form-switch"
          @change="attrChange('heightReference')"
        />
      </a-form-item>
      <a-form-item label="颜色">
        <color-picker
          v-model:color="formData.fillColor"
          :auto="false"
          :hide-copy-btn="true"
          @change="attrChange('fillColor')"
        ></color-picker>
      </a-form-item>
      <a-form-item label="边框颜色">
        <color-picker
          v-model:color="formData.outlineColor"
          :auto="false"
          :hide-copy-btn="true"
          @change="attrChange('outlineColor')"
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
  Row as ARow,
  Col as ACol,
  Select as ASelect,
  Input as AInput,
  InputNumber as AInputNumber,
  Switch as ASwitch
} from 'ant-design-vue'
import ColorPicker from '../components/color-picker.vue'
import {
  // labelStyleOptions,
  horizontalOriginOptions,
  verticalOriginOptions
} from '../hooks/use-select-options'
import { useAttrsChange } from '../hooks/use-attrs-change'

const AFormItem = AForm.Item
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
  // 文字内容
  text: '',
  // 字体大小
  font: '30px sans-serif',
  // 字体样式
  style: 0,
  // 缩放
  scale: 1,
  // 显示背景色
  showBackground: false,
  // 背景色
  backgroundColor: '#000',
  // 背景框边距
  backgroundPaddingX: 7,
  backgroundPaddingY: 5,
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
  // 字体颜色
  fillColor: '#fff',
  // 边框颜色
  outlineColor: '#000',
  // 边框宽度
  outlineWidth: 1,
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
  backgroundPaddingChange,
  eyeOffsetChange,
  attrChange,
  scaleByDistanceChange,
  translucencyByDistanceChange,
  distanceDisplayConditionChange
} = useAttrsChange(formData, 'label', emit)
</script>

<style lang="less" scoped>
@import '../css/style.less';
</style>
