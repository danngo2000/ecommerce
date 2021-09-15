import React from 'react'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import ProductSlider from '../ProductSlider'

class RecentlyViewed extends React.PureComponent {
  state = {
    recentlyViewed: []
  }

  getRecentlyViewed = async () => {
    try {
      const token = window.localStorage.getItem('token')
      const customerDecoded = jwt.decode(token)
      if (
        customerDecoded &&
        customerDecoded.user_role === 'customer' &&
        typeof customerDecoded.customer !== 'undefined'
      ) {
        const {
          data: { products }
        } = await axios.get(`product-recently-viewed`)
        this.setState({ recentlyViewed: products })
      }
    } catch (e) {
      console.log(e)
    }
  }

  componentDidMount() {
    this.getRecentlyViewed()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.product._id !== this.props.product._id) {
      this.getRecentlyViewed()
    }
  }

  render() {
    const { recentlyViewed } = this.state

    if (!Array.isArray(recentlyViewed) || !recentlyViewed.length) return null
    return (
      <div className='main-box'>
        <div className='recentlyViewedSlider md-slider'>
          <h3>Recently Viewed</h3>
          <ProductSlider products={recentlyViewed} />
        </div>
      </div>
    )
  }
}

export default RecentlyViewed
