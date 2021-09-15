import React, { forwardRef } from 'react'

export const SlideArrow = forwardRef((props, ref) => {
  const { className, style, onClick, rotate } = props
  const svgStyle = {}
  if (rotate) {
    svgStyle.transform = `rotate(${rotate}deg)`
  }
  return (
    <div ref={ref} className={className}>
      <a
        style={style}
        onClick={onClick}>
        <svg style={svgStyle} viewBox='0 0 256 512' data-role='none' height='1em' width='1em'><path d='M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z' /></svg>
      </a>
    </div>
  )
})
