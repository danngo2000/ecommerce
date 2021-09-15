import React, { useEffect, useState } from 'react'
import Content from 'components/Page/Content'
import Sidebar from 'components/Page/Sidebar'
import Layout from 'components/Layout'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { fetchConfig } from 'actions/config'
import { SagaStore, wrapper } from 'store'
import { END } from 'redux-saga'
import { TrafficRounded } from '@material-ui/icons'
import { fetchCategories } from 'actions/categories'

interface PropType {
  data: any
}

const Page = ({initData}) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <Layout page='default'>
      <div className='page-wrap container'>
        <Sidebar data={initData} />
        <Content data={initData} />
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  // const needJsonParse = "web/static_menus"
  // let configData:any = []
  // let paths:any = []
  // const data = await axios.get("config-data/storefront")
  //                         .then(res => res.data.data)

  // for (const config of data) {
  //   if (needJsonParse.includes(config.path)) {
  //     try {
  //       configData = JSON.parse(config.value)
  //     } catch (e) {
  //       configData = null
  //     }
  //   }
  // }
  
  // if(Array.isArray(configData))
  // {
  //   configData.forEach((menu:any) => {
  //     try {
  //       if (typeof menu.children === "string") {
  //         menu.children = JSON.parse(menu.children);
  //       }
  //       if (Array.isArray(menu.children)) {
  //         for (let child of menu.children) {
  //           paths.push({ params: { slug: child.href} })
  //         }
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   })
  // }

  const paths =[
    {params: { slug: 'terms-of-service'}},
    {params: { slug: 'privacy-security'}},
    {params: { slug: 'intl-customers'}}
  ]
  
  return {paths, fallback: true}   
}

export const getStaticProps = wrapper.getStaticProps(async ({store, params}:any)=>{
  let initData = null
  try {
    if (typeof window !== 'object') {
      store.dispatch(fetchConfig())
      store.dispatch(fetchCategories())
      store.dispatch(END)
      await store.sagaTask.toPromise()
    }
    if (params.slug) {
      const { data } = await axios.get(`pages/slug?slug=${params.slug}`)
      if (data) initData = data
    }
  } catch (e) {
    console.log('Page.getInitialProps:', e)
  }
  return { props: { initData } }
}) 


export default Page


