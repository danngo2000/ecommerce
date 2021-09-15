import React, { memo, useEffect, useState } from 'react'
import { RightOutlined } from '@ant-design/icons'
// import { T, t } from 'locales'
import Link from 'next/link'
import ProductItem from '../Product/ProductItem'
import Lazy from 'react-lazyload'
import axios from 'axios'
import { useSelector } from 'react-redux'

const calcRanges = (count, gap = 30) => {
  let ranges = []
  let from = 0
  let to = gap
  while (count >= to) {
    ranges.push([from, to - 1])
    from = to
    to = from + gap
  }
  if (from + 1 === count) ranges.push([from, null])
  else if (from < count) ranges.push([from, count - 1])
  return ranges
}

export default memo((props) => {
    console.log("props", props);
  const ranges = calcRanges(props.count, 12)
  const _config = useSelector((state) => state.config)
  const theme = _config['site/theme']
  return (
    <div className='container'>
      {theme === 'imex-food' ? (
        <div className='outside-header'>
          <h3>{props.title}</h3>
        </div>
      ) : (
        ''
      )}
      <article className='featuredBox dealZone WrapItem'>
        <div className='header'>
          {[
            'orange-theme',
            'pink-theme',
            'yellow-theme',
            'green-theme'
          ].includes(theme) ? (
            <div className='heading'>
              <h2>
                <span>{props.title}</span>
              </h2>
            </div>
          ) : (
            ''
          )}
          {props.viewAllLink && (
            <div className='viewAllAction'>
              <Link
                as={`/c/${props.viewAllLink}`}
                href={`/category?categorySlug=${props.viewAllLink}`}
              >
                <a>
                  <span>
                    Shop All
                    <RightOutlined />
                  </span>
                </a>
              </Link>
            </div>
          )}
        </div>
        {ranges.map((range, i) => (
          <Lazy key={i} offset={i === 0 ? 700 : 400} height='350px'>
            <LazyComponent range={range} id={props.id} />
          </Lazy>
        ))}
      </article>
    </div>
  )
})

const LazyComponent = ({ id, range: [from, to] }) => {
  const [products, setProducts] = useState(null)
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: { products, error }
        } = await axios.get(`storefront/home/${id}?range=${from}-${to}`)
        if (products) {
          setProducts(products)
        }
        if (error) console.log(error)
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [])

  return products ? (
    <div className='contentZone lazyList ItemBox'>
      {products.map((product, i) => (
        <ProductItem
          key={i}
          showAddToCartButton
          openNewWindow={false}
          product={product}
          noCol
        />
      ))}
    </div>
  ) : null
}
