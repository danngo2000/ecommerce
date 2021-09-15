
import { memo } from 'react'
import env from 'settings'
import PropTypes from 'prop-types'

const lang = env.locale.language || 'vi'
const coreData = require(`../static/locales/${lang}/common.json`)
const configurableData = require(`../static/locales/${lang}/configurable.json`)
const orderData = require(`../static/locales/${lang}/order.json`)

const t = (text, dataSet = 'core') => (
  dataSet === 'order'
    ? orderData[text] || text
    : dataSet === 'configurable'
      ? configurableData[text] || text
      : coreData[text] || text
)

const T = memo(props => {
  const { children, order, configurable } = props
  const dataSet = configurable
    ? 'configurable'
    : order
      ? 'order'
      : 'core'

  if (typeof children === 'string') return t(children, dataSet)

  return children
})

T.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  order: PropTypes.bool,
  test: PropTypes.bool
}

export { t, T }
export default { t, T }
