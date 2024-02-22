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
            <a-button type="default" class="ae-btn" @click="previewClick">
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
    </div>

    <div class="setting-group">
      <div class="setting-label">信号线连接</div>
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
                  :class="slData.entityIds.includes(item.id) ? 'active' : ''"
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
      <div class="setting-label">时速设置</div>
      <div class="setting-control">
        <div class="setting-grid">
          <div class="setting-grid-label">开始时间：</div>
          <div class="setting-grid-control">
            <a-date-picker
              v-model:value="slData.startDate"
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
              v-model:value="slData.stopDate"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              show-time
              class="form-date-picker"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import {
  message,
  Space as ASpace,
  Button as AButton,
  DatePicker as ADatePicker,
  List as AList,
  Card as ACard
} from 'ant-design-vue'
import {
  CheckCircleOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { useVueCesium } from 'vue-cesium'
import { useModel } from '../hooks/use-model'

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

const slData = useModel(props, 'data', emit)

const $vc = useVueCesium()
const entityList = ref<any[]>([])
const cardClick = (id: string) => {
  const index = slData.value.entityIds.findIndex((item: string) => item === id)
  if (index > -1) {
    slData.value.entityIds.splice(index, 1)
  } else {
    slData.value.entityIds.push(id)
  }
}
const getEntityList = async () => {
  const readyObj = await $vc.creatingPromise
  const viewer = readyObj.viewer
  const list = viewer.entities.values.map((item) => {
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

// 检查时间
const checkDate = () => {
  const { startDate, stopDate } = slData.value
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
const checkSignalLine = () => {
  if (slData.value.entityIds.length < 1) {
    message.warning('请选择信号线连接实体')
    return false
  }
  return true
}
// 验证保存的数据
const validateData = () => {
  const validSignalLine = checkSignalLine()
  const validDate = checkDate()
  return validSignalLine && validDate
}

// 保存
const saveClick = () => {
  const valid = validateData()
  if (!valid) return
  emit('saveClick')
}
// 保存并预览
const previewClick = () => {
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
