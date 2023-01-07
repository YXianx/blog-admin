export default function (jsonStr: string, dom: HTMLElement) {
  // 1、字符串转位JSON对象
  const jsonObj = JSON.parse(jsonStr)
  // 2、递归渲染
  dom.innerHTML = ''
  recursion(jsonObj, dom)
}

// TODO:缩进有问题
let paddingLeft = 0 // 属性缩进距离
// let preLeft = 0
const recursion = (jsonObj: any, dom: HTMLElement, parentType?: string, isIndent?: boolean) => {
  // 遍历循环json体 or 数组体
  for (let attr in jsonObj) {
    // 1、获取当前属性的数据类型
    const attrType = Object.prototype.toString.call(jsonObj[attr])
    // 2、判断属性是数组、对象还是普通字段属性
    if (attrType === '[object Array]' || attrType === '[object Object]') {
      // 2-1、当为数组类型并且数组内没元素时跳出本次循环
      if (
        (attrType === '[object Array]' && jsonObj[attr].length <= 0) ||
        (attrType === '[object Object]' && jsonObj[attr] === '')) {
        const emptyEl = document.createElement('div')
        emptyEl.innerHTML = `${attr}:[],`
        if (isIndent)
          emptyEl.style.paddingLeft = `${paddingLeft}px`
        dom.appendChild(emptyEl)
        continue;
      }

      isIndent = true
      parentType = attrType

      // 2-2、数组和对象加上起始符 (xx:{  or  xxx: [)
      let tempHtml = attr + ':'
      if (attrType === '[object Object]')
      tempHtml += '{'
      else
      tempHtml += '['

      // 2-3、创建父级DOM
      const attrsEl = document.createElement('div')
      attrsEl.innerHTML = tempHtml
      attrsEl.style.position = 'relative'

      // 2-3-4、创建arrow小箭头在对象或数组旁边
      let isExpand = true
      const arrowEl = document.createElement('div')
      arrowEl.style.position = 'absolute'
      arrowEl.style.left = `-${15 - paddingLeft}px` // 计算图标left距离
      arrowEl.style.top = '13px'
      arrowEl.style.content = ''
      arrowEl.style.width = '10px'
      arrowEl.style.height = '5px'
      arrowEl.style.background = '#5B9CF8'
      arrowEl.style.cursor = 'pointer'
      arrowEl.style.clipPath = 'polygon(50% 0, 100% 100%, 0 100%)'
      arrowEl.style.transform = 'rotate(180deg)'
      arrowEl.style.transition = 'all .3s'
      arrowEl.addEventListener('click', () => {
        isExpand = !isExpand
        const childEls = attrsEl.children
        if (isExpand) {
          // i=1省略开头的箭头DOM i<childEls.length-1省略结尾的结束符DOM
          for (let i = 1; i < childEls.length; i++) {
            (childEls[i] as HTMLElement).style.display = 'block'
          }
          arrowEl.style.transform = 'rotate(180deg)'
        } else {
          for (let i = 1; i < childEls.length; i++) {
            (childEls[i] as HTMLElement).style.display = 'none'
          }
          arrowEl.style.transform = 'rotate(90deg)'
        }
      })
      attrsEl.appendChild(arrowEl)

      dom.appendChild(attrsEl)
      attrsEl.style.paddingLeft = `${paddingLeft}px`
      paddingLeft = 10

      // 2-4、递归，将父DOM往下传
      recursion(jsonObj[attr], attrsEl, parentType, isIndent)
    }
    // 3、当属性是普通数据类型时（number、string、boolean）
    else {
      // 3-1、创建一级DOM或子级DOM
      const el = document.createElement('div')
      el.innerHTML = `${attr}:${jsonObj[attr]},`
      if (isIndent)
        el.style.paddingLeft = `10px`
      // 3-2、插入页面容器中 或 父数组或父对象的El中
      dom.appendChild(el)
    }
  }

  // 当前为对象体或者数组时，结尾加上结束符
  if (parentType === '[object Object]' || parentType === '[object Array]') {
    const endEl = document.createElement('div')
    endEl.innerHTML = parentType === '[object Object]' ? '},' : '],'
    dom.appendChild(endEl)
  }
  isIndent = false

  // 遍历完一个数组或者对象后再重置缩进
  paddingLeft = 0
}
