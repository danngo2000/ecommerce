import Image from "next/image"
import React from "react"
import { imageLoader } from "utils"

const FreeShipping = () => {
  // const width = 200
  return (
    <div className='shipping-container'>
      <p className='shipping-text'>
        <span>$33.3</span> to FREE shipping!
      </p>
      <div className='shipping-progressbar-container'>
        <div className='bp3-progress-bar bp3-no-stripes custom-progress-bar'>
          <div
            className='bp3-progress-meter'
            style={{ width: "33.33%" }}
            // style={{ width: `${width > 100 ? 100 : width.toFixed(2)}%` }}
          />
        </div>
        <div className='freeshipping-truck'>
          <div className={"truck-icon"}>
            <Image
              loader={imageLoader}
              src='/ico-truck.png'
              width={18}
              height={18}
              objectFit='contain'
              alt=''
            />
          </div>
          <div className='tooltip'>Free!</div>
        </div>
      </div>
    </div>
  )
}

export default FreeShipping
