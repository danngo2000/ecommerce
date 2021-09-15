import React, { useState, useEffect } from 'react'
import youtube from 'utils/youtube'
import produce from 'immer'

const Videos = ({ product: { videos = [] }, videoId }) => {
  const [currentVideo, setCurrentVideo] = useState({
    title: '',
    video_id: ''
  })

  useEffect(() => {
    setCurrentVideo(produce(currentVideo, draft => {
      draft = videos.find(video => video._id === videoId)
      return draft
    }))
  }, [videos.length, videoId])

  return (
    <div className='row modal-content-video'>
      <div className='col-md-9 modal-content-left'>
        <iframe className='video-content' src={`https://www.youtube.com/embed/${currentVideo.video_id}`}
          frameBorder='0'
          allowFullScreen=''
          data-radium='true'
        />
        <div className='video-title' >{currentVideo.title}</div>
      </div>
      <div className='col-md-3 small-img-video'>
        { Array.isArray(videos) && videos.map((video) => (
          <div className='small-img-video-content' key={video._id} onClick={() => setCurrentVideo(produce(currentVideo, draft => {
            draft = video
            return draft
          }))}>
            <img src={youtube.getImage(video.video_id)} alt='' />
            <div className='small-img-video-title'>{video.title}</div>
          </div>
        )) }
      </div>
    </div>
  )
}
export default Videos
