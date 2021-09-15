import React from 'react'

const maxLength = 200

const getShortContent = (content) => {
  let result = content
  if (content.length > maxLength) {
    result = content.substring(0, maxLength)
    result += '...'
  }
  return result
}

class ReviewContent extends React.PureComponent {
  state = {
    isReadMore: true,
    content: '',
    shortContent: ''
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.content !== prevState.content) {
      return {
        isReadMore: true,
        content: nextProps.content,
        shortContent: getShortContent(nextProps.content)
      }
    }
    return null
  }

  readMoreClick = (e) => {
    e.preventDefault()
    this.setState((prevState) => ({ isReadMore: !prevState.isReadMore }))
  }

  render() {
    const { content, isReadMore, shortContent } = this.state
    if (content.length > maxLength) {
      return (
        <>
          <div className='reviewContent'>
            {isReadMore ? shortContent : content}
          </div>
          <div>
            <a
              href='#'
              style={{ color: '#096dd9' }}
              onClick={this.readMoreClick}
            >
              {isReadMore ? 'Read more' : 'Read less'}
            </a>
          </div>
        </>
      )
    } else {
      return <div className='reviewContent'>{shortContent}</div>
    }
  }
}

export default ReviewContent
