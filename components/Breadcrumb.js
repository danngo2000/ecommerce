import React from 'react'
import Link from 'next/link'
import { decodeHTML } from 'utils'
import { withRouter } from 'next/router'

class Breadcrumb extends React.PureComponent {
  handleAddClass = () => {
    return this.props.router.pathname === '/product' ? 'hiddenMobile' : ''
  }

  render() {
    const { breadcrumb } = this.props
    if (Array.isArray(breadcrumb)) {
      return (
        <div className='container breadcumb-container'>
          <div className='breadcrumbWrap'>
            <div className={`breadcrumb main-box ${this.handleAddClass()}`}>
              {breadcrumb.map((i, k) => {
                if (i && i.name) {
                  return (
                    <div key={k} className='element'>
                      {i.as && i.href ? (
                        <Link as={i.as} href={i.href}>
                          <a>{i.name.toLowerCase()}</a>
                        </Link>
                      ) : (
                        <a>{decodeHTML(i.name.toLowerCase())}</a>
                      )}
                    </div>
                  )
                } else {
                  return null
                }
              })}
            </div>
          </div>
        </div>
      )
    }
    return <></>
  }
}

export default withRouter(Breadcrumb)
