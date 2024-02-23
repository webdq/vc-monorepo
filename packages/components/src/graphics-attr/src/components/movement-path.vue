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
        <div class="entity-wrapper">
          <a-list
            :grid="{ gutter: 10, column: 2 }"
            :data-source="entityList"
            class="entity-list"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-card
                  size="small"
                  class="entity-card"
                  :class="item.id === mpData.pathId ? 'active' : ''"
                  @click="cardClick(item.id)"
                >
                  <div>id：{{ item.id }}</div>
                  <div>类型：{{ item.type }}</div>
                  <div>名称：{{ item.name }}</div>
                  <div>文字：{{ item.text }}</div>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-label">
        <div class="setting-label-title">路径坐标</div>
        <div class="setting-label-action">
          <a-space>
            <a-switch v-model:checked="mpData.showPath" class="form-switch" />
          </a-space>
        </div>
      </div>
      <div class="setting-control">
        <div class="ae-pos-list">
          <div
            v-for="(item, index) in mpData.degress"
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
                  size="small"
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
                  size="small"
                  placeholder="纬度"
                  class="form-input"
                />
              </div>
              <div class="ae-pos-item">
                <a-input-number
                  v-model:value="item.height"
                  :controls="false"
                  size="small"
                  placeholder="高度"
                  class="form-input"
                />
              </div>
            </div>
            <div class="ae-pos-action">
              <a-space :size="5">
                <a-button
                  size="small"
                  class="ae-pos-btn"
                  @click="addPosition(index)"
                >
                  <template #icon>
                    <vertical-align-top-outlined />
                  </template>
                </a-button>
                <a-button
                  size="small"
                  class="ae-pos-btn"
                  @click="addPosition(index + 1)"
                >
                  <template #icon>
                    <vertical-align-bottom-outlined />
                  </template>
                </a-button>
                <a-button
                  size="small"
                  class="ae-pos-btn"
                  @click="removePosition(index)"
                >
                  <template #icon>
                    <minus-outlined />
                  </template>
                </a-button>
              </a-space>
            </div>
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
              v-model:value="mpData.startDate"
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
            <span class="ae-end-date">{{ stopDateString }}</span>
          </div>
        </div>

        <div class="setting-grid">
          <div class="setting-grid-label">速度：</div>
          <div class="setting-grid-control">
            <a-input-number
              v-model:value="mpData.speed"
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
import { ref, computed, onMounted } from 'vue'
import type { PropType } from 'vue'
import {
  message,
  Space as ASpace,
  Button as AButton,
  InputNumber as AInputNumber,
  DatePicker as ADatePicker,
  List as AList,
  Card as ACard,
  Switch as ASwitch
} from 'ant-design-vue'
import {
  CheckCircleOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  MinusOutlined
} from '@ant-design/icons-vue'
import {
  measureLine,
  cartesianToDegreesArray,
  degreesToCartesianArray
} from '../utils'
import dayjs from 'dayjs'
import { useVueCesium } from 'vue-cesium'
import { useModel } from '../hooks/use-model'

const AListItem = AList.Item

const emit = defineEmits([
  'update:data',
  'saveClick',
  'previewClick',
  'removeClick'
])
const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})

const mpData = useModel(props, 'data', emit)

const $vc = useVueCesium()
const entityList = ref<any[]>([])
const cardClick = async (id: string) => {
  const readyObj = await $vc.creatingPromise
  const viewer = readyObj.viewer
  mpData.value.pathId = id
  const entity = viewer.entities.getById(id)
  const graphics = entity?.properties?.graphics?._value
  if (graphics) {
    const positions = cartesianToDegreesArray(graphics.positions)
    mpData.value.degress = positions
    mpData.value.showPath = graphics.entity.show
  }
}
const getEntityList = async () => {
  const readyObj = await $vc.creatingPromise
  const viewer = readyObj.viewer
  const list = viewer.entities.values
    .filter((item) => {
      const graphics = item.properties?.graphics?._value
      return graphics?.type === 'polyline'
    })
    .map((item) => {
      const id = item.id ?? ''
      const type = (item as any)?.type ?? ''
      const name = item.name ?? ''
      const text = item?.label?.text?.getValue(Cesium.JulianDate.now()) ?? ''
      const label = `id: ${id} 类型: ${type} 文字: ${text} 名称: ${name}`
      return {
        id,
        type,
        name,
        text,
        label
      }
    })
  entityList.value = list
}

onMounted(async () => {
  await getEntityList()
})

// 结束日期字符串
const stopDateString = computed(() => {
  if (!mpData.value.stopDate) return ''
  const date = dayjs(mpData.value.stopDate)
  return date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : ''
})

// 点击添加坐标
const addPosition = (index: number) => {
  mpData.value.degress.splice(index, 0, {
    longitude: undefined,
    latitude: undefined,
    height: undefined
  })
}
// 点击删除坐标
const removePosition = (index: number) => {
  mpData.value.degress.splice(index, 1)
}
// 检查坐标点
const checkPositions = () => {
  const { degress } = mpData.value
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
  const { startDate, speed, degress } = mpData.value
  const date1 = dayjs(startDate)
  if (!startDate) {
    message.warning('请输入开始时间')
    return false
  }
  if (!date1.isValid()) {
    message.warning('开始时间无效')
    return false
  }
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
  mpData.value.stopDate = d.format('YYYY-MM-DD HH:mm:ss')
  return true
}
// 验证保存的数据
const validateData = () => {
  const validPositions = checkPositions()
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
