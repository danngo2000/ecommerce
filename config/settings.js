const themeSettings = require('./themes')

module.exports = {

  
  isProduction: process.env.NEXT_PUBLIC_DEV === 'true',
  api: process.env.NEXT_PUBLIC_API_HOST,
  themeSettings,
  theme: process.env.NEXT_PUBLIC_THEME,
  services: {
    google_analytic: process.env.NEXT_PUBLIC_GG_ANALYTIC,
    google_tags: process.env.NEXT_PUBLIC_GG_ANALYTIC,
    sentry: process.env.NEXT_PUBLIC_SENTRY,
    segment: process.env.NEXT_PUBLIC_SEGMENT,
    pixel: process.env.NEXT_PUBLIC_FB_PIXEL
  },
  locale: {
    defaultCountry: process.env.NEXT_PUBLIC_COUNTRY,
    language: process.env.NEXT_PUBLIC_LANGUAGE,
    timezone: process.env.NEXT_PUBLIC_TIMEZONE,
    dimension_unit: process.env.NEXT_PUBLIC_DIMENSION_UNIT || 'inches',
    currency: process.env.NEXT_PUBLIC_CURRENCY,
    custom_currency: {
      prefix: process.env.NEXT_PUBLIC_CURRENCY_PREFIX,
      suffix: process.env.NEXT_PUBLIC_CURRENCY_SUFFIX,
    }
  }
}
