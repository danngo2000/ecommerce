import React, { useState, useEffect } from 'react'
import { DeleteIcon, EditIcon } from '../../Icons'
import { useRouter } from 'next/router'
import { Button } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import axios from 'axios'
import Link from 'next/link'
import SkeletonLoad from './Skeleton'
import {CartActions} from 'store/reducers/cart'

// import { setDefaultAddresses } from 'actions/cart'

const AddressBooks = () => {
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [addressBooks, setAddressBooks] = useState<any>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const getAddressBooks = async () => {
    try {
      setIsLoading(true)
      const {
        data: { addressBooks, total }
      } = await axios.get(`addressBooks/customer?page=${page}&limit=${limit}`)
      setAddressBooks(addressBooks)
      setTotal(total)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (removeId: string) => {
    if (removeId === null) return
    const res = await axios.delete(`addressBooks/customer/${removeId}`)
    const { data: { addressBooks, total } } = await axios.get(`addressBooks/customer?page=${page}&limit=${limit}`)
    setAddressBooks(addressBooks)
    setTotal(total)
    if (res.data.newAddress) {
      CartActions.SET_ADDRESS_DEFAULT(res.data.newAddress)
      // setDefaultAddresses(res.data.newAddress)
    }
  }

  useEffect(() => {
    getAddressBooks()
  }, [])

  return (
    <div className='my-account-content address-page'>
      <div className='my-account-title'>
        <div className='title'>
          <Button
            className='back-icon'
            onClick={() => router.push('/customer')}
          >
            <ArrowBackIcon />
          </Button>
          <h1>Addresses</h1>
        </div>

        <p> Add, remove and select preferred addresses</p>
        <button
          onClick={() => router.push('/customer/addaddressbook')}
          className='btn btn-add-new-address'
          type='button'
        >
          Add New Address
        </button>
      </div>
      {isLoading ? <SkeletonLoad /> : ''}
      
      {addressBooks.map((i: any, index: number) => (
        <div key={index} className='card-item'>
          <div className='column column-name'>
            <label>Name</label>
            {i.first_name} {i.last_name}
          </div>
          <div className='column column-address'>
            <label>Address</label>
            {i.street}, {i.city}, {i.state}, {i.country}, {i.zip_code}
          </div>
          <div className='column column-phone'>
            <label>Phone</label>
            {i.phone_number}
          </div>
          <div className='column column-actions'>
            <Link href={`/customer/addressbook/${i._id}`}>
              <Button>
                <EditIcon />
              </Button>
            </Link>

            <Button
              onClick={() => {
                if (window.confirm('Are you sure wish to delete this item?')) {
                  handleDelete(i._id)
                }
              }}
            >
              <DeleteIcon />
            </Button>
          </div>
        </div>
      ))}
      <div className='pagination-container'>
        <Pagination count={1} shape='rounded' />
      </div>
    </div>
  )
}

export default AddressBooks
