export const imageLoader = (props: any) => {
  return `${props.src}`
}
import Countries from 'models/Static/Countries.json'
import statesOnUs from 'models/Static/statesOnUs.json'
// import { ICart, ICustomer } from '../interfaces'
import axios from 'axios'
import { ICart } from 'interfaces/ICart'
import { ICustomer } from 'interfaces'

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const makeOrderItemLink = (item: any) => {
  let items = item.product
  let href = `/product?slug=`
  let _as = `/p/`
  if (item.configurable_parent) {
    href += item.configurable_parent.slug + `&spid=${item.product_id}`
    _as += item.configurable_parent.slug + `?spid=${item.product_id}`
  } else {
    href += items && items.slug
    _as += items && items.slug
  }
  return [href, _as]
}

export const convertUrlAlias = (as: string) => {
  if (typeof as === 'string') {
    const splited = as.split('/')
    try {
      if (splited[0] === '') splited.shift()
      if (splited[0].length === 1 && splited[1]) {
        if (splited[0] === 'c') {
          return '/category?categorySlug=' + splited.slice(1).join('/')
        } else if (splited[0] === 'b') {
          return '/brand?brandSlug=' + splited[1]
        } else if (splited[0] === 's') {
          return '/search?q=' + splited[1]
        } else if (splited[0] === 'p') {
          return '/product?slug=' + splited[1]
        }
      } else if (splited[0] === 'page') {
        return '/page/' + splited[1]
      }
    } catch (e) {
      console.log(e)
    }
  }
  return null
}

export const getProductUrl = (product, type = 'as', slug = null) => {
  let url = ''
  let _slug = slug
  if (!slug && product) _slug = product.slug
  if (type === 'as') {
    url = '/p/' + _slug
  } else {
    url = '/product?slug=' + _slug
  }
  return url
}

export const decodeHTML = (html) => {
  if (typeof html !== 'string') return ''
  return html
    .replace(/&quot;/g, '"')
    .replace(/&Quot;/g, '"')
    .replace(/&amp;quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

export const slugify = (value: string, udf?: boolean) => {
  if (!value) return ''
  let slug = `${value}`
    .toLowerCase()
    .replace(/[&/\\#”“’;,+()$~%.'":*?<>{}]/g, '')
    .replace(/ /g, '-')
    .replace(/---/g, '-')
    .replace(/--/g, '-')
  if (udf) {
    slug = slug
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
  }
  return slug
}

// export const getFullAddress = (code, type) => {
//   let sourceData = []
//   if (type === 'country') {
//     sourceData = Countries
//   }
//   if (type === 'state') {
//     sourceData = statesOnUs
//   }
//   for (let i = 0, l = sourceData.length; i < l; i++) {
//     let item = sourceData[i]
//     if (item.value === code) {
//       return item.label
//     }
//   }

//   return code
// }

export const checkTestMode = async (cart?: ICart, customer?: ICustomer) => {
  try {
    let email: any = null

    if (customer?.email) email = customer.email
    else if (cart?.address?.shipping) email = cart.address.shipping.email

    if (!email) return false
    let { data } = await axios.post('customers/dev', { email })
    return data
  } catch (e) {
    console.log(e.message)
    return false
  }
}
