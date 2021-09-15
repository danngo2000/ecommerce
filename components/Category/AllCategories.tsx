import React, { FC } from "react"
import Link from "next/link"
import Image from "next/image"
import { imageLoader } from "utils"

interface PropType {
  categories: any
}

const ListMenu: FC<PropType> = React.memo(({ categories }) => {
  return categories.map((category: any, i: any) => (
    <div key={i} className='parent-item'>
      <Link href='/c/demo'>
        <a className='parent-item-link'>
          <div className='img-wrapper'>
            <Image
              loader={imageLoader}
              src={category.image}
              width={100}
              height={100}
              objectFit='contain'
              alt=''
            />
          </div>
          <div className='title'>{category.name}</div>
        </a>
      </Link>
    </div>
  ))
})

const AllCategories: FC<PropType> = ({ categories }) => {
  return (
    <div className='all-categories-page'>
      <div className='product-categories'>
        <ListMenu categories={categories} />
      </div>
    </div>
  )
}

export default AllCategories
