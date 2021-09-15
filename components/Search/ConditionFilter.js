import React from 'react'
import { Button } from 'antd'
// import { T, t } from 'locales'
import config from 'settings'
import { Tag } from 'antd'

function getFilterLabel(key) {
  switch (key) {
    case 'brand':
      return 'Brand'
    case 'price':
      return 'Price'
    case 'rating':
      return 'Rating'
    default:
      return ''
  }
}

const GroundFilter = (props) => {
  const { data, type, onRemove } = props
  return (
    <>
      {getFilterLabel(type)}:
      {data.map((item, index) => (
        <Tag
          visible={true}
          closable
          onClose={() => onRemove(data, type, item)}
          className='conditionFilter'
          key={index}
        >
          {item.label}
        </Tag>
      ))}
    </>
  )
}

class ConditionFilter extends React.PureComponent {
  state = {
    conditions: {
      brand: [],
      price: [],
      rating: []
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { query, meta } = nextProps
    try {
      let conditions = { ...prevState.conditions }
      if (Array.isArray(query.brands)) {
        conditions.brand = conditions.brand.filter(
          (i) => query.brands.indexOf(i.value) > -1
        )
        if (meta.brands) {
          for (let brand of query.brands) {
            conditions = pushValue(
              { label: `${meta.brands[brand]}`, value: brand },
              conditions,
              'brand'
            )
          }
        }
      } else {
        conditions.brand = []
      }
      if (query.price) {
        const priceArr = JSON.parse(query.price)
        const { prefix, suffix } = config.locale.custom_currency
        priceArr[0] = numberWithCommas(priceArr[0].toFixed(0))
        priceArr[1] = numberWithCommas(parseFloat(priceArr[1]).toFixed(0))
        conditions = pushValue(
          {
            label: `${prefix}${priceArr[0]}${suffix} - ${prefix}${priceArr[1]}${suffix}`,
            value: query.price
          },
          conditions,
          'price'
        )
      } else {
        conditions.price = []
      }

      if (query.rating) {
        conditions = pushValue(
          { label: query.rating + ' star & above', value: query.rating },
          conditions,
          'rating'
        )
      } else {
        conditions.rating = []
      }
      return { conditions }
    } catch (e) {
      console.log(e)
      return null
    }
  }

  handleClearAll = () => {
    this.props.onRemoveAll()
  }

  render() {
    const { conditions } = this.state
    const keys = Object.keys(conditions)
    const count = keys.reduce(
      (previousValue, currentValue) =>
        previousValue + conditions[currentValue].length,
      0
    )
    if (count === 0) return null

    return (
      <div className='filterConditions row'>
        {keys
          .filter((key) => conditions[key].length > 0)
          .map((key, index, arr) => {
            return (
              <div className='column' key={index}>
                <GroundFilter
                  onRemove={this.props.onRemove}
                  key={index}
                  data={conditions[key]}
                  type={key}
                />
                {index === arr.length - 1 && (
                  <Button
                    className='btnClearFilter'
                    onClick={this.handleClearAll}
                  >
                    Clear all
                  </Button>
                )}
              </div>
            )
          })}
      </div>
    )
  }
}

function pushValue({ label, value }, conditions, type) {
  let index = -1
  switch (type) {
    case 'brand':
      if (conditions[type].length > 0) {
        index = conditions[type].findIndex((i) => i.value === value)
      }
      if (index === -1) {
        conditions[type].push({ label, value })
      }
      break
    case 'price':
    case 'rating':
      if (conditions[type].length === 0) {
        conditions[type].push({ label, value })
      } else {
        conditions[type][0] = { label, value }
      }
      break
  }
  return { ...conditions }
}

function numberWithCommas(x) {
  var parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join(',')
}

export default ConditionFilter
