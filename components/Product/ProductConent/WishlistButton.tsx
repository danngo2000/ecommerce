import React, {
  useCallback,
  useState,
  createElement as e,
  useEffect
} from 'react'
import { Tooltip } from 'antd'
// import { T, t } from 'locales'
import axios from 'axios'
import { Button } from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { toggleLoginDialog } from '../../../actions/ui'

const HeartIcon = (props) => {
  const { visible, added, onClick } = props
  return (
    <Tooltip
      visible={visible}
      // hoverOpenDelay={2000}
      title={`${added ? 'Added to Wishlist' : 'Add to Wishlist'}`}
      // position='top'
    >
      <div className='add-wishlist-wrapper'>
        {e(
          'svg',
          {
            tabIndex: 0,
            className: classNames('add-wishlist', added && 'added'),
            width: 27,
            height: 24,
            viewBox: '0 0 20 20',
            onClick
          },
          <path
            d='M20 6.25C20 3.35 17.65 1 14.75 1c-1.02 0-1.95.31-2.75.82v-.04c-.09.06-.17.12-.26.19-.04.03-.09.06-.14.1-.68.51-1.24 1.18-1.6 1.96-.4-.86-1.04-1.57-1.8-2.1-.04-.02-.07-.05-.1-.08a7 7 0 0 0-.6-.33c-.13-.04-.23-.1-.35-.15-.05-.02-.1-.05-.15-.07v.02C6.45 1.13 5.87 1 5.25 1A5.25 5.25 0 0 0 0 6.25c0 .09.01.17.01.25H0c0 .06.01.12.02.18s.01.12.02.18C.13 7.89.44 9 1.07 10.17 2.23 12.33 4.1 14.11 7 16.53v.01c.9.75 1.89 1.55 3 2.46.71-.58 1.38-1.12 2-1.63 3.48-2.86 5.64-4.78 6.93-7.18.63-1.17.94-2.27 1.03-3.3.01-.07.01-.14.02-.21 0-.06.01-.11.02-.17h-.01c0-.09.01-.17.01-.26z'
            fillRule='evenodd'
          />
        )}
      </div>
    </Tooltip>
  )
}

const WishlistButton = (props) => {
  const [added, setAdded] = useState(false)
  const [visible, setVisible] = useState(false)
  const isGuest = useSelector((state: any) => state.auth.isGuest)

  const dispatch = useDispatch()
  const { product } = props
  const outOfStock =
    !!product &&
    (product.quantity <= 0 ||
      product.status === 'disable' ||
      product.stock_availability === 'out-of-stock')

  useEffect(() => {
    setAdded(!!props.added)
    if (isGuest) return
    axios
      .get('wishlists/check?productId=' + product?._id)
      .then((res) => res.data.added)
      .then((added) => setAdded(added))
      .catch((e) => console.error(e.message))
  }, [isGuest, props.product && props.product._id])

  const handleClick = useCallback(async () => {
    if (isGuest) {
      dispatch(toggleLoginDialog(true))
      return
    }
    if (!added) {
      await axios.post('wishlists/customer', { productId: product._id })
      setVisible(true)
      setAdded(true)
    } else {
      await axios.delete(`wishlists/customer/${product._id}`)
      setAdded(false)
    }
    setVisible(true)
    setTimeout(() => setVisible(false), 1000)
  }, [isGuest, added])

  if (!outOfStock) return e(HeartIcon, { added, visible, onClick: handleClick })
  return (
    <div className='productStockStatus'>
      <Button
        type='link'
        onClick={handleClick}
        className={classNames(
          'outOfStock',
          added && 'outOfStock added addedWishlist'
        )}
      >
        {e(HeartIcon, { added, visible })}
        Out of stock) ADD TO WISHLIST
      </Button>
    </div>
  )
}

export default connect(null)(WishlistButton)
