<template>
  <!-- 侧边栏导航item的图标 -->
  <!-- 如果是外部图标的话，渲染下面的div -->
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners"/>
  <!-- 如果是内部图标的话，渲染下面的svg -->
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
  <!-- v-on="$listeners"可以看看这篇文章：https://www.jianshu.com/p/072426338c67 -->
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { isExternal } from '@/utils/validate'

export default {
  name: 'SvgIcon',
  props: {
    //传递图标的名字，例如:"dashboard"
    iconClass: {
      type: String,
      required: true
    },
    //类名，例如 "contain"
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    //判断该iconClass是不是外部图标
    isExternal() {
      return isExternal(this.iconClass)
    },
    //组装图标的名称：在前面添加‘#icon-’
    iconName() {
      return `#icon-${this.iconClass}`
    },
    //组装最终的svgClass，
    //判断父元素有没有传递className,如果为空的话，直接return 'svg-icon',
    //如果不为空的话，字符串拼接，然后return，
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    //外部图标使用的 style.
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>
