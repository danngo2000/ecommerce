import { makeOrderItemLink } from 'utils'
import Link from 'next/link'
// import SellerLink from '../Seller/Components/SellerLink'
import { Button, Col } from 'antd'
import React from 'react'
import NoticeStock from '../Product/Notice/Stock'
import Price from '../Product/Price'

const getThumbnail = (item = {}) => {
  if (item.images[0]) return item.images[0].url
  if (item.configurable_product && item.configurable_product.images.length) {
    let found = item.configurable_product.images.find(
      (image) => item.size_type === 'small'
    )
    if (found) return found.url
  }
  return null
}

export default ({ total, items, handleAdd, handleRemove, handleShowAll }) => (
  <Col style={{ justifyContent: 'center' }}>
    <div className='saved-for-later'>
      <h4 className='sft-heading'>
        Saved for later <small>({total} items)</small>
      </h4>
      <div className='sft-wrapper'>
        {Array.isArray(items) &&
          items.map((item, index) => {
            const saleOfPercent = Math.round(
              100 - (item.price / item.original_price) * 100
            )

            let thumbnail = getThumbnail(item)

            let imgThumbTag = thumbnail ? (
              <img className='item-thumb' src={thumbnail} />
            ) : (
              <img className='item-thumb noImgThumb' alt='' />
            )

            let [href, _as] = makeOrderItemLink({ ...item, product: item }) // TODO: cfg product

            return (
              <div
                className='grid-container-fluid grid-5 grid-sm-3 cart-item'
                key={item._id}
              >
                <div>{imgThumbTag}</div>
                <div className='grid-col-2-4 grid-col-sm-2-4'>
                  {item.brand && <p className='item-brand'>{item.brand}</p>}

                  <Link href={href} as={_as}>
                    <a className='item-title'>{item.name}</a>
                  </Link>

                  <div className='priceWrap'>
                    {saleOfPercent > 0 ? (
                      <>
                        <div className='price hasSaleOf'>
                          <Price price={item.price} />
                        </div>
                        <div className='saleOfDiv'>
                          <span className='originalPrice'>
                            <Price price={item.original_price} />
                          </span>
                          <span className='saleOfPercent'>
                            Sale {saleOfPercent}% off
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className='price'>
                        <Price price={item.price} />
                      </div>
                    )}
                  </div>
                  <NoticeStock product={item} />
                  {/* <SellerLink seller={item.seller} /> */}
                </div>
                <div className='grid-col-sm-1-3 actions-group'>
                  <div className='actions-wrapper cart-actions'>
                    <Button
                      disabled={item.quantity <= 0}
                      onClick={() => handleAdd(item, index)}
                    >
                      Add To Cart
                    </Button>
                    <Button
                      type='link'
                      onClick={() => handleRemove(item, index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        {handleShowAll && total >= 5 && (
          <div className='sfl-show-all container'>
            <Button type='link' onClick={handleShowAll}>
              Show all&nbsp;{total}&nbsp;items
            </Button>
          </div>
        )}
      </div>
    </div>
  </Col>
)
