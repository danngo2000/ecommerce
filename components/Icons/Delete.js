import React from "react"
export default (props) => {
  const { fill, size, stroke } = props
  const viewBox = 612
  return <svg
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    fill={fill || "#000"}
    stroke={stroke || "unset"}
    width={size + 1 || "28px"}
    height={size || "27px"}
    viewBox={`0 0 ${viewBox} ${viewBox}`}
    className={props.className}
  >
    <polygon points='612,36.004 576.521,0.603 306,270.608 35.478,0.603 0,36.004 270.522,306.011 0,575.997 35.478,611.397
      306,341.411 576.521,611.397 612,575.997 341.459,306.011' />
  </svg>
}
