import React, { useState } from 'react'
import Layout from 'components/Layout'
import { wrapper } from 'store'
import { fetchConfig } from 'actions/config'
import { fetchCategories } from 'actions/categories'
import { END } from 'redux-saga'
import axios from 'axios'
import qs from 'qs'
import Error from 'components/Error'
import { NextSeo } from 'next-seo'
import { decodeHTML } from 'utils'
import { useSelector } from 'react-redux'
import ProductContent from 'components/Product/ProductConent'

const makeSeoDescription = (__product) => {
  const { description: d, short_description: sd } = __product
  const make = (blocks) => {
    try {
      return blocks
        .filter((block) => block.type)
        .map((bl) => bl.data)
        .map((b) => (b && b.items) || (b && b.text))
        .join('\n')
    } catch (e) {
      console.log(e)
      return ''
    }
  }
  let description = ''
  if (sd && sd.blocks && sd.blocks.length) description = make(sd.blocks)
  if (!description && d && d.blocks && d.blocks.length)
    description = make(d.blocks)
  if (!description) description = __product.name

  return description
}

const buildSeoConfig = (__product, __config) => {
  let product = __product
  let imageUrl = ''
  const _images = product.images.filter((image) => image.size_type === 'medium')
  if (_images && _images.length) imageUrl = _images[0].url
  else if (product.images && product.images.length) {
    imageUrl = product.images[0].url
  }
  const checkaAvailability = () => {
    if (product.status === 'disable' || product.quantity <= 0) {
      return 'OutOfStock'
    }
    return 'InStock'
  }
  const meta = {
    title: decodeHTML(product.name),
    description: product.short_description,
    openGraph: {
      title: decodeHTML(product.name),
      description: product.short_description,
      type: 'product',
      url: `${__config['site/url']}p/${product.slug}`,
      images: [
        {
          url: imageUrl,
          width: 500,
          height: 500,
          alt: decodeHTML(product.name)
        }
      ],
      site_name: __config['site/name']
    },
    additionalMetaTags: [
      {
        property: 'product:price:amount',
        content: product.price
      },
      {
        property: 'product:price:currency',
        content: __config['site/locale_currency_format']
      },
      {
        property: 'og:availability',
        content: checkaAvailability()
      }
    ]
  }
  return meta
}

const Product = (props: any) => {
  let {
    product,
    related,
    reviews,
    ratingStatistics,
    reviewStar,
    reviewType,
    reviewPage,
    reviewsHaveImages,
    qandaShow,
    customAttributesDetail
  } = props
  const config = useSelector((state: any) => state.config)
  let seoDescription = (product && makeSeoDescription(product)) || ''
  const [breadcrumb, setBreadcrumb] = useState(props.breadcrumb || [])

  return (
    <Layout pageName='productPage'>
      {!product ? (
        <Error />
      ) : (
        <>
          <NextSeo {...buildSeoConfig(product, seoDescription)} />
          {/* ProductJsonLd */}
          {/* BreadcrumbJsonLd */}
          <ProductContent
            customAttributesDetail={customAttributesDetail}
            description={product.description || ''}
            short_description={product.short_description || ''}
            product={product}
            related={related}
            reviews={reviews}
            ratingStatistics={ratingStatistics}
            reviewStar={reviewStar}
            reviewType={reviewType}
            reviewPage={reviewPage}
            reviewsHaveImages={reviewsHaveImages}
            qandaShow={qandaShow}
          />
        </>
      )}
    </Layout>
    // <Layout page='product-detail'>
    //   <ProductContent product={product} />
    // </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  async (context: any) => {
    try {
      let isServer = typeof window == 'undefined'
      let { slug, reviewPage, reviewStar, reviewType } = context.query
      if (isServer) {
        context.store.dispatch(fetchConfig())
        context.store.dispatch(fetchCategories())
        context.store.dispatch(END)
        await context.store.sagaTask.toPromise()
      }
      if (slug) {
        let qandaShow = false
        if (context.query.qandaShow) {
          qandaShow = true
        }
        const res: any = await axios.get(
          `products/get?${qs.stringify({
            slug: slug,
            reviewStar: reviewStar || null,
            reviewType: reviewType || null,
            reviewPage: reviewPage || 1
          })}`
        )
        if (!res || res.error) {
          console.log('--> ERR NOT FOUND PRODUCT: ', slug)
          return { product: null }
        }

        const {
          product,
          related,
          reviews,
          ratingStatistics,
          customAttributesDetail,
          reviewsHaveImages
        } = res.data

        const breadcrumb = [{ name: 'Home', as: '/', href: '/' }]
        if (
          product &&
          Array.isArray(product.categories) &&
          product.categories.length > 0
        ) {
          const category = product.categories[0]
          const length = Array.isArray(category.ancestors_name)
            ? category.ancestors_name.length
            : 0
          for (let i = 0; i < length; i++) {
            try {
              breadcrumb.push({
                name: category.ancestors_name[i],
                as: `/c/${category.ancestors_slug[i]}`,
                href: `/category?categorySlug=${category.ancestors_slug[i]}`
              })
            } catch (e) {
              console.log(e)
            }
          }
          breadcrumb.push({
            name: category.name,
            as: `/c/${category.slug}`,
            href: `/category?categorySlug=${category.slug}`
          })
        }
        if (product) {
          breadcrumb.push({ name: product.name } as any)
        }
        return {
          props: {
            qandaShow,
            product,
            related,
            breadcrumb,
            reviews,
            ratingStatistics,
            customAttributesDetail,
            reviewStar: context.query.reviewStar || null,
            reviewPage: context.query.reviewPage || null,
            reviewType: context.query.reviewType || null,
            reviewsHaveImages
          }
        }
      }
    } catch (error) {
      console.log('getServerSideProps', error)
      return { props: {} }
    }
  }
)

export default Product
