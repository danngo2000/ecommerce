import React from "react"
import Link from "next/link"
import Image from "next/image"
import { imageLoader } from "utils"

const Logo = () => {
  const logoUrl = "/logo.jpg"

  return (
    <div className='logo-wrap'>
      <Link href='/'>
        <a>
          <Image
            loader={imageLoader}
            src={logoUrl}
            width={230}
            height={91.48}
            className='logo'
            objectFit='contain'
          />
        </a>
      </Link>
    </div>
  )
}

export default Logo
