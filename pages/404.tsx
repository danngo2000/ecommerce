import { Link } from "@material-ui/core"
import Layout from "components/Layout"
import Image from "next/image"
import React from "react"
import { imageLoader } from "utils"

const Error = () => {
  return (
    <Layout page='error-page'>
      <div className='container small-container not-found-page'>
        <Image
          loader={imageLoader}
          src='/images/error-page-image.png'
          width={100}
          height={120}
          objectFit='contain'
          alt=''
        />
        <h1>UH OH</h1>
        <p>Don't worry we got you covered!</p>
        <Link href='/'>
          <a>
            <button className='btn'>Continue Shopping</button>
          </a>
        </Link>
      </div>
    </Layout>
  )
}

export default Error
