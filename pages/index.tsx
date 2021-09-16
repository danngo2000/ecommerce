import { useSelector, useDispatch } from 'react-redux'
import { fetchConfig } from 'actions/config'
import { wrapper } from 'store'
import { END } from 'redux-saga'
import Layout from 'components/Layout'
import HomePage from '../components/Index/HomePage'
import React from 'react'
import { fetchCategories } from 'actions/categories'
import { NextSeo } from 'next-seo'
import axios from 'axios'

function Home({ data }) {
  const config = useSelector((state: any) => state.config)
  const keywords = config['web/default_keywords']
  const imageUrl = config['site/thumbnail_url'] || config['site/small_logo_url']
  const url = config['site/url']
  const description = config['web/homepage/description']

  return (
    <Layout pageName={`homePage`}>
      <NextSeo
        title={config['web/homepage/title']}
        description={description}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: Array.isArray(keywords) && keywords.join(', ')
          } as any
        ]}
        openGraph={{
          type: 'website',
          url,
          description,
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630
            }
          ]
        }}
      />
      <HomePage data={data} />
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store }: any) => {
    store.dispatch(fetchConfig())
    store.dispatch(fetchCategories())
    store.dispatch(END)
    await store.sagaTask.toPromise()
    const configRes = await axios.get('storefront/home')
    if (configRes && configRes.data) {
      const data = configRes.data
      return {
        props: data
      }
    }
    return {}
  }
)

export default Home
