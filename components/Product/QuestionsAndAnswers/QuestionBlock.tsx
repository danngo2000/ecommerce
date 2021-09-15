import React, { useEffect, useState, useRef } from 'react'
import { Row, Col } from 'antd'
import PostAnswer from './PostAnswer'
import axios from 'axios'
import AnswerContent from './AnswerContent'
import Notification from './Notification'
import { useDispatch, useSelector } from 'react-redux'
import { toggleLoginDialog } from '../../../actions/ui'

export default function QuestionBlock({ question }) {
  const dispatch = useDispatch()
  const customer = useSelector((state: any) => state.customer)
  const isGuest = useSelector((state: any) => state.auth.isGuest)
  const [currentLike, setCurrentLike] = useState(question.like.length)
  const [answer, setAnswer] = useState(false)
  const [statusLike, setStatusLike] = useState(false)
  const [checkLike, setCheckLike] = useState(false)
  const [like, setLike] = useState(0)
  const [show, setShowNotification] = useState(false)
  const [options, setOptions] = useState({})
  const [answers, setAnswers] = useState<any>()
  const myRef = useRef(0)
  const showNotification = (options) => {
    setShowNotification(true)
    setOptions(options)
  }
  const handleGetAPILike = async (type) => {
    if (!customer) return
    const payload = {
      type,
      questionId: question._id,
      customerId: customer._id
    }
    const {
      data: { error }
    } = await axios.post('questions-and-answers/like', { ...payload })
    if (error) {
      setShowNotification(true)
      const options = {
        message: error,
        type: 'warning'
      }
      showNotification(options)
      return true
    } else {
      switch (type) {
        case 'unlike':
          setLike(0)
          setCurrentLike(currentLike > 0 ? currentLike - 1 : 0)
          setStatusLike(!statusLike)
          break
        case 'like':
          setLike(1)
          setCurrentLike(currentLike + 1)
          setStatusLike(!statusLike)
      }
    }
  }

  const handleLike = () => {
    if (isGuest) {
      dispatch(toggleLoginDialog(true))
      return true
    }
    setCheckLike(!checkLike)
  }
  const handleAnswerClick = () => {
    if (isGuest) {
      dispatch(toggleLoginDialog(true))
    } else {
      setAnswer(!answer)
    }
  }
  useEffect(() => {
    let index = -1
    if (question.like.length > 0 && customer && customer._id) {
      index = question.like.findIndex(
        (elm) => elm.author_customer.toString() === customer && customer._id
      )
    }
    if (index !== -1) {
      setStatusLike(true)
      setLike(1)
    }
  }, [customer])
  useEffect(() => {
    if (myRef.current === 1) {
      if (like === 0 && !statusLike) {
        handleGetAPILike('like')
      }
      if (like === 1 && statusLike) {
        handleGetAPILike('unlike')
      }
    }
    myRef.current = 1
  }, [checkLike])
  useEffect(() => {
    if (question.answers && Array.isArray(question.answers)) {
      setAnswers(question.answers)
    }
  }, [question])
  return (
    <div className='question-item'>
      <Row className='content'>
        <Col xl={2} lg={2} md={2} sm={2} className='like'>
          <p className='number'>{currentLike}</p>
        </Col>
        <Col xl={22} lg={22} md={22} sm={22} className='topic'>
          <img
            src='https://frontend.tikicdn.com/_new-next/static/img/icons/question.svg'
            alt=''
          />
          <p>{question.topic}</p>
        </Col>
      </Row>
      <Row className='content-bottom'>
        <Col xl={2} lg={2} md={2} sm={2} className='like-character'>
          <p className='number'>Like</p>
          {answers && answers.length > 0 && (
            <img
              src='https://frontend.tikicdn.com/_new-next/static/img/icons/answer.svg'
              alt=''
            />
          )}
        </Col>
        <Col xl={22} lg={22} md={22} sm={22} className='answer'>
          <div className='answer-content'>
            {<AnswerContent answers={answers} />}
          </div>
          {show && <Notification options={options} subClass='answer' />}
          <Row className='action-group'>
            <button
              className={`btn-ant btn-like ${statusLike ? 'like' : ''}`}
              onClick={() => handleLike()}
            >
              {statusLike ? 'Liked' : 'Like'}
            </button>
            <button
              className={`btn-ant ${answer ? 'answered' : ''}`}
              onClick={() => handleAnswerClick()}
            >
              Answer
            </button>
          </Row>
          {answer && (
            <PostAnswer
              setAnswer={setAnswer}
              question={question}
              customer={customer}
            />
          )}
        </Col>
      </Row>
    </div>
  )
}
