
import React from 'react'
import Link from 'next/link'

class AmazonLinkRefer extends React.PureComponent {
  render () {
    const { product } = this.props
    let isDropship = product.dropship && product.dropship.is_dropship
    if (isDropship) {
      let { source_url } = product.dropship
      return <div className='amazonLinkRefer'>
        <Link href={source_url}>
          <a target='_blank'><img src='/static/images/svg/Amazon_logo.svg' height='13px' /></a>
        </Link>
      </div>
    }
    return <React.Fragment></React.Fragment>
  }
}
export default AmazonLinkRefer
