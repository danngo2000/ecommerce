import React, { createElement as c, useEffect, useState } from 'react'
// import { T, t } from 'locales'
import Link from 'next/link'
import PriceRange from './PriceRange'
import Ratings from './Ratings'
import config from 'settings'
import { Checkbox, Input } from 'antd'
import { useSelector, connect } from 'react-redux'
const categoriesMargin = 15

const Categories = React.memo((props) => {
  const {
    categories,
    range,
    minPrice,
    maxPrice,
    limit,
    sortBy,
    brandsSelected,
    brand,
    q,
    sellerSlug,
    rating,
    pageName,
    categorySlug
  } = props
  let _url = ''
  if (limit) {
    _url += `&limit=${limit}`
  }
  if (sortBy) {
    _url += `&sortBy=${sortBy}`
  }
  if (brandsSelected) {
    _url += `&brands=${
      Array.isArray(brandsSelected) ? brandsSelected.join(',') : brandsSelected
    }`
  }
  if (brand) {
    _url += `&brands=${brand}`
  }
  if (q) {
    _url += `&q=${q}`
  }
  if (sellerSlug) {
    _url += `&seller=${sellerSlug}`
  }
  if (rating) {
    _url += `&rating=${rating}`
  }
  // let hasRange = (Array.isArray(range) && range.length === 2) && (range[0] > minPrice || range[1] < maxPrice)
  let hasRange = false
  const asBuilder = (category) => {
    if (pageName === 'seller' && sellerSlug) {
      if (hasRange)
        return `/seller/${sellerSlug}&category=${category.slug}&price=[${range}]${_url}`
      return `/seller/${sellerSlug}&category=${category.slug}${_url}`
    }
    if (hasRange) return `/c/${category.slug}&price=[${range}]${_url}`
    return `/c/${category.slug}${_url}`
  }
  const hrefBuilder = (category) => {
    if (pageName === 'seller' && sellerSlug) {
      if (hasRange)
        return `/seller?sellerSlug=${sellerSlug}&categorySlug=${category.slug}&price=[${range}]${_url}`
      return `/seller?sellerSlug=${sellerSlug}&categorySlug=${category.slug}${_url}`
    }
    if (hasRange)
      return `/category?categorySlug=${category.slug}&price=[${range}]${_url}`
    return `/category?categorySlug=${category.slug}${_url}`
  }
  if (categories) {
    return categories.map((category) => {
      return (
        <li key={category._id}>
          {category.count > 0 ? (
            <React.Fragment>
              <div className='catItem'>
                <Link as={asBuilder(category)} href={hrefBuilder(category)}>
                  <a>
                    <span className='categoryName'>{category.name}</span>
                  </a>
                </Link>
                <span className='count'>{category.count}</span>
              </div>
            </React.Fragment>
          ) : (
            <div className='catItem catItemEmpty'>
              <span className='categoryName'>{category.name}</span>
            </div>
          )}
        </li>
      )
    })
  } else {
    return null
  }
})

const ParentCategories = React.memo((props) => {
  const {
    category,
    limit,
    sortBy,
    brandsSelected,
    brand,
    q,
    sellerSlug,
    rating
  } = props
  let _url = ''
  if (limit) {
    _url += `&limit=${limit}`
  }
  if (sortBy) {
    _url += `&sortBy=${sortBy}`
  }
  if (brandsSelected) {
    _url += `&brands=${
      Array.isArray(brandsSelected) ? brandsSelected.join(',') : brandsSelected
    }`
  }
  if (brand) {
    _url += `&brands=${brand}`
  }
  if (q) {
    _url += `&q=${q}`
  }
  if (sellerSlug) {
    _url += `&seller=${sellerSlug}`
  }
  if (rating) {
    _url += `&rating=${rating}`
  }
  if (!category) return null
  let ancestorsLength = 0
  if (Array.isArray(category.ancestors_name))
    ancestorsLength = category.ancestors_name.length
  return (
    <div className='parentCategories'>
      {Array.isArray(category.ancestors_name) &&
        category.ancestors_name.map((item, index) => (
          <div key={index} className='ancestor'>
            <Link
              key={index}
              as={`/c/${
                Array.isArray(category.ancestors_slug)
                  ? category.ancestors_slug[index]
                  : ''
              }${_url}`}
              href={`/category?categorySlug=${
                Array.isArray(category.ancestors_slug)
                  ? category.ancestors_slug[index]
                  : ''
              }${_url}`}
            >
              <a>
                <span
                  style={{ marginLeft: `${index * categoriesMargin}px` }}
                  className='parentCategories'
                >
                  {item}
                </span>
              </a>
            </Link>
          </div>
        ))}
      {
        // <div><span style={{ marginLeft: `${ancestorsLength * categoriesMargin}px` }} className='parentCategories current'>{category.name}</span></div>
      }
    </div>
  )
})

