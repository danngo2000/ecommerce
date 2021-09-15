import React from 'react'
import axios from 'axios'
import { wrapper } from 'store'
import { fetchConfig } from 'actions/config'
import { fetchCategories } from 'actions/categories'
import { END } from 'redux-saga'
import qs from 'qs'
import ProductsSearchCommon from 'components/ProductsSearchCommon'
import { useSelector } from 'react-redux'

const Search = ({ data, pageQuery, breadcrumb }: any) => {
  const category = data ? data.category : null
  const config = useSelector((state: any) => state.config)
  return (
    <ProductsSearchCommon
      pageName='search'
      query={pageQuery}
      data={data}
      title={category ? category?.name : ''}
      category={category}
      breadcrumb={breadcrumb}
      nextSeoConfig={{
        title: `${config['web/homepage/title']}, ${'Keyword:'} "${
          pageQuery ? pageQuery.q : ''
        }"`,
        description: config['web/homepage/description']
      }}
    />
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  async (context: any) => {
    try {
      let isServer = typeof window !== 'object'
      let {
        categorySlug = null,
        price,
        rating,
        slug,
        attrs,
        page = 1,
        sortBy = '',
        limit,
        brands
      } = context.query
      let q = slug

      if (limit == undefined) limit = 16
      if (isServer) {
        context.store.dispatch(fetchConfig())
        context.store.dispatch(fetchCategories())
        context.store.dispatch(END)
        await context.store.sagaTask.toPromise()
      }

      let query: any = {
        page: parseInt(page),
        sortBy,
        categorySlug,
        limit,
        q
      }
      if (price) {
        try {
          query.price = JSON.parse(price)
        } catch (e) {
          console.log(e)
        }
      }
      if (typeof brands === 'string' && brands !== '') {
        brands = brands.split(',')
        query.brands = brands
      }
      if (attrs) {
        if (typeof attrs === 'string') {
          attrs = JSON.parse(attrs)
          query.attrs = attrs
        } else {
          query.attrs = attrs
        }
      }
      if (rating) {
        query.rating = rating
      }
      let queryStr = qs.stringify(query)

      const res = await axios.get(`products/search?${queryStr}`)

      const data = res ? res.data : null
      if (!data) {
        return { props: { data: null } }
      }
      const breadcrumb = [
        { name: 'Home', as: '/', href: '/' },
        { name: 'Search' }
      ]

      if (price) {
        query.price = price
      }

      return { props: { data, pageQuery: query, breadcrumb: breadcrumb } }
    } catch (e) {
      console.log('getServerSideProps', e)
      return { props: {} }
    }
  }
)

export default Search
