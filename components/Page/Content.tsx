import React, { FC } from "react"
import renderHTMLFormEditorJS from '../../utils/lib/renderHTMLFormEditorJS'

interface PropType {
    data: any
}

const Content: FC<PropType> = ({ data }) => {
  let {content} = data
  let blocks = content.blocks

  return (
    <div className='content'>
      <h1>{data.title}</h1>
      {blocks && Array.isArray(blocks) && blocks.length > 0 && blocks.map((elm, index) => (
          renderHTMLFormEditorJS(elm, index)
      ))}
    </div>
  )
}

export default Content
