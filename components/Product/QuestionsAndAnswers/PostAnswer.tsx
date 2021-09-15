import React, { useState, useEffect } from 'react'
import { Input, Row, Col, Button } from 'antd'
import Notification from './Notification'
import axios from 'axios'

export default function PostAnswer({ customer, question, setAnswer }) {
  const [answer, setAnswerValue] = useState('')
  const [show, setShowNotification] = useState(false)
  const [options, setOptions] = useState({})
  const AnswerChange = (val) => {
    setAnswerValue(val)
  }
  const showNotification = (options) => {
    setShowNotification(true)
    setOptions(options)
  }
  const handlePostQuestion = async () => {
    if (answer === '') {
      setShowNotification(true)
      const options = {
        message: 'Please Enter Your Answer To Post',
        type: 'warning'
      }
      showNotification(options)
      return true
    }
    const payload = {
      questionId: question._id,
      customer,
      content: answer
    }
    const {
      data: { error }
    } = await axios.post('questions-and-answers/answer', { ...payload })
    if (!error) {
      setShowNotification(true)
      const options = {
        message: 'Post Answer Success',
        type: 'success'
      }
      showNotification(options)
      setTimeout(() => {
        setAnswer(false)
      }, 3000)
    } else {
      const options = {
        message: error,
        type: 'warning'
      }
      showNotification(options)
      setTimeout(() => {
        setAnswer(false)
      }, 3000)
    }
  }
  return (
    <div className='post-answer-blocks'>
      {show && <Notification options={options} subClass='answer' />}
      <Row>
        <Col xl={20} lg={20} md={20} sm={20} className='left-content'>
          <Input
            size='large'
            placeholder='Enter your answer...'
            className='input-ant'
            type='text'
            onChange={(e) => AnswerChange(e.target.value)}
          />
        </Col>
        <Col xl={3} lg={3} md={3} sm={3} className='right-content'>
          <Button
            className='btn-ant'
            size='large'
            onClick={() => handlePostQuestion()}
          >
            Send Answer
          </Button>
        </Col>
      </Row>
    </div>
  )
}
