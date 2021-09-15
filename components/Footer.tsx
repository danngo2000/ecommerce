import React, { useEffect, useState, FC } from 'react'
import Link from 'next/link'
import CreditCardIcons from './Blocks/CreditCardIcons'
import { connect, useSelector } from 'react-redux'
import { Input, Button } from 'antd'
import axios from 'axios'
import {
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  WhatsAppOutlined
} from '@ant-design/icons'
import produce from 'immer'
import { emailPattern } from 'utils/validate'

const contactIcon = [
  <InfoCircleOutlined />,
  <MailOutlined />,
  <PhoneOutlined />,
  <WhatsAppOutlined />
]

interface Props {
  pageName: any
}

const Footer: FC<Props> = ({ pageName }) => {
  const config = useSelector((state: any) => state.config)
  let contactEmail = config['site/contact_email']
  let supportPhone = config['site/support/phone']
  let copyrightTextCheckout = config['site/footer/copyright']
  let copyrightText = config['site/footer/copyright_text']
  let brands = config['site/footer/partners_logos']
  const extra = config['site/footer/extras']
  const theme = config['site/theme']
  const aboutContent = config['site/footer/about_content']
  const siteName = config['site/name']
  const playStore = config['app/playstore/home_url']
  const appStore = config['app/appstore/home_url']
  const country = config['site/footer/country']
  const descriptionText = config['site/footer/description']
  const shortDescription = config['site/footer/short_description']
  const contactLink = config['site/footer/contact_link']
  const QRLink = config['site/footer/qr_code']
  let { footer } = config['site/theme/settings'] || {}

  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [menus, setMenus] = useState([])

  useEffect(() => {
    let menus = config['web/static_menus']
    if (Array.isArray(menus)) {
      menus = menus.map((menu) => {
        if (typeof menu.children === 'string') {
          menu = produce(menu, (draft) => {
            draft.children = JSON.parse(draft.children)
          })
        }
        return menu
      })
    }
    setMenus(menus)
    if (window && window.innerWidth < 996) setIsMobile(true)
  }, [])

  const handleChange = (event: any) => {
    const { value } = event.target
    setEmail(value)
    validateInput('email')
  }

  const validateInput = (refName) => {
    const error = document.getElementById(`${refName}Error`)
    setValidEmail(true)
    if (!error) return
    error.textContent = ''
    if (['email'].includes(refName)) {
      if (!emailPattern.test(email)) {
        error.textContent = `${'The email is not valid'}.`
      }
      if (email.length < 6) {
        error.textContent = `${'Must have at least 6 characters'}.`
      }
      setValidEmail(!error.textContent)
    }
  }

  const simpleFooter = (
    <>
      <div className='footer-container top-content'>
        <div className='container'>
          <div className='footer-links-container'>
            {isMobile && footer && footer.collapseLinksOnMobile
              ? ''
              : Array.isArray(menus) &&
                menus.map((foot: any, li) => (
                  <div className='footer-column' key={li}>
                    <span className='footer-title'>{foot.title}</span>
                    {Array.isArray(foot.children) &&
                      foot.children.map((item, i) => {
                        return item.href[0] !== '/' ? (
                          <Link
                            as={'/page/' + item.href}
                            href={item.href}
                            key={i}
                          >
                            <a className='menu'>{item.title}</a>
                          </Link>
                        ) : (
                          <Link as={item.href} href={`${item.href}`} key={i}>
                            <a className='menu'>{item.title}</a>
                          </Link>
                        )
                      })}
                    {foot.type === 'subscribe' && (
                      <div>
                        <div className='email-antd-input'>
                          <Input
                            placeholder='Your Email'
                            onChange={handleChange}
                            value={email}
                          />
                          <Button className='subscribeBtn'>ENTER</Button>
                        </div>
                        <p id='emailError' />
                        <div className='textContent'>{foot.textContent}</div>
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </div>
      <div
        className='footer-container middle-content'
        style={{ borderBottom: 'unset' }}
      >
        <div className='container'>
          <div className='footer-links-container'>
            {extra &&
              extra.map((item, index) => {
                return (
                  <div className={`footer-column-${item.type}`} key={index}>
                    <span className='footer-title'>{item.title}</span>
                    {item.type === 'payments' && <CreditCardIcons />}
                    {item.type === 'socials' && (
                      <div className='footer-column-social-links'>
                        {item.links.map((item: any, i: number) => {
                          if (config[`site/${item.name}_url`]) {
                            return (
                              <a
                                target='_blank'
                                href={config[`site/${item.name}_url`]}
                                key={i}
                              >
                                <img alt={item.name} src={item.icon} />
                              </a>
                            )
                          }
                          return null
                        })}
                      </div>
                    )}
                    {item.type === 'govCerts' && (
                      <div className='govCerts'>
                        {item.links.map((link, i) => {
                          return (
                            <div className='certItem' key={i}>
                              <a href={link.url}>
                                <img width='120px' src={link.img} />
                              </a>{' '}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            {
              <div className='footer-app-downloads'>
                <div className='footer-title'>Download {siteName} app now</div>
                <div className='app-downloads-content'>
                  <div className='QR-code'>
                    <img src={QRLink} alt='' />
                  </div>
                  <div className='contact-app'>
                    <a href={appStore}>
                      <img
                        src='https://d1i5ti8rq3af58.cloudfront.net/2021/1/22/1611285689349.083.png'
                        alt=''
                      />
                    </a>
                    <a href={playStore}>
                      <img
                        src='https://d1i5ti8rq3af58.cloudfront.net/2021/1/22/1611285681589.0452.png'
                        alt=''
                      />
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className={`footer`}>
      <div className='footerWrap'>
        {theme === 'pink-theme' || theme === 'green-theme' ? (
          <div className='contactLinksModule'>
            <div className='container'>
              <div className='top-text'>
                <div className='title'>{descriptionText}</div>
                <div className='summary'>{shortDescription}</div>
              </div>
              <ul>
                {contactLink &&
                  contactLink.map((item, index) => (
                    <li key={index}>
                      <a href={`${item.src}`}>
                        <div className='footer-icon'>{contactIcon[index]}</div>
                        <div className='contact-text'>
                          <span className='heading'>{item.heading}</span>
                          {item.title}
                        </div>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ) : (
          ''
        )}
        <div className='footerHeader'>
          <div className='container'>
            <div className='col1'>Need help? Let's chat</div>
            <div className='col2'>
              <span className='linkItem'>
                <img src='/static/images/svg/phone-portrait.svg' />
                {supportPhone}
              </span>
              <span className='linkItem'>
                <img src='/static/images/svg/mail_outline.svg' />
                {contactEmail}
              </span>
              <span className='linkItem'>
                <img src='/static/images/svg/question-circle.svg' />
                <Link href='/page/faq'>
                  <a target='_blank'>FAQ</a>
                </Link>
              </span>
            </div>
          </div>
        </div>
        {pageName !== 'checkout' && simpleFooter}
        {pageName === 'checkout' && (
          <div>
            <div className='container'>
              <p className='contentFooter'>
                Our checkout is safe and secure. Your personal and payment
                information is securely transmitted via 128-bit encryption. We
                do not store any payment card information on our systems.
              </p>
              <div className='footerMenu'>
                <div className='copyright'>{copyrightTextCheckout}</div>
                <div className='footerLinks'>
                  {theme === 'pink-theme' ? (
                    <>
                      <div>
                        <Link href='/page/dieu-khoan-va-su-dung'>
                          <a>Điều khoản và sử dụng</a>
                        </Link>
                      </div>
                      <div>
                        <Link href='/page/chinh-sach-bao-mat-thong-tin-khach-hang'>
                          <a>Bảo mật thông tin khách hàng</a>
                        </Link>
                      </div>
                      <div>
                        <Link href='/page/huong-dan-mua-hang'>
                          <a>Hướng dẫn mua hàng</a>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Link href='/page/terms-of-service'>
                          <a>Terms of service</a>
                        </Link>
                      </div>
                      <div>
                        <Link href='/page/privacy-security'>
                          <a>Privacy & Security</a>
                        </Link>
                      </div>
                      <div>
                        <Link href='/page/help-center'>
                          <a>Help Center</a>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className='lowerContent-footer'>
          <div className='container'>
            <div className='footer-about'>
              <div className='footer-about-heading'>about {siteName}</div>
              <div className='footer-about-text'>{aboutContent}</div>
            </div>
          </div>
        </div>
        <div className='footer-container bottom-content'>
          <div className='container'>
            <div className='footer-copy-text'>
              <div className='lfloat'>{copyrightTextCheckout}</div>
              <div className='rfloat'>
                made with <img src='/static/images/heart.png' alt='' />
                in {country}
              </div>
            </div>
          </div>
        </div>
      </div>
      {theme === 'yellow-theme' ? (
        <div className='footer-copyrights'>
          <div className='copyrights-text'>
            <p>{copyrightTextCheckout}</p>
            <p className='copyrights-info'>{copyrightText}</p>
          </div>
          <div className='copyrights-brands'>
            {brands &&
              brands.map((brand: any, index: number) => (
                <div className='img-brand'>
                  <a href={brand.url}>
                    <img
                      key={index}
                      src={brand.src}
                      style={{
                        height: `${brand.height}px`,
                        width: `${brand.width}px`
                      }}
                    />
                  </a>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Footer
