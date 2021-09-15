import React from "react"

const ProductSpecifications = (props:any) => {
  let {height, length, width, weight} = props
  return (
    <div className='specifications-box'>
      <table>
        <tbody>
          <tr>
            <td>Weight</td>
            <td>{weight}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td>Item Dimensions</td>
            <td>Length {length} - Width {width} - Height {height}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ProductSpecifications
