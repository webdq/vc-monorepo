import { ref } from 'vue'

export const horizontalOriginOptions = ref([
  { label: '居中', value: Cesium.HorizontalOrigin.CENTER },
  { label: '左边', value: Cesium.HorizontalOrigin.LEFT },
  { label: '右边', value: Cesium.HorizontalOrigin.RIGHT }
])
export const verticalOriginOptions = ref([
  { label: '居中', value: Cesium.VerticalOrigin.CENTER },
  { label: '顶部', value: Cesium.VerticalOrigin.TOP },
  { label: '底部', value: Cesium.VerticalOrigin.BOTTOM }
])
export const heightReferenceOptions = ref([
  { label: '绝对高度', value: Cesium.HeightReference.NONE },
  { label: '紧贴地形', value: Cesium.HeightReference.CLAMP_TO_GROUND },
  { label: '相对地形的高度', value: Cesium.HeightReference.RELATIVE_TO_GROUND }
])
export const arcTypeOptions = ref([
  { label: '测地线', value: Cesium.ArcType.GEODESIC },
  { label: '直线', value: Cesium.ArcType.NONE },
  { label: '罗盘方位线', value: Cesium.ArcType.RHUMB }
])
export const polylineTypeOptions = ref([
  { label: '实线', value: 'Color' },
  { label: '虚线', value: 'PolylineDash' },
  { label: '边框线', value: 'PolylineOutline' },
  { label: '箭头', value: 'PolylineArrow' },
  { label: '发光线', value: 'PolylineGlow' },
  { label: '闪烁线', value: 'PolylineFlicker' },
  { label: '流动线', value: 'PolylineFlow' },
  { label: '图片轨迹线', value: 'PolylineImageTrail' },
  { label: '发光轨迹线', value: 'PolylineLightingTrail' },
  { label: '轨迹线', value: 'PolylineTrail' }
])
export const fillTypeOptions = ref([
  { label: '纯色', value: 'Color' },
  { label: '图片', value: 'Image' },
  { label: '网格', value: 'Grid' },
  { label: '条纹', value: 'Stripe' },
  { label: '棋盘', value: 'Checkerboard' },
  { label: '圆形边缘模糊', value: 'CircleBlur' },
  { label: '圆形扩散', value: 'CircleDiffuse' },
  { label: '圆形淡入', value: 'CircleFade' },
  { label: '圆形脉冲', value: 'CirclePulse' },
  { label: '圆形扫描', value: 'CircleScan' },
  { label: '圆形螺旋', value: 'CircleSpiral' },
  { label: '圆形变化', value: 'CircleVary' },
  { label: '圆形波纹', value: 'CircleWave' },
  { label: '球体电弧效果', value: 'EllipsoidElectric' },
  { label: '球体颜色流动', value: 'EllipsoidTrail' },
  { label: '雷达线条', value: 'RadarLine' },
  { label: '雷达扫描', value: 'RadarScan' },
  { label: '雷达清扫', value: 'RadarSweep' },
  { label: '雷达波纹', value: 'RadarWave' }
  // { label: '墙图片流动', value: 'WallImageTrail' },
  // { label: '墙线条流动', value: 'WallLineTrail' },
  // { label: '墙轨迹流动', value: 'WallTrail' }
])
export const shadowsOptions = ref([
  { label: '不投射或接收阴影', value: Cesium.ShadowMode.DISABLED },
  { label: '投射并接收阴影', value: Cesium.ShadowMode.ENABLED },
  { label: '仅投射阴影', value: Cesium.ShadowMode.CAST_ONLY },
  { label: '仅接收阴影', value: Cesium.ShadowMode.RECEIVE_ONLY }
])
export const colorBlendModeOptions = ref([
  { label: '高亮', value: Cesium.ColorBlendMode.HIGHLIGHT },
  { label: '替换', value: Cesium.ColorBlendMode.REPLACE },
  { label: '混合', value: Cesium.ColorBlendMode.MIX }
])
export const labelStyleOptions = ref([
  { label: '填充', value: Cesium.LabelStyle.FILL },
  { label: '填充和边框', value: Cesium.LabelStyle.FILL_AND_OUTLINE },
  { label: '边框', value: Cesium.LabelStyle.OUTLINE }
])
