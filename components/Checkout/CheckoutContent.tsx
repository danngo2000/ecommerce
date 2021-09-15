import React, { useState } from 'react'
import { Step, StepLabel, Stepper, TextField } from '@material-ui/core'
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { IAddress } from 'interfaces'
import Image from 'next/image'
import { imageLoader } from 'utils'
import AddressForm from './Addresses/AddressForm'

const schema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  phone_number: yup.string().required(),
  street: yup.string().required(),
  city: yup.string().required(),
  email: yup.string().email().required(),
  zip_code: yup.string().required(),
  state: yup.string().required(),
  country: yup.string().required()
})

const CheckoutContent = () => {
  const items: any = []
  const total = 0
  const [steps] = useState(['Address', 'Delivery', 'Payment'])
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    window.scrollTo({ top: 0 })
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const methods = useForm<IAddress>({
    resolver: yupResolver(schema)
  })

  const handleSubmit: SubmitHandler<IAddress> = (address: IAddress) => {
    console.log('address checkout', address)
    handleNext()
  }

  return (
    <div className='container checkout-page-box'>
      <div className='checkout-page-wrap'>
        <div className='checkout-header'>
          <div className='progress-cartBar'>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        </div>
        <div className='checkout-content'>
          <div className='column-address'>
            <div></div>
            <div
              className={`step grow step-address ${
                activeStep === 0 ? 'active' : ''
              }`}
            >
              <h3>
                <span className='number'>1</span>
                Delivery Contact &amp; Address
              </h3>
              <div className='step-content'>
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(handleSubmit)}>
                    <div className='address-form row'>
                      <AddressForm />
                    </div>
                  </form>
                </FormProvider>

                <button
                  onClick={methods.handleSubmit(handleSubmit)}
                  className='btn btnNextStep'
                >
                  Continue
                </button>
              </div>
            </div>
            <div
              className={`step grow step-shipping ${
                activeStep === 1 ? 'active' : ''
              }`}
            >
              <h3>
                <span className='number'>2</span>
                Shipping methods
              </h3>
              <div className='step-content'>
                <div className='shipping-options'>Can't get shipping cost</div>
                <div className='buttons'>
                  <button onClick={handleNext} className='btn btnNextStep'>
                    Continue
                  </button>
                  <span onClick={handleBack} className='go-back'>
                    Go back
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`step grow step-payment ${
                activeStep === 2 ? 'active' : ''
              }`}
            >
              <h3>
                <span className='number'>2</span>
                Payment methods
              </h3>
              <div className='step-content'>
                <div className='shipping-options'>Can't get shipping cost</div>
                <div className='buttons'>
                  <button className='btn place-order'>Place Order Now</button>
                  <span onClick={handleBack} className='go-back'>
                    Go back
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='column-cart-totals'>
            <div className='checkout-sidebar'>
              <p>
                Need Assistance?&nbsp;
                <a>cs@name.vn</a>
              </p>
              <div className='order-summary'>
                <div className='cart-summary'>
                  <div className='table-cart'>
                    <div className='table'>
                      {items.map((item: any) => (
                        <div key={item.id} className='table-row table-conten'>
                          <div className='table-cell'>
                            <Image
                              loader={imageLoader}
                              src='/images/media/default.png'
                              width={90}
                              height={110}
                              objectFit='contain'
                              alt=''
                            />
                          </div>
                          <div className='table-cell item-name'>
                            Fit & Fresh Bento Lunch Set, Teal Pasiley
                            <div className='item-qty'>Qty: {item.quantity}</div>
                          </div>
                          <div className='table-cell subtotal'>
                            <p className='price'>${item.price}</p>
                            {/* <p className='original-price'>
                              $7.00
                            </p> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='cart-footer'>
                    <div className='cart-total-wrap'>
                      <div className='row-total'>
                        <div className='title'>Subtotal</div>
                        <span>${total}</span>
                      </div>
                      <div className='row-total'>
                        <div className='title'>Discount</div>
                        <span>- $0.00</span>
                      </div>
                      <div className='row-total'>
                        <div className='title'>Tax</div>
                        <span>$0.00</span>
                      </div>
                      <div className='row-total'>
                        <div className='title'>Shipping Fee</div>
                        <span>$0.00</span>
                      </div>
                      <div className='row-total row-grand-total'>
                        <div className='title'>Gradn total incl tax</div>
                        <span>${total}</span>
                      </div>
                    </div>
                    <div className='coupon-box'>
                      <div className='coupon-input'>
                        <input
                          className='input'
                          type='text'
                          placeholder='Coupon (Optional)'
                        />
                      </div>
                      <button className='btn'>Apply</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutContent
