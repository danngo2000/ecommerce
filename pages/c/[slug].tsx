import React, { useEffect } from 'react'
import Layout from 'components/Layout'
// import ProductPage from 'components/Product/ProductPage'
import ProductsSearchCommon from '../../components/ProductsSearchCommon'
import { useRouter } from 'next/router'
import axios from 'axios'
import { wrapper } from 'store'
import { fetchConfig } from 'actions/config'
import { fetchCategories } from 'actions/categories'
import { END } from 'redux-saga'
import qs from 'qs'

const Category = ({ data, pageQuery }: any) => {
  const category = data ? data.category : null
  return (
    <>
    </>
    // <ProductsSearchCommon
    //   pageName='category'
    //   query={pageQuery}
    //   data={data}
    //   title={category ? category?.name : ''}
    //   category={category}
    //   nextSeoConfig={{
    //     title: category ? category?.name : '',
    //     description: category ? category.description : ''
    //   }}
    // />
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  async (context: any) => {
    try {
      let isServer = typeof window == 'undefined'
      let { slug, page = 1, sortBy = '', limit, brands } = context.query
      let categorySlug = slug

      if (limit == undefined) limit = 16
      if (isServer) {
        context.store.dispatch(fetchConfig())
        context.store.dispatch(fetchCategories())
        context.store.dispatch(END)
        await context.store.sagaTask.toPromise()
      }

      if (categorySlug && categorySlug.endsWith('/')) {
        categorySlug = categorySlug.substring(0, categorySlug.length - 1)
      }
      let query: any = {
        page: parseInt(page),
        sortBy,
        categorySlug,
        limit
      }
      if (typeof brands === 'string' && brands !== '') {
        brands = brands.split(',')
        query.brands = brands
      }
      let queryStr = qs.stringify(query)
      let res
      try {
        res = await axios.get(`products/search?${queryStr}`)
      } catch (error) {
        console.log(queryStr)
        throw error
      }

      const data = res.data
      return { props: { data: data, pageQuery: query } }
    } catch (e) {
      console.log('getServerSideProps', e)
      return { props: {} }
    }
  }
)

export default Category
