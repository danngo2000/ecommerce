import React from "react"
export default (props) => {
  const { fill, size, stroke } = props
  return <svg
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    fill={fill || "#000"}
    stroke={stroke || "unset"}
    width={size + 1 || "28px"}
    height={size || "27px"}
    viewBox={"-42 0 426 426.66667"}
    className={props.className}
  >
    <path d='m331 21.332031h-53.332031v-10.664062c0-5.890625-4.777344-10.667969-10.667969-10.667969s-10.667969 4.777344-10.667969 10.667969v10.664062h-42.664062v-10.664062c0-5.890625-4.777344-10.667969-10.667969-10.667969s-10.667969 4.777344-10.667969 10.667969v10.664062h-42.664062v-10.664062c0-5.890625-4.777344-10.667969-10.667969-10.667969s-10.667969 4.777344-10.667969 10.667969v10.664062h-42.664062v-10.664062c0-5.890625-4.777344-10.667969-10.667969-10.667969s-10.667969 4.777344-10.667969 10.667969v10.664062h-53.332031c-5.890625 0-10.667969 4.777344-10.667969 10.667969v384c0 5.890625 4.777344 10.667969 10.667969 10.667969h320c5.890625 0 10.667969-4.777344 10.667969-10.667969v-384c0-5.890625-4.777344-10.667969-10.667969-10.667969zm-10.667969 384h-298.664062v-362.664062h42.664062v10.664062c0 5.890625 4.777344 10.667969 10.667969 10.667969s10.667969-4.777344 10.667969-10.667969v-10.664062h42.664062v10.664062c0 5.890625 4.777344 10.667969 10.667969 10.667969s10.667969-4.777344 10.667969-10.667969v-10.664062h42.664062v10.664062c0 5.890625 4.777344 10.667969 10.667969 10.667969s10.667969-4.777344 10.667969-10.667969v-10.664062h42.664062v10.664062c0 5.890625 4.777344 10.667969 10.667969 10.667969s10.667969-4.777344 10.667969-10.667969v-10.664062h42.664062zm0 0' /><path d='m267 128h-192c-5.890625 0-10.667969 4.777344-10.667969 10.667969s4.777344 10.664062 10.667969 10.664062h192c5.890625 0 10.667969-4.773437 10.667969-10.664062s-4.777344-10.667969-10.667969-10.667969zm0 0' /><path d='m267 192h-192c-5.890625 0-10.667969 4.777344-10.667969 10.667969s4.777344 10.664062 10.667969 10.664062h192c5.890625 0 10.667969-4.773437 10.667969-10.664062s-4.777344-10.667969-10.667969-10.667969zm0 0' /><path d='m267 256h-192c-5.890625 0-10.667969 4.777344-10.667969 10.667969s4.777344 10.664062 10.667969 10.664062h192c5.890625 0 10.667969-4.773437 10.667969-10.664062s-4.777344-10.667969-10.667969-10.667969zm0 0' /><path d='m267 320h-192c-5.890625 0-10.667969 4.777344-10.667969 10.667969s4.777344 10.664062 10.667969 10.664062h192c5.890625 0 10.667969-4.773437 10.667969-10.664062s-4.777344-10.667969-10.667969-10.667969zm0 0' />
  </svg>
}