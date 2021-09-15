
import { Skeleton } from '@material-ui/lab'
import React from 'react'

const SkeletonLoad = () => {
  return (
    <div className='skeleton'>
      <Skeleton animation='wave' height={15} width={'80%'} />
      <Skeleton animation='wave' height={15} />
      <Skeleton animation='wave' height={15} />
    </div>
  )
}

export default SkeletonLoad
