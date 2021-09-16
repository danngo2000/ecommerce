import React from 'react'
import dynamic from 'next/dynamic'

const CompoundBanner = dynamic(() => import('./CompoundBanner'))
const BadgeBox = dynamic(() => import('./BadgeBox'))
const AppDownLoadBanner = dynamic(() => import('./AppBanner'))
const SuperHeroBanner = dynamic(() => import('./SupperHeroBanner'))
const FeaturedBoxFlex = dynamic(() => import('./FeaturedBoxFlex'))
const FeaturedBox = dynamic(() => import('./FeaturedBox'))
const LazyFeaturedBox = dynamic(() => import('./LazyFeaturedBox'))
const FeaturedBannerBox = dynamic(() => import('./FeauturedBannerBox'))
const DealZone = dynamic(() => import('./DealZone'))
const ProductCategoriesFlex = dynamic(() => import('./ProductCategoriesFlex'))
const ProductCategories = dynamic(() => import('./ProductCategories'))
const IconSlider = dynamic(() => import('./IconSlider'))
const MultipleFeatureBannersBox = dynamic(
  () => import('./MultipleFeatureBannersBox')
)
const MultiComponentArea = dynamic(() => import('./MultiComponentArea'))
const ProductCategoriesSuper = dynamic(() => import('./ProductCategoriesSuper'))

const ComponentRender = ({ item, data }) => {
  switch (item.type.toLowerCase()) {
    case 'compound-banner':
      return <CompoundBanner {...item} />
    case 'badges':
      return <BadgeBox {...item} />
    case 'app-download-banner':
      return <AppDownLoadBanner {...item} />
    case 'slider':
      return <SuperHeroBanner {...item} />
    case 'products':
      return <FeaturedBox {...item} />
    // case 'products':
    //   if (item.display === 'flex') {
    //     return <FeaturedBoxFlex {...item} />
    //   }
    //   else {
    //     return <FeaturedBox {...item} />
    //   }
    case 'lazy-load-products':
      return <LazyFeaturedBox {...item} />
    case 'feature-banner':
      return <FeaturedBannerBox {...item} />
    case 'deal-zone-products':
      return <DealZone {...item} dateTime={data.dateTime} />
    // case 'product-by-categories':
    //   if (item.data.display && item.data.display === 'flex') {
    //     return <ProductCategoriesFlex {...item} />
    //   }
    //   else {
    //     return <ProductCategories {...item} />
    //   }
    case 'icon-slider':
      return <IconSlider {...item} />
    // case 'multiple-feature-banners':
    //   return <MultipleFeatureBannersBox {...item} />
    case 'multiple-component-area':
      return <MultiComponentArea {...item} />
    case 'big-slider':
      return <ProductCategoriesSuper {...item} />
    default:
      return null
  }
}

const HomePage = React.memo((props: any) => {
  if (props && Array.isArray(props.data)) {
    return props.data.map((item: any, index: any) => (
      <ComponentRender key={index} item={item} data={props.data} />
    ))
  }
  return null
})

export default HomePage
