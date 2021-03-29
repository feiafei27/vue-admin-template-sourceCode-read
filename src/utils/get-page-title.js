//导入配置文件
import defaultSettings from '@/settings'

//如果配置文件配置了 title，就使用这个 title。如果没有配置title的话，就默认使用 Vue Admin Template。
const title = defaultSettings.title || 'Vue Admin Template'

//传入当前页面的 名称
//字符串拼装返回显示的标签栏 title
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
