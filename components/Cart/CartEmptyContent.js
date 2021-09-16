import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import SaveForLaterItems from './SaveForLaterItems'
import { useRouter } from 'next/router'
import { Row, Col } from 'antd'
import update from 'immutability-helper'
import { useDispatch } from 'react-redux'
// import { removeSaveForLater } from 'services/cart'
import { addToCart } from 'actions/cart'

const CartEmptyContent = () => {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const dispatch = useDispatch()
  const router = useRouter()
  const fetch = async () => {
    try {
      const {
        data: { items, total, error }
      } = await axios.get(`save-for-later/`)
      if (items) {
        setItems(items)
        setTotal(total)
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    fetch()
  }, [])

  const handleRemoveSFL = async (item, index) => {
    await removeSaveForLater(item)
    setItems(
      update(items, {
        $splice: [[index, 1]]
      })
    )
  }

  const handleAddSFLToCart = (item, index) => {
    dispatch(addToCart(item.product_id, 1, { sflItem: item }))
    setItems(
      update(items, {
        $splice: [[index, 1]]
      })
    )
  }

  const handleShowAllSFL = () => {
    router.push('/customer/saved')
  }

  return (
    <Row
      type='flex'
      justify='center'
      align='middle'
      style={{ minHeight: '50vh' }}
    >
      <Col style={{ justifyContent: 'center' }}>
        <div className='CartEmptyPage'>
          <img src='/static/images/shopping-cart.svg' width='100px' />
          <h1>Shopping Cart is Empty</h1>
          <p>You have no items in your shopping cart.</p>
          <Link href='/'>
            <a>
              <button className='btn'>Continue shopping</button>
            </a>
          </Link>
        </div>
      </Col>
      {items.length > 0 && (
        <SaveForLaterItems
          items={items}
          total={total}
          handleAdd={handleAddSFLToCart}
          handleRemove={handleRemoveSFL}
          handleShowAll={handleShowAllSFL}
        />
      )}
    </Row>
  )
}

export default React.memo(CartEmptyContent)
