import React from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import RetinaImage from './RetinaImage'

const Logo = () => {
  const config = useSelector((state: any) => state.config)
  let logoUrl =
    (config && config['site/logo_url']) || '/static/images/logo_white.png'
  let highResLogoUrl = config['site/high_res_logo_url'] || logoUrl
  let siteName = config['site/site_name'] || ''

  return (
    <div className='logoWrap'>
      <Link href='/'>
        <a>
          <RetinaImage
            className='logo logo-size'
            src={logoUrl}
            hiresSrc={highResLogoUrl}
            alt={siteName + ' logo'}
          />
        </a>
      </Link>
    </div>
  )
}

export default Logo
