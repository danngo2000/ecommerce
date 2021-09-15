import React, { useState, useRef, useEffect } from 'react'
import { Input, Row, Col, Button } from 'antd'
import Notification from './Notification'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { toggleLoginDialog } from '../../../actions/ui'

export default function PostQuestion({ product }) {
  const dispatch = useDispatch()
  const customer = useSelector((state: any) => state.customer)
  const isGuest = useSelector((state: any) => state.auth.isGuest)
  const [topic, setTopic] = useState('')
  const [show, setShowNotification] = useState(false)
  const [options, setOptions] = useState({})
  const [open, setOpen] = useState(false)
  const myRef = useRef<any>(null)
  const topicChange = (val) => {
    setTopic(val)
  }
  const showNotification = (options) => {
    setOptions(options)
  }
  const handlePostQuestion = async () => {
    if (!customer) return
    if (topic === '') {
      setShowNotification(true)
      const options = {
        message: 'Please Enter Your Topic To Post',
        type: 'warning'
      }
      showNotification(options)
      return true
    }
    const payload = {
      author_customer: customer._id,
      product: product._id,
      customerId: customer._id,
      topic
    }
    const {
      data: { error }
    } = await axios.post('questions-and-answers/question', { ...payload })
    if (Object.keys(error).length === 0) {
      const options = {
        message: 'Post Question Success',
        type: 'success'
      }
      showNotification(options)
      setTopic('')
    } else {
      const options = {
        message: 'Server Error',
        type: 'warning'
      }
      showNotification(options)
    }
  }
  const handleFocus = (e) => {
    if (isGuest) {
      dispatch(toggleLoginDialog(true))
      myRef.current.blur()
    }
  }
  const handleOpen = () => {
    setOpen(!open)
  }
  useEffect(() => {
    if (typeof options === 'object' && Object.keys(options).length > 0) {
      setShowNotification(true)
    }
  }, [options, show])

  return (
    <>
      {show && <Notification options={options || {}} />}
      <div className='post-question-blocks'>
        <Row className='full-edition'>
          <Col xl={20} lg={20} md={20} sm={20} className='left-content'>
            <Input
              ref={myRef}
              allowClear
              id='input'
              size='large'
              placeholder='Please ask questions relate to product...'
              className='input-ant'
              type='text'
              value={topic}
              onChange={(e) => topicChange(e.target.value)}
              onClick={(e) => handleFocus(e)}
            />
          </Col>
          <Col xl={4} lg={4} md={4} sm={4} className='right-content'>
            <Button
              className='btn-ant'
              size='large'
              onClick={handlePostQuestion}
            >
              Send Question
            </Button>
          </Col>
        </Row>
        <Row className='responsive_edition'>
          <Button onClick={handleOpen} className='btn-open'>
            Ask a question for product
          </Button>
          {open && (
            <>
              <Col xl={20} lg={20} md={20} sm={20} className='left-content'>
                <Input
                  ref={myRef}
                  allowClear
                  id='input'
                  size='large'
                  placeholder='Please ask questions relate to product...'
                  className='input-ant'
                  type='text'
                  value={topic}
                  onChange={(e) => topicChange(e.target.value)}
                  onClick={(e) => handleFocus(e)}
                />
              </Col>
              <Col xl={4} lg={4} md={4} sm={4} className='right-content'>
                <Button
                  className='btn-ant'
                  size='large'
                  onClick={handlePostQuestion}
                >
                  Send Question
                </Button>
              </Col>
            </>
          )}
        </Row>
      </div>
    </>
  )
}
