import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import qs from 'qs'
import Pagination from 'rc-pagination'
import { IAddress } from 'interfaces'
import { Modal, notification, Radio } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { FormProvider, useForm } from 'react-hook-form'
import AddressForm from './AddressForm'
import { setAddressBooking } from 'actions/booking'
import { setCartAddress } from 'actions/cart'

const emptyAddress: Partial<IAddress> = {
  first_name: '',
  last_name: '',
  rdi: 'commercial',
  country: '',
  province: ''
}

type AddressDialogFormProps = {
  visible: boolean
  onClose: (newAddress?: IAddress) => void
  defaultValues: Partial<IAddress>
}
const AddressDialogForm = (props: AddressDialogFormProps) => {
  const { visible, onClose, defaultValues } = props
  const methods = useForm<IAddress>()

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const handleSubmit = async (address: IAddress) => {
    try {
      const payload: any = {
        address
      }
      const { data } = defaultValues?._id
        ? await axios.put(`addressBooks/customer/${defaultValues._id}`, payload)
        : await axios.post('addressBooks/customer', payload)
      const newAddress = data.addressBook
      notification.info({ message: 'Successfully updated' })
      onClose(newAddress)
    } catch (e) {
      console.error(e.message)
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={() => onClose()}
      closable
      maskClosable
      width={1000}
      centered
      footer={null}
      className='ant-address-form'
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <AddressForm />
          <div style={{ display: 'flex', paddingTop: 14 }}>
            <div style={{ flex: '1 1 0%' }} />
            <div style={{ flexBasis: 'auto' }}>
              <button type='submit' className='btn add-btn'>
                <span>
                  {defaultValues?._id ? 'Update Address' : 'Add Address'}
                </span>
              </button>
              <button
                type='button'
                style={{ marginLeft: 14 }}
                className='btn add-btn'
                onClick={() => onClose()}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}

const limit = 10

type AddressListProps = {
  addressKey?: 'billing' | 'shipping'
  currentId?: string
  setOpenAddressForm?: (open: boolean) => void
  setAddressKey?: (key: 'billing' | 'shipping') => void
}
const AddressList = (props: AddressListProps) => {
  const [isOpen, setOpen] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const [addresses, setAddresses] = useState<IAddress[]>([])
  const dispatch = useDispatch()
  // if not null, address form modal/dialog will show up
  const [formAddress, setFormAddress] = useState<Partial<IAddress> | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const theme = useSelector((state: RootState) => state.config['site/theme'])
  const isGuest = useSelector((state: RootState) => state.auth.isGuest)
  const { currentId } = props

  const fetch = (page) =>
    axios
      .get(`addressBooks/customer?${qs.stringify({ page, limit })}`)
      .then((res) => res.data)
      .then((data) => {
        const found = data.addressBooks.find(
          (address: IAddress) => address._id === currentId
        )
        if (found) setSelectedId(currentId)
        else setSelectedId(null)

        setAddresses(data.addressBooks)
        setTotal(data.total)
      })
      .catch((e) => console.error(e.message))

  useEffect(() => {
    fetch(page).then()
  }, [isOpen, page])

  const handleEdit = (address: IAddress) => {
    setFormAddress(address)
  }

  const handleFormClose = (newAddress?: IAddress) => {
    if (newAddress) {
      if (page === 1) fetch(1).then()
      else setPage(1)

      if (newAddress._id === currentId) {
        dispatch(setCartAddress(newAddress, props.addressKey))
      }
    }
    setFormAddress(null)
  }

  const handleClose = () => setOpen(false)

  const handleChooseAddress = async () => {
    const address = addresses.find((address) => address._id === selectedId)
    if (address) {
      dispatch(setCartAddress(address, props.addressKey))
      dispatch(setAddressBooking(address, 'undefind'))
    }
    handleClose()
  }

  const handleLinkClick = () => {
    // props.setAddressKey(props.addressKey)
    // if (!(addresses && addresses.length)) {
    //   props.setOpenAddressForm(true)
    // } else if (!isGuest) setOpen(true)
    // else dispatch(setCartAddress(null))
  }

  return (
    <div className='actionChangeAddress'>
      <Modal
        visible={isOpen}
        className='AddressDialog'
        closable
        maskClosable
        onCancel={handleClose}
        width={1000}
        centered
        footer={null}
      >
        <AddressDialogForm
          visible={!!formAddress}
          onClose={handleFormClose}
          defaultValues={formAddress}
        />
        <div className={`${theme} ant-modal-body-content`}>
          <div className='AddressList'>
            <div className='headerContent'>
              <h3>Address Book</h3>
              <a
                className='addNewAddress'
                onClick={() => setFormAddress(emptyAddress)}
              >
                Add new Address
              </a>
            </div>
            <Radio.Group
              className='table'
              value={selectedId}
              onChange={(e: any) => setSelectedId(e.target.value)}
            >
              <div className='table-row table-header'>
                <div className='table-cell' />
                <div className='table-cell'>Name</div>
                <div className='table-cell'>Address</div>
                <div className='table-cell'>Telephone</div>
                <div className='table-cell' />
              </div>
              {addresses.map((address) => (
                <div className='table-row table-content' key={address._id}>
                  <div className='table-cell'>
                    <Radio value={address._id} />
                  </div>
                  <div className='table-cell item-name'>
                    {address.first_name} {address.last_name}
                  </div>
                  {['VN'].includes(address.country) ? (
                    <div className='table-cell address'>
                      {address.rdi === 'residential' && (
                        <span className='delivery-home'>HOME</span>
                      )}
                      {address.rdi === 'commercial' && (
                        <span className='delivery-office'>OFFICE</span>
                      )}
                      {address.display_address} - {address.ward} -{' '}
                      {address.street} - {address.country}
                    </div>
                  ) : (
                    <div className='table-cell address'>
                      {address.rdi === 'residential' && (
                        <span className='delivery-home'>HOME</span>
                      )}
                      {address.rdi === 'commercial' && (
                        <span className='delivery-office'>OFFICE</span>
                      )}
                      {/* {address.city} - {getFullAddress(address.state, 'state')}{' '}
                      - {address.street} - {address.country} -{' '}
                      {address.zip_code} */}
                    </div>
                  )}
                  <div className='table-cell phoneNumber'>
                    {address.phone_number?.replace(
                      /(\d{3})(\d{3})(\d{4})/,
                      '($1) $2-$3'
                    )}
                  </div>
                  <div className='table-cell actions'>
                    <span
                      className='link addressEdit'
                      onClick={() => handleEdit(address)}
                    >
                      Edit
                    </span>
                  </div>
                </div>
              ))}
            </Radio.Group>
            <div style={{ display: 'flex', paddingTop: 14 }}>
              <div style={{ flex: '1 1 0%' }}>
                {React.createElement(Pagination as any, {
                  total,
                  onChange: setPage,
                  current: page,
                  pageSize: limit
                })}
              </div>
              <div style={{ flexBasis: 'auto' }}>
                <button
                  className='btn add-btn'
                  disabled={!selectedId}
                  onClick={handleChooseAddress}
                >
                  Choose Address
                </button>
                <button
                  style={{ marginLeft: 14 }}
                  className='btn add-btn'
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {!(isGuest && props.addressKey === 'shipping') && (
        <a className='action manageAddresses' onClick={handleLinkClick}>
          Change Address
        </a>
      )}
    </div>
  )
}

export default AddressList
