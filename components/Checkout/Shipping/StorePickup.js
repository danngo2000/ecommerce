import React, { useState, useEffect, useCallback } from 'react'
import { DatePicker, Select } from 'antd'
import axios from 'axios'
import moment from 'moment'

const { Option } = Select

const StorePickup = () => {
  const [stores, setStores] = useState([])
  const [selectedStore, setSelectedStore] = useState()

  const fetchStore = useCallback(() => {
    axios
      .get('/store-pickup')
      .then(({ data }) => {
        setStores(data.stores)
      })
      .catch((e) => console.log(e.message))
  }, [])

  useEffect(() => {
    fetchStore()
  }, [])

  const handleStoreChange = (storeCode) => {
    setSelectedStore(
      stores.find((store) => store.pickup_location_code === storeCode)
    )
  }

  const onHandleDateChange = (e) => {
    console.log('date picker', e._d)
    console.log('type', e._d.getDate())
  }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day')
  }

  return (
    <>
      <span>Pickup Store</span>
      <Select placeholder={t('Choose the Store')} onChange={handleStoreChange}>
        {stores &&
          stores.map((store, index) => (
            <Option key={index} value={store.pickup_location_code}>
              {store.name}
            </Option>
          ))}
      </Select>
      <br />
      <br />
      {selectedStore && (
        <>
          <div>
            {selectedStore.name}
            <br />
            {selectedStore.street}
            {selectedStore.city && `, ${selectedStore.city}`}
            {selectedStore.region && `, ${selectedStore.region}`}
            <br />
            tel:
            {selectedStore.phone}
          </div>
          <br />
          Pickup Date and Time
          <br />
          <DatePicker
            onChange={onHandleDateChange}
            format='DD-MM-YYYY HH:mm:ss'
            disabledDate={disabledDate}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          />
        </>
      )}
    </>
  )
}

export default StorePickup
