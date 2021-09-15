import React from "react"
import renderHTMLFormEditorJS from '../../utils/lib/renderHTMLFormEditorJS'

const ProductDescription = (props:any) => {
  let {blocks} = props
  
  return (
    <div className='description-box'>
      {blocks && Array.isArray(blocks) && blocks.length > 0 && blocks.map((elm, index) => (
          renderHTMLFormEditorJS(elm, index)
      ))}
    </div>
  )
}

export default ProductDescription
