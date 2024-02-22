<template>
  <div class="graphics-form">
    <div class="setting-group">
      <div class="setting-label">
        <div class="ae-btn-wrapper">
          <a-space>
            <a-button type="default" class="ae-btn" @click="saveClick">
              <template #icon><check-circle-outlined /></template>
              <span>保存</span>
            </a-button>
            <a-button type="default" class="ae-btn" @click="playClick">
              <template #icon><play-circle-outlined /></template>
              <span>保存并预览</span>
            </a-button>
            <a-button type="default" class="ae-btn" @click="removeClick">
              <template #icon><close-circle-outlined /></template>
              <span>删除</span>
            </a-button>
          </a-space>
        </div>
      </div>
      <div class="setting-control">
        <div class="ae-type-wrapper">
          <div class="ae-type-label">动画效果：</div>
          <a-select
            v-model:value="aeData.type"
            :options="animationTypeOptions"
            class="form-select ae-type-select"
          ></a-select>
        </div>
      </div>
    </div>

    <div v-if="showDisplacement" class="setting-group">
      <div class="setting-label">
        <div class="setting-label-title">运动路线</div>
        <div class="setting-label-action">
          <a-button-group>
            <a-tooltip>
              <template #title>添加坐标</template>
              <a-button
                type="default"
                class="ae-action-btn"
                @click="addPosition"
              >
                <template #icon><plus-outlined /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip>
              <template #title>清空坐标</template>
              <a-button
                type="default"
                class="ae-action-btn"
                @click="clearPosition"
              >
                <template #icon><delete-outlined /></template>
              </a-button>
            </a-tooltip>
          </a-button-group>
        </div>
      </div>
      <div class="setting-control">
        <div class="ae-pos-list">
          <div
            v-for="(item, index) in aeData.degress"
            :key="index"
            class="ae-pos-row"
          >
            <div class="ae-pos-name">点位{{ index + 1 }}：</div>
            <div class="ae-pos-group">
              <div class="ae-pos-item">
                <a-input-number
                  v-model:value="item.longitude"
                  :min="-180"
                  :max="180"
                  :controls="false"
                  placeholder="经度"
                  class="form-input"
                />
              </div>
              <div class="ae-pos-item">
                <a-input-number
                  v-model:value="item.latitude"
                  :min="-90"
                  :max="90"
                  :controls="false"
                  placeholder="纬度"
                  class="form-input"
                />
              </div>
              <div class="ae-pos-item">
                <a-input-number
                  v-model:value="item.height"
                  :controls="false"
                  placeholder="高度"
                  class="form-input"
                />
              </div>
            </div>
            <div class="ae-pos-action">
              <a-button
                class="ae-pos-remove-btn"
                @click="removePosition(index)"
              >
                <template #icon><minus-outlined /></template>
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showFlashColor" class="setting-group">
      <div class="setting-label">闪烁颜色</div>
      <div class="setting-control">
        <div class="setting-grid">
          <div class="setting-grid-label">颜色1：</div>
          <div class="setting-grid-color">
            <color-picker
              v-model:color="aeData.flashColor1"
              :auto="false"
              :hide-copy-btn="true"
            ></color-picker>
          </div>

          <div class="setting-grid-label">颜色2：</div>
          <div class="setting-grid-color">
            <color-picker
              v-model:color="aeData.flashColor2"
              :auto="false"
              :hide-copy-btn="true"
            ></color-picker>
          </div>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-label">时速设置</div>
      <div class="setting-control">
        <div class="setting-grid">
          <div class="setting-grid-label">开始时间：</div>
          <div class="setting-grid-control">
            <a-date-picker
              v-model:value="aeData.startDate"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              show-time
              class="form-date-picker"
            />
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">结束时间：</div>
          <div class="setting-grid-control">
            <a-date-picker
              v-if="showEndDatePicker"
              v-model:value="aeData.stopDate"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              show-time
              class="form-date-picker"
            />
            <span v-else class="ae-end-date">{{ stopDateString }}</span>
          </div>
        </div>

        <div v-if="showDisplacement" class="setting-grid">
          <div class="setting-grid-label">速度：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="aeData.speed"
              :min="0"
              :controls="false"
              addon-after="km/h"
              class="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import {
  message,
  Space as ASpace,
  Button as AButton,
  Select as ASelect,
  ButtonGroup as AButtonGroup,
  Tooltip as ATooltip,
  InputNumber as AInputNumber,
  DatePicker as ADatePicker
} from 'ant-design-vue'
import {
  CheckCircleOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  MinusOutlined
} from '@ant-design/icons-vue'
import ColorPicker from './color-picker.vue'
import { measureLine, degreesToCartesianArray } from '../utils'
import dayjs from 'dayjs'
import { useModel } from '../hooks/use-model'

