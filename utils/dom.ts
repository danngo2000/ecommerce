const isServer = (typeof window === 'undefined')

export const injectRecaptcha = (key) => {
  if (isServer) return
  const script = document.createElement('script')
  script.src = 'https://www.google.com/recaptcha/api.js?render=' + key
  script.async = true
  document.body.appendChild(script)
}

export const loadStripeScript = (callback: () => void, force?: boolean) => {
  if (isServer) return
  if (typeof callback !== 'function') callback = () => console.info('Stripe script loaded')
  if (!(window as any).Stripe || force) {
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.async = true
    script.onload = callback
    document.body.appendChild(script)
  } else callback()
}

export const loadPayPalScript = (clientId: string, callback: () => void, force = false) => {
  if (isServer || !clientId) return
  if (typeof callback !== 'function') callback = () => console.log('Paypal script loaded')
  if (!(window as any).paypal || force) {
    const tag = document.createElement('script')
    tag.async = true
    tag.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&disable-funding=card&locale=en_US`
    tag.onload = callback
    const body = document.getElementsByTagName('body')[0]
    body.appendChild(tag)
  } else callback()
}