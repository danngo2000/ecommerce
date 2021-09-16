import React, { memo } from 'react'
import MainMenu from '../Header/TheMainMenu'
import MultipleFeatureBannersBox from './MultipleFeatureBannersBox'
import ProductCategoriesSuper from './ProductCategoriesSuper'

const CompoundBanner = ({ data }) => {
  console.log('data', data);
  
  if (data.templates) {
    return (
      <div className='compound-banner'>
        {data.templates.map((template: any, i: number) => {
          switch (template.type.toLowerCase()) {
            case 'multiple feature banners':
              return <MultipleFeatureBannersBox key={i} {...template} />
            // case 'big slider':
            //   return <ProductCategoriesSuper key={i} {...template} />
            case 'category menu':
              return <MainMenu key={i} className={template.id} />
            default:
              return null
          }
        })}
      </div>
    )
  }
  return null
}

export default memo(CompoundBanner)