const emit = defineEmits([
  'update:data',
  'saveClick',
  'previewClick',
  'removeClick'
])
const props = defineProps({
  graphicsType: {
    type: String,
    default: 'point'
  },
  data: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})

const aeData = useModel(props, 'data', emit)

// 动画效果选项
const animationTypeOptions = computed(() => {
  // todo 给其他标绘元素添加动画效果
  if (props.graphicsType === 'model') {
    return [
      { label: '闪烁', value: 'flash' },
      // { label: '位移', value: 'displacement' },
      { label: '淡入淡出', value: 'fade' }
    ]
  }
  if (
    props.graphicsType === 'attackArrow' ||
    props.graphicsType === 'doubleArrow' ||
    props.graphicsType === 'fineArrow' ||
    props.graphicsType === 'gatheringPlace' ||
    props.graphicsType === 'tailedAttackArrow'
  ) {
    return [
      { label: '闪烁', value: 'flash' },
      { label: '生长', value: 'grow' },
      { label: '淡入淡出', value: 'fade' }
    ]
  }
  return [
    { label: '闪烁', value: 'flash' },
    { label: '淡入淡出', value: 'fade' }
  ]
})
// 是否显示位移
const showDisplacement = computed(() => aeData.value.type === 'displacement')
// 是否显示结束时间选择器
const showEndDatePicker = computed(() => aeData.value.type !== 'displacement')
// 是否显示闪烁颜色
const showFlashColor = computed(() => aeData.value.type === 'flash')
// 结束日期字符串
const stopDateString = computed(() => {
  if (!aeData.value.stopDate) return ''
  const date = dayjs(aeData.value.stopDate)
  return date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : ''
})

// 点击添加坐标
const addPosition = () => {
  aeData.value.degress.push({
    longitude: undefined,
    latitude: undefined,
    height: undefined
  })
}
// 点击清空坐标
const clearPosition = () => {
  aeData.value.degress = []
}
// 点击删除坐标
const removePosition = (index: number) => {
  aeData.value.degress.splice(index, 1)
}
// 检查坐标点
const checkPositions = () => {
  const { degress } = aeData.value
  const len = degress.length
  if (len < 1) {
    message.warning('坐标数量最少2个')
    return false
  }
  for (let i = 0; i < len; i++) {
    const { longitude, latitude, height } = degress[i]
    if (longitude === null || longitude === undefined) {
      message.warning(`点位${i + 1}：经度不能为空`)
      return false
    }
    if (latitude === null || latitude === undefined) {
      message.warning(`点位${i + 1}：纬度不能为空`)
      return false
    }
    if (height === null || height === undefined) {
      message.warning(`点位${i + 1}：高度不能为空`)
      return false
    }
  }
  return true
}
// 检查时间
const checkDate = () => {
  const { startDate, stopDate, speed, degress } = aeData.value
  const date1 = dayjs(startDate)
  const date2 = dayjs(stopDate)
  if (!startDate) {
    message.warning('请输入开始时间')
    return false
  }
  if (!date1.isValid()) {
    message.warning('开始时间无效')
    return false
  }

  if (showDisplacement.value) {
    if (speed === undefined || speed === null) {
      message.warning('请输入速度')
      return false
    }
    if (speed <= 0) {
      message.warning('速度必须大于0')
      return false
    }
    const positions = degreesToCartesianArray(degress)
    const len = measureLine(positions)
    const a = (len * 0.001) / speed
    const d = date1.add(a, 'h')
    if (!d.isValid()) {
      message.warning('结束时间无效')
      return false
    }
    aeData.value.stopDate = d.format('YYYY-MM-DD HH:mm:ss')
    return true
  }

  if (!stopDate) {
    message.warning('请输入结束时间')
    return false
  }
  if (!date2.isValid()) {
    message.warning('结束时间无效')
    return false
  }
  const t = date2.valueOf() - date1.valueOf()
  if (t < 0) {
    message.warning('结束时间不能小于开始时间')
    return false
  }
  return true
}
// 验证保存的数据
const validateData = () => {
  const validPositions = showDisplacement.value ? checkPositions() : true
  const validDate = checkDate()
  return validPositions && validDate
}

// 保存
const saveClick = () => {
  const valid = validateData()
  if (!valid) return
  emit('saveClick')
}
// 保存并预览
const playClick = () => {
  const valid = validateData()
  if (!valid) return
  emit('previewClick')
}
// 删除动画
const removeClick = () => {
  emit('removeClick')
}
</script>

<style lang="less" scoped>
@import '../css/style.less';
</style>
