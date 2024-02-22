import { ref, computed } from 'vue'
import { GraphicsAttrProps } from '../graphics-attr'

// 默认tab列表
export const defaultTabList = [
  {
    label: '属性设置',
    value: 'graphics-attr',
    match: '',
    prop: 'hideGraphicsAttrTab'
  },
  {
    label: '文字设置',
    value: 'text-attr',
    match: '',
    prop: 'hideTextAttrTab'
  },
  {
    label: '动画设置',
    value: 'animation',
    match: '',
    prop: 'hideAnimationTab'
  },
  {
    label: '模型设置',
    value: 'model',
    match: 'model',
    prop: 'hideModelTab'
  },
  {
    label: '信号线设置',
    value: 'signal-line',
    match: 'polyline',
    prop: 'hideSignalLineTab'
  },
  {
    label: '移动路径设置',
    value: 'movement',
    match: 'model',
    prop: 'hideMovementTab'
  }
]

export const useTab = (props: GraphicsAttrProps) => {
  // 标绘元素类型
  const type = ref('polygon')
  // tabs
  const tabs = computed(() => {
    const list = defaultTabList.filter((item) => {
      const reg = new RegExp(item.match)
      return (
        !props[item.prop as keyof GraphicsAttrProps] && reg.test(type.value)
      )
    })
    return list
  })
  // 默认选择 tab 的 key
  const defaultTabKey = computed(() => tabs.value?.[0]?.value)
  // 选中的 tab
  const activeKey = ref(defaultTabKey.value)

  // 显示属性设置 tab
  const showGraphicsAttrTab = computed(
    () => activeKey.value === 'graphics-attr'
  )
  // 显示文字设置 tab
  const showTextAttrTab = computed(() => activeKey.value === 'text-attr')
  // 显示动画设置 tab
  const showAnimationTab = computed(() => activeKey.value === 'animation')
  // 显示模型设置 tab
  const showModelTab = computed(
    () => activeKey.value === 'model' && type.value === 'model'
  )
  const showSignalLineTab = computed(
    () => activeKey.value === 'signal-line' && type.value === 'polyline'
  )
  // 显示移动路径设置 tab
  const showMovementTab = computed(
    () => activeKey.value === 'movement' && type.value === 'model'
  )

  // 使用索引切换 tab
  const setTabByIndex = (index: number) => {
    const tab = tabs.value[index]
    if (!tab) return
    activeKey.value = tab.value
  }

  // 使用 key 切换 tab
  const setTabByKey = (key: string) => {
    const tab = tabs.value.find((item) => item.value === key)
    if (tab) {
      activeKey.value = tab.value
    }
  }

  // 更新标绘元素类型
  const updateType = (val: string) => {
    activeKey.value = defaultTabKey.value
    type.value = val
  }

  return {
    type,
    activeKey,
    defaultTabKey,
    tabs,
    setTabByIndex,
    setTabByKey,
    updateType,
    showGraphicsAttrTab,
    showTextAttrTab,
    showAnimationTab,
    showModelTab,
    showSignalLineTab,
    showMovementTab
  }
}
