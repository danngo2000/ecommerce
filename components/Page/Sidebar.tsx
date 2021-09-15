import Link from "next/link"
import React, { useState, FC } from "react"
import { connect } from "react-redux"

interface PropType {
  data: any
}

const Sidebar: FC<PropType> = ({data, config}:any) => {
  let menus = config["web/static_menus"]

  const renderColumnContent = (links: any, slug: any) => {
    let paths:any = []
    if(typeof links === "string"){
      let tmp = JSON.parse(links)
      if(Array.isArray(tmp)) paths = tmp
    }
    if(Array.isArray(links)){
      paths = links
    }
    return paths?.map((item: any, i: any) => {
      return (
        <Link
          href={"/a/" + item.href}
          key={i}
        >
          <a className={item.href === slug ? "active" : ""}>
            {item.title}
          </a>
        </Link>
      )
    })
  }

  return (
    <div className='page-sidebar'>
      <div className='menus'>
        {
          Array.isArray(menus) && menus.map((item,index)=>(
            (item?.children) && 
            renderColumnContent(item.children, data.slug)
          ))
        }
      </div>
    </div>
  )
}

const mapState = (state:any) => ({
  config: state.config,
});

export default connect(mapState, null)(Sidebar);

