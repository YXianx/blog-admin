export default function (jsonStr: string, dom: HTMLElement) {
  // 1、字符串转位JSON对象
  const jsonObj = JSON.parse(jsonStr)
  // 2、递归渲染
  recursion(jsonObj, dom)
}

// TODO:缩进有问题
let marginLeft = 20 // 属性缩进距离
const recursion = (jsonObj: any, dom: HTMLElement) => {
  // 遍历循环json体 or 数组体
  for (let attr in jsonObj) {
    // 1、获取当前属性的数据类型
    const attrType = Object.prototype.toString.call(jsonObj[attr])
    // 2、判断属性是数组、对象还是普通字段属性
    if (attrType === '[object Array]' || attrType === '[object Object]') {
      // 2-1、当为数组类型并且数组内没元素时跳出本次循环
      if (attrType === '[object Array]' && jsonObj[attr].length <= 0) {
        const emptyEl = document.createElement('div')
        emptyEl.innerHTML = attr + ':' + '[]'
        dom.appendChild(emptyEl)
        continue;
      }

      // 2-2、创建父级DOM
      const attrsEl = document.createElement('div')
      attrsEl.style.marginLeft = `${marginLeft}px`
      attrsEl.innerHTML = attr + ':'
      marginLeft += 20
      dom.appendChild(attrsEl)
      // 2-3、递归，将父DOM往下传
      recursion(jsonObj[attr], attrsEl)
    }
    // 3、当属性是普通数据类型时（number、string、boolean）
    else {
      // 3-1、创建一级DOM或子级DOM
      const el = document.createElement('div')
      el.style.marginLeft = `${marginLeft}px`
      el.innerHTML = attr + ':' + jsonObj[attr]
      marginLeft += 20
      // 3-2、插入页面容器中 或 父数组或父对象的El中
      dom.appendChild(el)
    }

    // 4、重制属性缩进距离
    marginLeft = 20
  }
}
