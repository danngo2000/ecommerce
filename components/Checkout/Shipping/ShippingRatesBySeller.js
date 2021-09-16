import React, { useMemo } from 'react'
import GroupItems from './GroupItems'

export const groupItemsBySeller = (items, groupFreeship = true, groupSelectedOnly = false) => {
  let groups = {}
  for (let index in items) {
    let item = {...items[index]}
    if (groupSelectedOnly && !item.is_selected) continue
    const isGiftCardProduct = (item.product_type === 'gift_card' && groupFreeship)
    const isSeller = item.seller && item.seller.slug
    const isDropship = item.dropship && item.dropship.is_dropship
    let groupId = isGiftCardProduct
      ? 'freeship'
      : isSeller
        ? item.seller.slug
        : isDropship
          ? 'dropship'
          : 'default'
    if (!groups[groupId]) {
      groups[groupId] = {
        items: [],
        seller: item.seller
      }
    }
    item.originalIndex = index
    groups[groupId].items.push(item)
  }
  return groups
}

const ShippingRatesBySeller = React.memo(props => {
  const { cart, shippingMethods, freeAll } = props
  const renderGroupItems = useMemo(() => {
    const groups = groupItemsBySeller(cart.items, true, true)
    if (freeAll) {
      return <h4>Congratulations, you have reached the free shipping milestone.</h4>
    }
    return Object.keys(groups).map((key, i) => (
      <GroupItems
        key={key} groupId={key}
        items={groups[key].items}
        orderNumber={`${+i + 1}/${Object.keys(groups).length}`}
        shippingMethods={shippingMethods}
      />
    ))
  }, [shippingMethods, freeAll])

  return (
    <div className='shippingRatesBySeller'>
      {renderGroupItems}
    </div>
  )
})

export default ShippingRatesBySeller
