<template>
  <a-popover
    v-model:visible="visible"
    :destroy-tooltip-on-hide="false"
    trigger="click"
  >
    <template #content>
      <div class="mark-icon">
        <a-input-search
          v-model:value.trim="searchValue"
          placeholder="请输入关键字"
          class="mark-icon-search"
          @change="handleSearch(true)"
          @search="handleSearch(true)"
        />
        <a-list
          :grid="{ gutter: 5, column: 1 }"
          :data-source="icons"
          class="mark-icon-list"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <div
                class="icon-content-wrapper"
                :class="markIconItemClass(item)"
                @click.stop="iconClick(item)"
              >
                <img :src="item.imageUrl" class="mark-icon-img" />
                <div class="mark-icon-name">{{ item.name }}</div>
              </div>
            </a-list-item>
          </template>
        </a-list>
        <a-pagination
          v-model:current="page"
          v-model:pageSize="pageSize"
          :total="total"
          :show-quick-jumper="false"
          :show-size-changer="false"
          class="mark-icon-pagination"
          size="small"
          @change="pageChange"
        />
      </div>
    </template>
    <a-button type="primary" size="small">
      <caret-down-outlined />
    </a-button>
  </a-popover>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import {
  Popover as APopover,
  InputSearch as AInputSearch,
  List as AList,
  Pagination as APagination,
  Button as AButton
} from 'ant-design-vue'
import { CaretDownOutlined } from '@ant-design/icons-vue'
import type { MarkIconImage } from '../graphics-attr'

const emit = defineEmits(['change', 'update:iconUrl'])
const props = defineProps({
  markIconImages: {
    type: Array as PropType<MarkIconImage[]>,
    default: () => []
  },
  iconUrl: {
    type: String,
    default: ''
  }
})
const page = ref(1)
const pageSize = ref(50)
const total = ref(0)

// 图标列表
const icons = ref<MarkIconImage[]>([])
// 显示气泡
const visible = ref(false)
// 选中的图标
const currentIcon = ref<string | undefined>(props.iconUrl)
// 图标名称样式
const markIconItemClass = (item: MarkIconImage) => {
  return {
    'icon-content-active': item.imageUrl === currentIcon.value
  }
}
// 点击图标
const iconClick = (item: MarkIconImage) => {
  currentIcon.value = item.imageUrl
  emit('update:iconUrl', item.imageUrl)
  emit('change', item)
  visible.value = false
}
// 搜索关键字
const searchValue = ref('')
// 搜素图标
const handleSearch = (isSearch: boolean) => {
  const reg = new RegExp(searchValue.value)
  const filterList = props.markIconImages.filter((item: MarkIconImage) =>
    reg.test(item.name!)
  )
  if (isSearch) {
    page.value = 1
  }
  const start = (page.value - 1) * pageSize.value
  const end = page.value * pageSize.value
  const list = filterList.slice(start, end)
  icons.value = list
  total.value = filterList.length
}
// 点击分页
const pageChange = () => {
  handleSearch(false)
}

onMounted(() => {
  handleSearch(false)
})
</script>

<style lang="less" scoped>
.mark-icon {
  width: 300px;
  height: 300px;
  .mark-icon-search {
    margin-bottom: 10px;
  }
  .mark-icon-list {
    height: calc(100% - 80px);
    overflow-x: hidden;
    overflow-y: auto;
    .icon-content-wrapper {
      display: flex;
      align-items: center;
      padding: 4px;
      border: 1px solid #ddd;
      cursor: pointer;
      &.icon-content-active {
        border: 1px solid var(--ant-primary-color);
      }
      .mark-icon-img {
        width: 40px;
        height: 40px;
      }
      .mark-icon-name {
        margin-left: 10px;
      }
    }
  }
  .mark-icon-pagination {
    margin-top: 10px;
  }
}
</style>
