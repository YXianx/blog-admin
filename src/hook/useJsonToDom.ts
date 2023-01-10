import { nextTick } from 'vue'
let paddingLeft:number = 0 // 属性缩进距离

export default function (jsonStr: string, dom: HTMLElement) {
  // 1、字符串转位JSON对象
  const jsonObj = JSON.parse(jsonStr)
  // 2、递归渲染
  dom.innerHTML = '' // 重置内容
  paddingLeft = 0 // 重置缩进
  recursion(jsonObj, dom)
}

// TODO:(优先解决)符号类型有问题;末尾元素不应该加逗号;
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
        emptyEl.innerHTML = `${attr}:${attrType === '[object Object]' ? '{}' : '[]'},`
        if (isIndent)
          emptyEl.style.paddingLeft = `${paddingLeft}px`
        dom.appendChild(emptyEl)
        continue;
      }

      isIndent = true // 允许缩进
      parentType = attrType // 存储父级数据类型

      // 2-2、数组和对象加上起始符 (xx:{  or  xxx: [)
      let tempHtml = attr + ':'
      if (attrType === '[object Object]') {
        tempHtml += '{'
      }
      else if (attrType === '[object Array]') {
        tempHtml += '['
      }

      // 2-3、创建父级DOM
      const attrsEl = document.createElement('div')
      // 2-3-1、父级属性名用span包裹，方便之后修改
      const attrTitleEl = document.createElement('span')
      attrTitleEl.innerText = tempHtml
      attrsEl.appendChild(attrTitleEl)

      attrsEl.style.paddingLeft = `${paddingLeft}px`
      attrsEl.style.position = 'relative'

      // 2-3-2、创建arrow小箭头在对象或数组旁边
      createArrowEl(attrsEl, parentType)

      // 2-3-3、父级DOM插入上一级DOM中
      attrsEl.style.paddingLeft = `${paddingLeft}px`
      paddingLeft = 10
      dom.appendChild(attrsEl)

      // 2-4、递归，将父DOM往下传
      recursion(jsonObj[attr], attrsEl, parentType, isIndent)
    }
    // 3、当属性是普通数据类型时（number、string、boolean）
    else {
      // 3-1、创建一级DOM或子级DOM
      const el = document.createElement('div')
      el.innerHTML = `${attr}:${jsonObj[attr]},`
      if (isIndent)
        el.style.paddingLeft = '10px'
      // 3-2、插入页面容器中 或 父数组或父对象的El中
      dom.appendChild(el)
    }
  }

  // 当前为对象体或者数组时，结尾加上结束符
  // 当递归所有的后，返回到最顶层时(#responseView)不再渲染结束符
  // 整理思路：发现不管是不是数组结束符都是 ‘}’ 然后推断判断条件有问题，一直不能为true
  if ((parentType === '[object Object]' || parentType === '[object Array]') && dom.getAttribute('id') != 'responseView') {
    const endEl = document.createElement('div')
    endEl.innerHTML = (dom as HTMLElement).innerText.split(':')[1].split('\n')[0] === '[' ? '],' : '},' // 过滤当前父级DOM的text，拿到起始符号
    console.log((dom as HTMLElement).innerText.split(':')[1].split('\n')[0]);
    dom.appendChild(endEl)
  }

  // 遍历完一个数组或者对象后
  isIndent = false  // 重置缩进标识
  paddingLeft = 10 // 重置缩进
}


/**
 * 创建Arrow箭头
 * @param parentEl DOM父对象
 * @returns arrow箭头DOM
 */
const createArrowEl = (parentEl: HTMLElement, parentType: string) => {
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

    const childEls = parentEl.children
    if (isExpand) {
      for (let i = 1; i < childEls.length; i++) {
        (childEls[i] as HTMLElement).style.display = 'block'
      }
      arrowEl.style.transform = 'rotate(180deg)';
      (parentEl.children[0] as HTMLElement).innerHTML = (parentEl.children[0] as HTMLElement).innerText.split('...')[0]
    } else {
      for (let i = 2; i < childEls.length; i++) {
        (childEls[i] as HTMLElement).style.display = 'none'
      }
      arrowEl.style.transform = 'rotate(90deg)'
      nextTick(() => {
        (parentEl.children[0] as HTMLElement).innerHTML = (parentEl.children[0] as HTMLElement).innerText + `...${parentType === '[object Object]' ? '},' : '],'}`
      })
    }
  })

  parentEl.appendChild(arrowEl)
}
