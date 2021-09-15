import React, { FC, useEffect, useState } from 'react'
import { scroller } from 'react-scroll'
import Router from 'next/router'
import qs from 'qs'
import Layout from './Layout'
import Error from './Error'
import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import renderHTML from 'react-render-html'
import classNames from 'classnames'
import { CloseOutlined } from '@ant-design/icons'
import ConditionFilter from './Search/ConditionFilter'
import { Select } from 'antd'
const { Option } = Select

const SearchSidebar = dynamic(() => import('./Search/SearchSiderbar'))
const Pagination = dynamic(() => import('rc-pagination'))
const ProductList = dynamic(() => import('./Search/ProductList'))

interface TypeProps {
  pageName: string
  query: string | any
  data: any
  title: string
  category: any
  nextSeoConfig: any
}

const ProductsSearchCommon: FC<TypeProps> = (props) => {
  const descriptionBox = React.createRef()
  const { pageName, query, data, title, category, nextSeoConfig } = props
  const products = data ? data.data : null
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState()
  const [sortBy, setSortBy] = useState('')

  const config = useSelector((state: any) => state.config)

  const themeSettings = config['site/theme/settings']
  const theme = config['site/theme']

  if (data && data.meta) {
    const limitPage = Math.ceil(data.meta.total / data.meta.limit)
    if (limitPage > 0 && limitPage < query.page) {
      return null
    }
  }

  const scrollTo = (element, offset = 0) => {
    scroller.scrollTo(element, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset
    })
  }

  const pushToRouter = (params: any) => {
    let queryStr = ''
    const keysOverride = Object.keys(params)
    for (let i in keysOverride) {
      query[keysOverride[i]] = params[keysOverride[i]]
    }

    switch (pageName) {
      case 'category':
        let { categorySlug, brands } = query
        delete query.categorySlug
        if (Array.isArray(brands)) query.brands = brands.toString()
        queryStr = qs.stringify(query, { encode: false })
        if (categorySlug) {
          Router.push(`/c/${categorySlug}?${queryStr}`)
        }
        break
      case 'brand':
        let { brandSlug } = query
        delete query.brandSlug
        queryStr = qs.stringify(query, { encode: false })
        if (brandSlug) {
          Router.push(`/b/${brandSlug}?${queryStr}`)
        }
        break
      case 'search':
        let { q } = query
        let brands_search = query.brands
        delete query.q
        if (Array.isArray(brands_search))
          query.brands = brands_search.toString()
        queryStr = qs.stringify(query, { encode: false })
        if (q) {
          Router.push(`/s/${q}?${queryStr}`)
        }
        break
      case 'seller':
        let { sellerSlug } = query
        delete query.sellerSlug
        queryStr = qs.stringify(query, { encode: false })
        if (sellerSlug) {
          Router.push(`/seller/${sellerSlug}?${queryStr}`)
        }
        break
      default:
        break
    }
  }

  const handleBrandChange = (brands: any) => {
    pushToRouter({ brands: brands, page: 1 })
  }

  const handleRangeChange = (price: any) => {}

  const handleRatingChange = (rating: any) => {
    setRating(rating)
  }

  const toggleSideBar = () => {
    setIsOpen(!isOpen)
  }

  const handleSortByChange = (event: any) => {
    const sortBy = event
    pushToRouter({ sortBy })
    setSortBy(event)
  }

  const handleLimitChange = (event: any) => {
    const limit: any = parseInt(event)
    pushToRouter({ limit })
  }

  const handlePageChange = (page: any) => {
    window.scrollTo(0, 0)
    pushToRouter({ page })
  }

  const removeConditionFilter = (data, type, item) => {
    switch (type) {
      case 'brand':
        const tags = data.filter((tag) => tag !== item)
        const brands = tags.map((brand) => brand.value)
        handleBrandChange(brands)
        break
      case 'price':
        handleRangeChange(null)
        break
      case 'rating':
        handleRatingChange(null)
        break
    }
  }

  const removeAllConditionFilter = () => {}

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 120) {
        setScrolled(true)
      } else setScrolled(false)
    })
    return () => {
      window.removeEventListener('scroll', () => {})
    }
  }, [])

  return (
    <Layout
      pageName={`categories-${pageName} categories`}
      q={query && query.q ? query.q : ''}
    >
      {!Array.isArray(products) ? (
        <Error />
      ) : (
        <React.Fragment>
          <NextSeo {...nextSeoConfig} />
          <div className='searchProductPage'>
            {category &&
              category.page_settings &&
              category.page_settings.image_banner &&
              themeSettings &&
              themeSettings.category.showBanner &&
              themeSettings.category.showBanner && (
                <div className='category-banner'>
                  <div className='banner'>
                    <div
                      className={`content ${category.page_settings.class_name}`}
                    >
                      {renderHTML(category.page_settings.banner_content)}
                    </div>
                  </div>
                </div>
              )}
            <div
              className={`productFilterSideBar-overlay ${isOpen && 'open'}`}
              onClick={toggleSideBar}
            />
            <div className={`productFilterSideBar ${isOpen && 'open'}`}>
              <div className='btn-close'>
                <CloseOutlined onClick={toggleSideBar} />
              </div>

              <SearchSidebar
                 minPrice={data.meta.min_price}
                 maxPrice={data.meta.max_price}
                 categories={data.facet.categories}
                 brands={data.facet.brands}
                 attributes={data.facet.attributes}
                 attributesMeta={data.meta.attributes}
                 brandsMeta={data.meta.brands}
                 brandsSelected={query.brands}
                 category={data.category}
                 range={query.price}
                 limit={query.limit}
                 sortBy={query.sortBy}
                 attrsSelected={query.attrs}
                 q={query.q}
                 categorySlug={query.categorySlug}
                 pageName={pageName}
                 rating={query.rating}
                 onRangeChange={handleRangeChange}
                 onBrandChange={handleBrandChange}
                //  onAttributesChange={handleAttributesChange}
                 onRatingChange={handleRatingChange}
                 sellerSlug={query && query.sellerSlug ? query.sellerSlug : ''}
              />

              <div className='btn-groups center'>
                <button className='btn' onClick={toggleSideBar}>
                  Close
                </button>
              </div>
            </div>
            <div className='productContainer'>
              <h3 className='category-title'>{title}</h3>
              <ConditionFilter
                meta={data.meta}
                query={query}
                onRemove={removeConditionFilter}
                onRemoveAll={removeAllConditionFilter}
              />
              <div className={classNames('toolBar', { scrolled })}>
                <span className='category-title'>{title}</span>
                <span className='total-item'>
                  {data.meta.total} {data.meta.total > 1 ? 'items' : 'item'}
                </span>
                <div className='bp3-select sortBySelect custom-select'>
                  <span className='sortSpan'>Sort by</span>
                  <Select
                    className='sort-by-option'
                    dropdownClassName={`category_dropdown ${theme}`}
                    value={query.sortBy || 'Sort By'}
                    onChange={handleSortByChange}
                  >
                    <Option value='BestMatch'>
                      <div className='option_ant_sort'>
                        <p>Best Match</p>
                      </div>
                    </Option>
                    <Option value='Newest'>
                      <div className='option_ant_sort'>
                        <p>Newest</p>
                      </div>
                    </Option>
                    <Option value='PriceLowToHigh'>
                      <div className='option_ant_sort'>
                        <p>Price: Low To High</p>
                      </div>
                    </Option>
                    <Option value='PriceHighToLow'>
                      <div className='option_ant_sort'>
                        <p>Price: High To Low</p>
                      </div>
                    </Option>
                    <Option value='Discount'>
                      <div className='option_ant_sort'>
                        <p>Discount</p>
                      </div>
                    </Option>
                  </Select>
                </div>
                <div className='bp3-select limitPageSelect sortBySelect custom-select'>
                  <span>Limit</span>
                  <Select
                    dropdownClassName={`category_dropdown ${theme}`}
                    onChange={handleLimitChange}
                    value={query.limit || 16}
                  >
                    <Option value='16'>
                      <div className='option_ant_sort'>
                        <p>16</p>
                      </div>
                    </Option>
                    <Option value='28'>
                      <div className='option_ant_sort'>
                        <p>28</p>
                      </div>
                    </Option>
                    <Option value='40'>
                      <div className='option_ant_sort'>
                        <p>40</p>
                      </div>
                    </Option>
                    <Option value='60'>
                      <div className='option_ant_sort'>
                        <p>60</p>
                      </div>
                    </Option>
                  </Select>
                </div>
                <div className='toggle-filter' onClick={toggleSideBar}>
                  <img src='/static/images/svg/toggle-filter.svg' />
                  <span>Filter</span>
                </div>
              </div>
              <div className='productList'>
                {products.length > 0 ? (
                  <ProductList
                    productList={products}
                    q={query && query.q ? query.q : null}
                  />
                ) : (
                  <div className='searchProductEmpty'>
                    No products on this category.
                  </div>
                )}
              </div>
              <div className='paginationContainer'>
                {data &&
                  data.meta.total >
                    (!isNaN(data.meta.limit) ? +data.meta.limit : 16) && (
                    <Pagination
                      onChange={handlePageChange}
                      current={parseInt(query.page) || 1}
                      total={parseInt(data.meta.total)}
                      pageSize={!isNaN(data.meta.limit) ? +data.meta.limit : 16}
                      showLessItems
                      showTitle={false}
                    />
                  )}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </Layout>
  )
}

export default ProductsSearchCommon
