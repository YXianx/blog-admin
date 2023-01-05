/**
 * 方法类型转为Tag Type类型
 * @param method 请求方法
 */
export function methodMapType(method: string) {
  switch (method) {
    case 'GET':
      return ''
    case 'POST':
      return 'warning'
    case 'DELETE':
      return 'danger'
    case 'PUT':
      return 'success'
  }
}

export function methodTextMapType(method: string) {
  switch (method) {
    case '查询':
      return ''
    case '新增':
      return 'warning'
    case '更新':
      return 'warning'
    case '删除':
      return 'danger'
    case 'PUT':
      return 'success'
  }
}
