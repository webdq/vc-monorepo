<template>
  <div class="color-picker">
    <a-popover v-model:visible="visible" trigger="click">
      <template #content>
        <ColorPicker
          :color="color"
          :visible-formats="visibleFormats"
          :default-format="defaultFormat"
          :alpha-channel="alphaChannel"
          :class="{ 'hide-copy-btn': hideCopyBtn }"
          @color-change="updateColor"
        >
          <template #hue-range-input-label>
            <span class="visually-hidden">色相</span>
          </template>

          <template #alpha-range-input-label>
            <span class="visually-hidden">透明度</span>
          </template>

          <template #copy-button>
            <copy-outlined />
          </template>

          <template #format-switch-button>
            <swap-outlined />
          </template>
        </ColorPicker>
        <div v-if="!auto" class="btn-wrapper">
          <a-space>
            <a-button type="primary" @click="okClick">确定</a-button>
            <a-button type="default" @click="cancelClick">取消</a-button>
          </a-space>
        </div>
      </template>
      <a-button class="selected-color-wrapper">
        <div class="selected-color-bg">
          <span class="selected-color" :style="selectedColorStyle"></span>
        </div>
      </a-button>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import {
  Button as AButton,
  Space as ASpace,
  Popover as APopover
} from 'ant-design-vue'
import { CopyOutlined, SwapOutlined } from '@ant-design/icons-vue'
import { ColorPicker } from 'vue-accessible-color-picker'
import type {
  VisibleColorFormat,
  AlphaChannelProp,
  ColorChangeDetail
} from 'vue-accessible-color-picker'

const emit = defineEmits(['update:color', 'color-change', 'change'])

const props = defineProps({
  auto: {
    type: Boolean,
    default: true
  },
  hideCopyBtn: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#ffffffff'
  },
  visibleFormats: {
    type: Array as PropType<VisibleColorFormat[]>,
    default: () => ['hex', 'hsl', 'hwb', 'rgb']
  },
  defaultFormat: {
    type: String as PropType<VisibleColorFormat>,
    default: 'rgb'
  },
  alphaChannel: {
    type: String as PropType<AlphaChannelProp>,
    default: 'show'
  }
})

const visible = ref(false)
const color = ref<string>(props.color)
const cssColor = ref<string>(props.color)
const selectedColorStyle = computed(() => {
  return {
    background: cssColor.value
  }
})
watch(
  () => props.color,
  (val) => {
    color.value = val
    cssColor.value = val
  }
)
const updateColor = (eventData: ColorChangeDetail) => {
  cssColor.value = eventData.cssColor
  if (props.auto) {
    emit('update:color', cssColor.value)
    emit('change', cssColor.value)
  }
  emit('color-change', eventData)
}
const okClick = () => {
  emit('update:color', cssColor.value)
  emit('change', cssColor.value)
  visible.value = false
}
const cancelClick = () => {
  visible.value = false
}
</script>

<style>
@import url('vue-accessible-color-picker/styles');
</style>
<style lang="less" scoped>
body {
  .vacp-color-picker {
    --vacp-width-color-space: 240px;
    &.hide-copy-btn {
      .vacp-copy-button {
        display: none;
      }
    }
  }
}
.btn-wrapper {
  margin-top: 20px;
  text-align: center;
}
.visually-hidden {
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  white-space: nowrap;
}
.color-picker {
  .selected-color-wrapper {
    padding: 6px;
    height: 34px;
    .selected-color-bg {
      width: 100px;
      height: 20px;
      border: 1px solid #ddd;
      background-image: linear-gradient(
          45deg,
          #ccc 25%,
          transparent 25%,
          transparent 75%,
          #ccc 75%,
          #ccc
        ),
        linear-gradient(
          45deg,
          #ccc 25%,
          transparent 25%,
          transparent 75%,
          #ccc 75%,
          #ccc
        );
      background-size: 10px 10px;
      background-position:
        0 0,
        5px 5px;
      .selected-color {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
