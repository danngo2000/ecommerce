import Link from 'next/link'
import React, { PureComponent } from 'react'
import RetinaBackground from '../RetinaBackground'

export default class FeauturedBannerBox extends PureComponent {
  render () {
    const { title } = this.props
    return (
      <div className='container no-padding'>
        <article className={`featuredBannerBox ${this.props.textLeft ? '' : 'text-right'}`}>
          <RetinaBackground
            className={`content${typeof this.props.title === 'undefined' ? ' no-title' : ''}`}
            src={this.props.imgUrl} hiresSrc={this.props.highResImg || this.props.imgUrl}>
            {
              typeof this.props.title !== 'undefined' ? (
                <div className={`${title.toLowerCase().replace(/ /g, '-')}`}>
                  <h3>{this.props.title}</h3>
                  <p className='description'>{this.props.description}</p>
                  <Link as={`/c/${this.props.btnLink}`} href={`/category?categorySlug=${this.props.btnLink}`}>
                    <a className='btn btnShopNow'>{this.props.btnTitle}</a>
                  </Link>
                </div>
              ) : <div />
            }
          </RetinaBackground>
        </article>
      </div>

    )
  }
}
