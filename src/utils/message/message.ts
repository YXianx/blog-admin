import { ElMessage } from 'element-plus'
export default function showMsg(type: any, info: string, duration = 1500) {
  ElMessage({
    type: type,
    message: info,
    duration
  })
}
