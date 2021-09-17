import React, { useState, useEffect } from 'react'
import ContentLoader from 'react-content-loader'
import axios from 'axios'
import Price from '../Product/Price'
import config from 'settings'
import ShippingRatesBySeller from './Shipping/ShippingRatesBySeller'
import qs from 'qs'
import { scroller } from 'react-scroll'
import { isLimitShippingCostLower } from 'utils/cart'
import { useDispatch, useSelector } from 'react-redux'
import { changeShippingMethod } from 'actions/cart'
import { changeCheckoutStep } from 'actions/checkout'
import { CheckoutStep } from '../../store/interfaces'

const Loader = () => (
  <ContentLoader
    height={160}
    width={400}
    speed={2}
    primaryColor='#f3f3f3'
    secondaryColor='#ecebeb'
  >
    <rect x='0' y='0' rx='3' ry='3' width='70' height='10' />
    <rect x='80' y='0' rx='3' ry='3' width='100' height='10' />
    <rect x='190' y='0' rx='3' ry='3' width='10' height='10' />
    <rect x='15' y='20' rx='3' ry='3' width='130' height='10' />
    <rect x='155' y='20' rx='3' ry='3' width='130' height='10' />
    <rect x='15' y='40' rx='3' ry='3' width='90' height='10' />
    <rect x='115' y='40' rx='3' ry='3' width='60' height='10' />
    <rect x='185' y='40' rx='3' ry='3' width='60' height='10' />
    <rect x='0' y='60' rx='3' ry='3' width='30' height='10' />
  </ContentLoader>
)

const ShippingMethods = (props) => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const [loading, setLoading] = useState(false)
  const [shippingMethods, setShippingMethods] = useState(null)
  const [count, setCount] = useState(0)
  const [hasFreeship, setHasFreeship] = useState(null) // some, all, null

  useEffect(() => {
    if (
      cart.address.shipping &&
      (cart.address.shipping.state || cart.address.shipping.province)
    ) {
      loadMethods()
    }
  }, [cart.updated_at])

  const getFirstShipping = (shippings) => {
    let result = {}
    const sellers = Object.keys(shippings)
    for (let seller of sellers) {
      result[seller] = null

      if (Array.isArray(shippings[seller]) && shippings[seller].length) {
        for (let item of shippings[seller]) {
          if (!isNaN(item.rate)) {
            result[seller] = item
            break
          }
        }
      } else {
      }
    }
    return result
  }

  const loadMethods = async () => {
    if (cart.address.shipping) {
      const shippingAddress = cart.address.shipping
      let zipcode = null
      let country = 'US'
      let state = ''
      if (shippingAddress.zip_code) zipcode = shippingAddress.zip_code
      if (shippingAddress.country) country = shippingAddress.country
      state =
        (shippingAddress.state ? shippingAddress.state : '') ||
        shippingAddress.province
      let ward = shippingAddress.ward
      let district = shippingAddress.district
      setLoading(true)
      try {
        const {
          data: { shippings, hasFreeship, shouldFreeshipAll }
        } = await axios.get(
          `shipping/getrates?${qs.stringify({
            zipcode,
            country,
            state,
            district,
            ward
          })}`
        )
        const firstShipping = getFirstShipping(shippings)
        dispatch(changeShippingMethod(firstShipping))
        let shippingMethodsCount = 0
        if (shippings) {
          try {
            shippingMethodsCount = Object.keys(shippings)
              .map((key) => shippings[key].length)
              .reduce((a, c) => a + c)
          } catch (error) {}
        }
        setLoading(false)
        setShippingMethods(shippings)
        setCount(shippingMethodsCount)
        if (shouldFreeshipAll) {
          setHasFreeship('all')
        } else if (hasFreeship) {
          setHasFreeship('some')
        } else {
          setHasFreeship(null)
        }
        return
      } catch (e) {
        console.error(e.message)
        dispatch(changeShippingMethod(null))
      }
    }
    setShippingMethods(null)
    setLoading(false)
  }

  const scrollTo = (element, offset = 0, actions) => {
    scroller.scrollTo(element, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset,
      actions
    })
  }

  return (
    <div className='stepContent'>
      {loading ? (
        <Loader />
      ) : (
        <>
          <ShippingRatesBySeller
            cart={cart}
            shippingMethods={shippingMethods}
            freeAll={hasFreeship === 'all'}
          />

          {!isLimitShippingCostLower(cart) && (
            <div className='cartAlertNotify'>
              (The shipping cost over{' '}
              <Price price={config.cart.limitShippingCost} />, please contact us
              for bulk shipping quote)
            </div>
          )}
          <div className='buttons'>
            {count > 0 || hasFreeship ? (
              <>
                <div className='col1'>
                  <button
                    className='btn btnNextStep'
                    onClick={() =>
                      scrollTo(
                        'stepPayment',
                        -600,
                        dispatch(changeCheckoutStep(CheckoutStep.Payment))
                      )
                    }
                  >
                    Continue
                  </button>
                </div>
                <div className='col2'>
                  <span
                    className='goBackBtn'
                    onClick={() =>
                      scrollTo(
                        'stepAddress',
                        -300,
                        dispatch(changeCheckoutStep(CheckoutStep.Address))
                      )
                    }
                  >
                    Go back
                  </span>
                </div>
              </>
            ) : (
              !loading && (
                <div>
                  <button
                    className='btn btnNextStep'
                    style={{ width: 200, lineHeight: 1.25, padding: 10 }}
                    onClick={loadMethods}
                  >
                    Try getting shipping rates again
                  </button>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ShippingMethods
