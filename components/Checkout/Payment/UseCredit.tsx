import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Price from '../../Product/Price'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Checkbox } from 'antd'
import { useCredit } from 'actions/cart'

const UseCredit = React.memo(props => {
  const [credit, setCredit] = useState(0)
  const isGuest = useSelector((state: any) => state.auth.isGuest)
  const dispatch = useDispatch()

  const handleUseCreditChange = (e) => {
    const _useCredit = e.target.checked
    if (_useCredit) {
      dispatch(useCredit(credit))
    } else {
      dispatch(useCredit(0))
    }
  }

  const getCredit = async () => {
    try {
      if (isGuest) return
      const { data } = await axios.get('customers/credit')
      setCredit(Math.round(data.credit * 100) / 100)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getCredit()
  }, [])

  if (isGuest) return null

  return (
    <li className='payment-primary checkbox-circle' >
      <Checkbox
        id='use_credit'
        disabled={credit === 0} style={{ marginRight: '10px' }}
        onChange={handleUseCreditChange}
      />
      {
        credit === 0
          ? <label htmlFor='use_credit'>Currently you do not have Coin to payment</label>
          : <label htmlFor='use_credit'>Use {new Intl.NumberFormat().format(credit)} Coin (<Price price={credit}/>) to payment. </label>
      }
    </li>
  )
})
const mapState = (state) => ({
  config: state.config
})

export default connect(mapState)(UseCredit)
