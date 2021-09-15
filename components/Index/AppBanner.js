import React, { Component } from 'react'
// import { T, t } from 'locales'
import Link from 'next/link'
import renderHTML from 'react-render-html'
import * as Icon from '@ant-design/icons'

class AppDownLoadBanner extends Component {
  shouldComponentUpdate() {
    return false
  }
  render() {
    return (
      <div className='download-app-banner text-right'>
        {this.props.data.list.map((item, index) => {
          return (
            <div key={index}>
              <div className='container head-app-download'>
                <div className='head-app-download-left'>
                  <Icon.CloseOutlined />
                  <img
                    className='head-app-download-logo'
                    src={item.imgLogo}
                    alt=''
                  />
                </div>
                <div className='head-app-download-center'>
                  {item.title && <p>{renderHTML(item.title)}</p>}
                  {item.text && <p>{renderHTML(item.text)}</p>}
                  <p>{item.description}</p>
                </div>
                <div className='head-app-download-right'>
                  <Link
                    as={`/c/${item.url}`}
                    href={`/category?categorySlug=${item.url}`}
                  >
                    <a className='btn btnShopNow'>Open</a>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default AppDownLoadBanner
