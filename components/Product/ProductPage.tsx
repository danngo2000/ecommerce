import SearchSidebar from 'components/Search/SearchSiderbar'
import React, { useEffect, useState } from 'react'
import ProductList from './ProductList'
import Pagination from '@material-ui/lab/Pagination'
import { FaFilter } from 'react-icons/fa'
import Router from 'next/router'
import qs from 'qs'
import Layout from 'components/Layout'


const ProductPage = (props:any) => {
  const {pageName, data, query, title} = props
  const products = data ? data.data : null
  const [sortBy, setSortBy] = useState('')
  const [rating, setRating] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  let limitPage = Math.ceil(data.meta.total / data.meta.limit)
  
  
  const pushToRouter = (params:any) => {
    let queryStr = ''
    const keysOverride = Object.keys(params)
    for (let i in keysOverride) {
      query[keysOverride[i]] = params[keysOverride[i]]
    }

    switch (pageName) {
      case 'category':
        let { categorySlug, brands} = query
        delete query.categorySlug
        if(Array.isArray(brands)) query.brands = brands.toString()
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
        if(Array.isArray(brands_search)) query.brands = brands_search.toString()
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

  const handleLimitChange = (event: any) =>{
    const limit:any = parseInt(event.target.value)
    pushToRouter({limit})
  }

  const handlePageChange = (event:any, value:any) => {
    window.scrollTo(0, 0)
    const page = value
    pushToRouter({ page })
  }

  const handleSortByChange = (event: any) => {
    const sortBy = event.target.value
    pushToRouter({ sortBy })
    setSortBy(event.target.value)
  }

  const handleRangeChange = (price: number) => {}

  const handleRatingChange = (rating: any) => {
    setRating(rating)
  }

  const toggleSideBar = () => {
    setIsOpen(!isOpen)
  }

  const handleBrandChange = (brands:any) => {
    pushToRouter({ brands: brands, page: 1 })
  }

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 120) {
        setScrolled(true)
      } else setScrolled(false)
    })
    return () => {
      window.removeEventListener("scroll", () => {})
    }
  }, [])


  return (
    <Layout page='category-page'>
      <div className='search-product-page container'>
        <div
          onClick={toggleSideBar}
          className={`product-filter-sidebar-overlay ${isOpen && "open"}`}
        />
        <div className={`product-filter-sidebar ${isOpen && 'open'}`}>
          <SearchSidebar 
            onRatingChange={handleRatingChange} 
            category={data.category}
            categories={data.facet.categories}
            data={data.data}
            facet={data.facet}
            meta={data.meta}
            onBrandChange={handleBrandChange}
            query={query}
          />
        </div>
        <div className='product-container'>
          <div className='product-title'>
            <h2 className='category-title'>{title}</h2>
            <div className={`toolbar ${scrolled ? 'scrolled' : ''}`}>
              <span className='category-title' style={{ display: 'none' }}></span>
              <span className='total-item'>{data.meta.total} {data.meta.total > 1 ? 'items' : 'item'}</span>
              <div className='select-wrap sortby-select custom-select'>
                <select onChange={handleSortByChange} value={sortBy}>
                  <option value=''>Sort by...</option>
                  <option value='Newest'>Newest</option>
                  <option value='PriceLowToHigh'>Price: Low to High</option>
                  <option value='PriceHighToLow'>Price: High to Low</option>
                </select>
              </div>
              <div className='select-wrap limit-page-select custom-select'>
                <span>Limit:</span>
                <select
                  onChange={handleLimitChange}
                >
                  <option value='16'>16</option>
                  <option value='24'>24</option>
                  <option value='48'>48</option>
                  <option value='56'>56</option>
                </select>
              </div>
              <div onClick={toggleSideBar} className='toggle-filter'>
                <FaFilter />
                <span>Filter</span>
              </div>
            </div>
          </div>

          <div className='product-list'>
          {
            products.length > 0 ? <ProductList productList={products} /> : <div className='searchProductEmpty'>No products on this category.</div>
          }
          </div>
          <div className='pagination-container'>
            {
              (limitPage>1) && 
              <Pagination
                count={limitPage}
                defaultPage={parseInt(query.page) || 1}
                onChange={handlePageChange}
              />
            }
          </div>
        </div>
      </div>
  
    </Layout>
  )
}

export default ProductPage
