import React, { useState } from "react"
import { IoIosHome, IoIosGrid, IoIosCart, IoIosPerson } from "react-icons/io"
import Link from "next/link"
import AllCategories from "./Category/AllCategories"
import { Button } from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import data from "./Index/categoriesdemo.json"
import { useSelector } from "react-redux"

const MenuMobile = () => {
  const [isOpenCategories, setIsOpenCategories] = useState(false)
  const items: any = []

  const handleShowCategories = () => {
    setIsOpenCategories(!isOpenCategories)
  }

  return (
    <>
      <div className={`mobile-menu ${isOpenCategories ? "active" : ""}`}>
        <div className='header'>
          <Button onClick={handleShowCategories}>
            <CloseIcon />
          </Button>
        </div>
        <AllCategories categories={data} />
      </div>
      <div className='tab-bar'>
        <div className='tab tab-home'>
          <Link href='/'>
            <a>
              <IoIosHome />
              <label>Home</label>
            </a>
          </Link>
        </div>
        <div
          onClick={handleShowCategories}
          className='tab tab-categories'
        >
          <IoIosGrid />
          <label>Categories</label>
        </div>
        <div className='tab tab-cart'>
          <Link href='/cart'>
            <a>
              {items.length > 0 ? <div className='count-number'>
                <span>{items.length}</span>
              </div>  : ''}
              <IoIosCart />
              <label>Cart</label>
            </a>
          </Link>
        </div>
        <div className='tab tab-account'>
          <Link href='/customer'>
            <a>
              <IoIosPerson />
              <label>Account</label>
            </a>
          </Link>
        </div>
      </div>
    </>
  )
}

export default MenuMobile
