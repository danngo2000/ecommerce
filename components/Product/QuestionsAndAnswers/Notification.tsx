import React from 'react'
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'

export default function Notification(props: any) {
  const { subClass, options = {} } = props
  const { type, message } = options
  let icon
  let color
  switch (type) {
    case 'warning':
      color = '#FF4D4F'
      icon = <WarningOutlined style={{ color }} className='icon-ant' />
      break
    default:
      color = 'green'
      icon = <CheckCircleOutlined style={{ color }} className='icon-ant' />
      break
  }
  return (
    <div className={`wrap-noti ${subClass || ''}`}>
      <div
        className={`qa-notification ${subClass || ''}`}
        style={{ borderColor: color }}
      >
        <div className='box'>
          {icon}
          <div className='message'>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
