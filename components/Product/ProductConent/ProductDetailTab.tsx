import React, { useState } from 'react'
import { Tabs } from 'antd'
import { ProductDescription } from '../ProductDescription'
import ProductSpecifications from '../ProductSpecifications'
import ShoppingGuide from '../ShoppingGuide'
import { useSelector } from 'react-redux'

const ProductDetailTab = React.memo((props: any) => {
  const _config = useSelector((state: any) => state.config)
  const [selectedTabId, setSelectedTabId] = useState('product-desc')
  let TabPane = Tabs.TabPane
  const { product, customAttributesDetail } = props
  const themeSettings = _config['site/theme/settings']
  const theme = _config['site/theme/settings']
  return (
    <div className='main-box productDetailTab'>
      <div className='row'>
        <div className='col-md-12' style={{ width: '100%' }}>
          <Tabs
            animated={false}
            className='tabs'
            key='TabsDetails'
            {...(themeSettings && themeSettings.productDetailTab)}
            onChange={(value) => setSelectedTabId(value)}
            activeKey={selectedTabId}
          >
            <TabPane key='product-desc' tab='Description'>
              <ProductDescription product={product} />
            </TabPane>
            <TabPane key='product-specs' tab='Specifications'>
              <ProductSpecifications
                product={product}
                customAttributesDetail={customAttributesDetail}
                specifications={product.custom_attributes}
              />
            </TabPane>
            {theme === 'pink-theme' && product.dropship.is_dropship === true && (
              <TabPane key='product-guide' tab='Shopping guide'>
                <ShoppingGuide />
              </TabPane>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
})

export default ProductDetailTab