const Brands = React.memo((props) => {
  const { brands, brandsSelected, onChange, brandsMeta } = props
  if (brandsMeta) {
    const brandIds = Object.keys(brandsMeta)
    for (let brandId of brandIds) {
      let findIndex = brands.findIndex((i) => i.key === brandId)
      if (findIndex === -1) {
        brands.push({
          key: brandId,
          doc_count: 1
        })
      }
    }
  }

  if (Array.isArray(brands) && brands.length > 0) {
    let options = []
    let checked = false
    brands.forEach((i, index) => {
      if (i.key && brandsMeta[i.key]) {
        options.push({
          label: `${brandsMeta[i.key]} (${i.doc_count})`,
          value: `${i.key}`
        })
      }
    })

    return (
      <>
        <div className='filterBlock manuafBlock'>
          <h4>
            <span>Brand</span>
          </h4>
          <Checkbox.Group
            value={brandsSelected}
            options={options}
            onChange={onChange}
            className='branch-checkbox'
          />
        </div>
      </>
    )
  }
  return null
})

class SearchSidebar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      brandsSelected: props.brandsSelected ? props.brandsSelected : []
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      brandsSelected: props.brandsSelected ? props.brandsSelected : []
    }
  }

  handleBrandChange = (checkedValues) => {
    let { brandsSelected } = this.state
    brandsSelected = checkedValues

    this.props.onBrandChange(brandsSelected)
    this.setState({ brandsSelected: [...brandsSelected] })
  }

  handleAttributesChange = (checked, attrCode, attrValue) => {
    this.props.onAttributesChange(checked, attrCode, attrValue)
  }

  render() {
    let {
      categories,
      brandsMeta,
      minPrice,
      maxPrice,
      range,
      onRangeChange,
      limit,
      sortBy = '',
      attributes,
      attributesMeta,
      categorySlug,
      brand,
      attrsSelected,
      sellerSlug,
      category,
      brands,
      rating,
      pageName,
      q
    } = this.props
    const { brandsSelected } = this.state
    if (range) {
      try {
        range = JSON.parse(range)
      } catch (e) {
        console.log(e)
      }
      if (Array.isArray(range) && range.length === 2) {
        if (range[0] < minPrice || range[0] > maxPrice) range[0] = minPrice
        if (range[1] > maxPrice || range[1] < minPrice) range[1] = maxPrice
      } else {
        range = [minPrice, maxPrice]
      }
    } else {
      range = [minPrice, maxPrice]
    }
    let ancestorsLength = 0
    if (category) {
      ancestorsLength = 1
      if (Array.isArray(category.ancestors_name))
        ancestorsLength = category.ancestors_name.length + 1
    }

    const CategoriesProps = {
      rating,
      sellerSlug,
      range,
      minPrice,
      maxPrice,
      limit,
      sortBy,
      brandsSelected,
      pageName,
      categorySlug,
      q
    }
    return (
      <div className='wrap sideBar'>
        {Array.isArray(categories) && categories.length > 0 ? (
          <div className='filterBlock categoriesBlock'>
            <h4>
              <span>Refined by</span>
            </h4>
            <ParentCategories {...CategoriesProps} category={category} />
            <ul
              style={{ marginLeft: `${ancestorsLength * categoriesMargin}px` }}
              className='subCategories'
            >
              <Categories {...CategoriesProps} categories={categories} />
            </ul>
          </div>
        ) : (
          <React.Fragment>
            <h4>
              <span>Refined by</span>
            </h4>
            <ParentCategories {...CategoriesProps} category={category} />
          </React.Fragment>
        )}

        {maxPrice > minPrice && maxPrice - minPrice > 100 && (
          <div className='filterBlock priceRangeBlock'>
            <h4>
              <span>Price filt</span>
            </h4>
            <PriceRange
              minPrice={parseInt(minPrice)}
              maxPrice={parseInt(maxPrice)}
              range={range}
              onChange={onRangeChange}
            />
          </div>
        )}
        <Brands
          config={config}
          brands={brands}
          brandsMeta={brandsMeta}
          brandsSelected={brandsSelected}
          onChange={this.handleBrandChange}
        />

        {attributes &&
          Object.keys(attributes).map((i) => {
            if (
              Array.isArray(attributes[i].buckets) &&
              attributes[i].buckets.length > 0
            ) {
              return (
                <div className='filterBlock manuafBlock' key={i}>
                  <h4>
                    <span>{attributesMeta[i] ? attributesMeta[i] : i}</span>
                  </h4>
                </div>
              )
            } else {
              return null
            }
          })}

        {<Ratings onRatingChange={this.props.onRatingChange} />}
      </div>
    )
  }
}
const mapState = (state) => ({
  config: state.config
})

export default connect(mapState)(SearchSidebar)
