import { Button } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import { DeleteIcon } from 'components/Icons'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { imageLoader } from 'utils'
import axios from 'axios'
import Notification from 'components/Notification'

const ProductImage = ({ images, href }) => {
  let smallImg = ''
  let mediumImg = ''

  if (images.length > 0) {
    images.forEach((elm) => {
      smallImg = elm.url
    })
  } else {
    if (images?.small?.length > 0) {
      smallImg = images.small[0]
    }
    if (images?.medium?.length > 0) {
      mediumImg = images.medium[0]
    }
  }

  return (
    <div className='column thumb'>
      <Link href={`/p/${href}`}>
        <a>
          <Image
            loader={imageLoader}
            src={smallImg}
            width={130}
            height={133.33}
            objectFit='contain'
            alt=''
          />
        </a>
      </Link>
    </div>
  )
}

const MyWishlist = () => {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [wishlists, setWishlists] = useState([])
  const [total, setTotal] = useState(0)
  const [notification, setNotification] = useState(false)

  const getWishlists = async () => {
    const {
      data: { wishlists, total }
    } = await axios.get(`wishlists/customer?limit=${limit}&page=${page}`)
    setWishlists(wishlists.filter((item) => !!item._id))
    let count = 1
    for (let i = 0; i + 10 < total; i++) {
      count = count + i
    }
    setTotal(count)
  }

  const handlePageChange = (event: any, value: any) => {
    setPage(value)
    window.scroll({ top: 0 })
  }

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(`wishlists/customer/${_id}`)
      if (wishlists.length <= 1 && page > 1) setPage(page - 1)
      else getWishlists()
      setNotification(true)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setNotification(false)
  }

  useEffect(() => {
    getWishlists()
  }, [page])


  return (
    <div className='my-account-content wishlist-page'>
      <div className='my-account-title'>
        <div className='title'>
          <Button
            className='back-icon'
            onClick={() => router.push('/customer')}
          >
            <ArrowBackIcon />
          </Button>
          <h1>My Wishlist</h1>
        </div>
      </div>
      <div className='wishlist-list'>
        {wishlists &&
          wishlists.map((i: any, index) => (
            <div key={index} className='wishlist-item'>
              <ProductImage href={i._source.slug} images={i._source.images} />
              <div className='column column-name'>
                <Link href={`/p/${i._source.slug}`}>
                  <a className='name'>{i._source.name}</a>
                </Link>
              </div>
              <div className='column column-price'>
                <span>${i._source.price}</span>
              </div>
              <div className='column column-delete'>
                <Button onClick={() => handleDelete(i._id)}>
                  <DeleteIcon className='icon' />
                </Button>
              </div>
            </div>
          ))}
      </div>
      <div className='pagination-container'>
        <Pagination
          onChange={handlePageChange}
          defaultPage={page}
          count={total}
          shape='rounded'
        />
      </div>
      <Notification
        onClose={handleClose}
        isOpen={notification}
        info='Deleted successfully'
      />
    </div>
  )
}

export default MyWishlist
