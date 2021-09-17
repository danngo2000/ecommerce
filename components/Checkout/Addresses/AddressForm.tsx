import React, { CSSProperties, useEffect, useState, FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Input, Row, Col, Select, Button, Radio } from 'antd'
import { RootState } from 'store'
import { useSelector } from 'react-redux'
import Countries from 'models/Static/Countries.json'
import statesOnUs from 'models/Static/statesOnUs.json'
import { ShoppingOutlined, HomeOutlined } from '@ant-design/icons'
import axios from 'axios'

const colStyle: CSSProperties = {
  flexDirection: 'column'
}

const getLabelAndValue = (item: any) => {
  let value: string | number = item.value || item.id || item.code || item.name
  let label: string = item.label || item.name
  return [`${label}`, `${value}`]
}

const AddressForm: FC<any> = () => {
  const {
    setValue,
    watch,
    control,
    formState: { errors },
    formState
  } = useFormContext()

  const allowedCountries = useSelector(
    (state: RootState) => state.config['shipping/allowed_countries']
  )
  const [provinceOptions, setProvinceOptions] = useState([])
  const [districtOptions, setDistrictOptions] = useState([])
  const [wardOptions, setWardOptions] = useState([])
  const [countryOptions, setCountryOptions] = useState<any>([])
  const [rdi, setRdi] = useState('commercial')

  useEffect(() => {
    if (allowedCountries instanceof Array) {
      if (allowedCountries.includes('*')) setCountryOptions(Countries)
      if (allowedCountries.length === 1 && allowedCountries.includes('US')) {
        setValue('country', 'US')
        setCountryOptions([Countries[0]])
      } else if (
        allowedCountries.length === 1 &&
        allowedCountries.includes('VN')
      ) {
        setValue('country', 'VN')
        setCountryOptions(
          Countries.filter((c) => allowedCountries.includes(c.value))
        )
      } else if (!allowedCountries.includes('*')) {
        setCountryOptions(
          Countries.filter((c) => allowedCountries.includes(c.value))
        )
      }
    } else setCountryOptions(Countries)
  }, [allowedCountries, watch('country')])

  useEffect(() => {
    if (watch('country') === 'VN' && !provinceOptions.length) {
      axios
        .get(`addressBooks/region`)
        .then((res) => setProvinceOptions(res.data))
        .catch((e) => console.error(e.message))
    }
  }, [watch('country')])

  useEffect(() => {
    if (formState.isDirty) {
      setValue('district', '')
      setValue('ward', '')
    }
    if (watch('country') === 'VN' && watch('province')) {
      setDistrictOptions([])
      axios
        .get(`addressBooks/region?province=${watch('province')}`)
        .then((res) => setDistrictOptions(res.data))
        .catch((e) => console.error(e.message))
    }
  }, [watch('province')])

  useEffect(() => {
    if (formState.isDirty) {
      setValue('ward', '')
    }
    if (watch('country') === 'VN' && watch('district')) {
      setWardOptions([])
      axios
        .get(
          `addressBooks/region?province=${watch('province')}&district=${watch(
            'district'
          )}`
        )
        .then((res) => setWardOptions(res.data))
        .catch((e) => console.error(e.message))
    }
  }, [watch('district')])

  const countryWatch = watch('country')

  const handledRdi = (event: any) => {
    const { value } = event.target
    setRdi(value)
    setValue('rdi', value)
  }

  const handlePlaceSelect = () => {}

  return (
    <React.Fragment>
      <Row gutter={[8, 12]}>
        <Col md={12} sm={24} style={colStyle}>
          <label>First Name</label>
          <Controller
            name='first_name'
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder='First Name' />
            )}
          />
          {errors.first_name && (
            <p className='error'>{errors.first_name.message}</p>
          )}
        </Col>
        <Col md={12} sm={24} style={colStyle}>
          <label>Last Name</label>
          <Controller
            name='last_name'
            control={control}
            render={({ field }) => <Input {...field} placeholder='Last Name' />}
          />
          {errors.last_name && (
            <p className='error'>{errors.last_name.message}</p>
          )}
        </Col>
        <Col md={12} sm={24} style={colStyle}>
          <label>Email Address</label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input {...field} type='email' placeholder='Email address' />
            )}
          />
          {errors.email && <p className='error'>{errors.email.message}</p>}
        </Col>
        <Col md={12} sm={24} style={colStyle}>
          <label>Phone Number</label>
          <Controller
            name='phone_number'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type='number'
                placeholder='Mobile Number'
                id='autocomplete'
              />
            )}
          />
          {errors.phone_number && (
            <p className='error'>{errors.phone_number.message}</p>
          )}
        </Col>
        <Col span={24} style={colStyle}>
          <label>Address</label>
          <Controller
            name='address'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Your address, Apartment/Building Name'
              />
            )}
          />
          {errors.address && <p className='error'>{errors.address.message}</p>}
        </Col>
        {countryWatch === 'VN' && (
          <Col md={12} sm={24} style={colStyle}>
            <label>Province</label>
            <Controller
              name='province'
              control={control}
              render={({ field }) => (
                <Select {...field} size='large'>
                  <Select.Option value=''>Select your Province</Select.Option>
                  {provinceOptions.map((item: any, index) => {
                    const [label, value] = getLabelAndValue(item)
                    return (
                      <Select.Option key={index} value={value}>
                        {label}
                      </Select.Option>
                    )
                  })}
                </Select>
              )}
            />
            {errors.province && (
              <p className='error'>{errors.province.message}</p>
            )}
          </Col>
        )}
        {countryWatch !== 'VN' && (
          <Col md={12} sm={24} style={colStyle}>
            <label>Zipcode/Postcode</label>
            <Controller
              name='zip_code'
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder='Zip code' />
              )}
            />
            {errors.zip_code && (
              <p className='error'>{errors.zip_code.message}</p>
            )}
          </Col>
        )}
        <Col md={12} sm={24} style={colStyle}>
          <label>Country</label>
          <Controller
            name='country'
            control={control}
            render={({ field }) => (
              <Select {...field} size='large'>
                <Select.Option value=''>Select your country</Select.Option>
                {countryOptions.map((item: any, index) => {
                  const [label, value] = getLabelAndValue(item)
                  return (
                    <Select.Option key={index} value={value}>
                      {label}
                    </Select.Option>
                  )
                })}
              </Select>
            )}
          />
          {errors.country && <p className='error'>{errors.country.message}</p>}
        </Col>
        {countryWatch === 'US' && (
          <Col md={12} sm={24} style={colStyle}>
            <label>State</label>
            <Controller
              name='state'
              control={control}
              render={({ field }) => (
                <Select {...field} size='large'>
                  <Select.Option value=''>Select your state</Select.Option>
                  {statesOnUs.map((item: any, index) => {
                    const [label, value] = getLabelAndValue(item)
                    return (
                      <Select.Option key={index} value={value}>
                        {label}
                      </Select.Option>
                    )
                  })}
                </Select>
              )}
            />
            {errors.state && <p className='error'>{errors.state.message}</p>}
          </Col>
        )}
        {!['VN', 'US'].includes(countryWatch) && (
          <Col md={12} sm={24} style={colStyle}>
            <label>State</label>
            <Controller
              name='state'
              control={control}
              render={({ field }) => <Input {...field} placeholder='State' />}
            />
            {errors.state && <p className='error'>{errors.state.message}</p>}
          </Col>
        )}
        {countryWatch !== 'VN' && (
          <Col md={12} sm={24} style={colStyle}>
            <label>City</label>
            <Controller
              name='city'
              control={control}
              render={({ field }) => <Input {...field} placeholder='City' />}
            />
            {errors.city && <p className='error'>{errors.city.message}</p>}
          </Col>
        )}
        {countryWatch === 'VN' && (
          <Col md={12} sm={24} style={colStyle}>
            <label>District</label>
            <Controller
              name='district'
              control={control}
              render={({ field }) => (
                <Select {...field} size='large'>
                  <Select.Option value=''>Select your District</Select.Option>
                  {(districtOptions || []).map((item: any, index) => {
                    const [label, value] = getLabelAndValue(item)
                    return (
                      <Select.Option key={index} value={value}>
                        {label}
                      </Select.Option>
                    )
                  })}
                </Select>
              )}
            />
            {errors.district && (
              <p className='error'>{errors.district.message}</p>
            )}
          </Col>
        )}
        {countryWatch === 'VN' && (
          <Col md={12} sm={24} style={colStyle}>
            <label>Ward</label>
            <Controller
              name='ward'
              control={control}
              render={({ field }) => (
                <Select {...field} size='large'>
                  <Select.Option value=''>Select your Ward</Select.Option>
                  {(wardOptions || []).map((item: any, index) => {
                    const [label, value] = getLabelAndValue(item)
                    return (
                      <Select.Option key={index} value={value}>
                        {label}
                      </Select.Option>
                    )
                  })}
                </Select>
              )}
            />
            {errors.ward && <p className='error'>{errors.ward.message}</p>}
          </Col>
        )}

        <Col md={12} sm={24}>
          <Controller
            name='rdi'
            control={control}
            render={({ field }) => (
              <Radio.Group
                {...field}
                className='input-box'
                onChange={handledRdi}
                value={rdi}
              >
                <label className='delivery-label'>
                  Select a label for effective delivery
                </label>
                <div className='delivery-option'>
                  <Radio.Button className='office-btn' value='commercial'>
                    <ShoppingOutlined className='office-icon' />
                    &nbsp;OFFICE
                  </Radio.Button>
                  <Radio.Button className='home-btn' value='residential'>
                    <HomeOutlined className='home-icon' />
                    &nbsp;HOME
                  </Radio.Button>
                </div>
              </Radio.Group>
            )}
          />
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default AddressForm
