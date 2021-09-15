import React from 'react'
import Link from 'next/link'

export default function LinkShowAll({ product }) {
  return (
    <div className='wrap-link'>
      <div className='link-show-all'>
        <Link
          href={`/product?slug=${product.slug}&qandaShow=true`}
          as={`/p/${product.slug}?qandaShow=true`}
          shallow
        >
          <a>View all questions that have been answered.</a>
        </Link>
      </div>
    </div>
  )
}
