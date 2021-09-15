import React, { useEffect } from "react"
import Layout from "components/Layout"
import ProductPage from "components/Product/ProductPage"
import { useRouter } from "next/router"
import axios from "axios"
import { wrapper } from "store"
import { fetchConfig } from "actions/config"
import { fetchCategories } from "actions/categories"
import { END } from "redux-saga"
import qs from 'qs'

const Search = ({data, pageQuery}:any) => {

  return (
    <ProductPage 
      pageName='search'
      data={data}
      query={pageQuery}
      title={pageQuery?.q ? `Keyword: "${pageQuery.q}"` : ''}
    />
  )
}

export const getServerSideProps = wrapper.getServerSideProps(async (context: any) => {
  try{
    let isServer = (typeof window !== 'object')
    let {slug, page=1, sortBy='', limit, brands} = context.query
    let categorySlug = null
    let q = slug

    if(limit==undefined) limit=16;
    if(isServer)
    {
      context.store.dispatch(fetchConfig())
      context.store.dispatch(fetchCategories())
      context.store.dispatch(END)
      await context.store.sagaTask.toPromise()
    }

    let query:any = {
      page:parseInt(page),
      sortBy,
      categorySlug,
      limit,
      q
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
    return {props:{ data:data, pageQuery: query}}
  }
  catch(e){
    console.log('getServerSideProps',e)
    return { props:{} }
  }
  
})

export default Search
