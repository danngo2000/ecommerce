import Link from 'next/link'
import React, { FC } from 'react'
import {
  ClipboarIcon,
  AddressBookIcon,
  LogoutIcon,
  PackageIcon,
  HeartIcon,
  FeedBackIcon,
  UserIcon,
  EmailIcon
} from '../../Icons/index'

const listMenu = [
  {
    text: 'Account Summary',
    link: '/customer/dashboard',
    vIcon: ClipboarIcon,
    menu: 'dashboard'
  },
  {
    text: 'My Orders',
    link: '/customer/orders',
    vIcon: PackageIcon,
    menu: 'orders'
  },
  {
    text: 'My Account',
    link: '/customer/myprofile',
    vIcon: AddressBookIcon,
    menu: '',
    children: [
      {
        text: 'Edit Information',
        link: '/customer/myprofile',
        vIcon: UserIcon,
        menu: 'myProfile'
      },
      {
        text: 'My Address',
        link: '/customer/addressbook',
        vIcon: AddressBookIcon,
        menu: 'addressBook'
      },
      {
        text: 'Email Subscriptions',
        link: '/customer/addressbook',
        vIcon: EmailIcon,
        menu: ''
      }
    ]
  },
  {
    text: 'My Wishlist',
    link: '/customer/mywishlist',
    vIcon: HeartIcon,
    menu: 'myWishlist'
  },
  {
    text: 'My Reviews',
    link: '/customer/myreviews',
    vIcon: FeedBackIcon,
    menu: 'myReviews'
  },
  {
    text: 'Logout',
    link: '/#',
    vIcon: LogoutIcon,
    menu: 'Logout'
  }
]

interface PropType {
  page: string
}

const Menu: FC<PropType> = ({ page }) => {
  return (
    <div className='block-collapsible-nav'>
      {listMenu.map((i, index) => (
        <ul key={index} className={`menu${page === i.menu ? ' active' : ''} `}>
          <Link href={i.link}>
            <a>
              <div className='menu-item'>
                <i.vIcon size={19} />
                <span className='menu-title'>{i.text}</span>
              </div>
            </a>
          </Link>
          {i.children?.map((chid, index) => (
            <li key={index} className='children'>
              <Link href={chid.link}>
                <a>
                  <div
                    className={`menu-item${
                      page === chid.menu ? ' active' : ''
                    } `}
                  >
                    <chid.vIcon size={16} />
                    <span className='menu-title'>{chid.text}</span>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

export default Menu
