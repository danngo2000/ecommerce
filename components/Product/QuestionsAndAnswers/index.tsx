import React, { useState, useEffect } from 'react'
import PostQuestion from './PostQuestion'
import QuestionBlock from './QuestionBlock'
import LinkShowAll from './LinkShowAll'
import axios from 'axios'

export default function QuestionsAndAnswers({ product }) {
  const [listQuestion, setListQuestion] = useState([])
  const [listShowAll, setListShowAll] = useState([])
  const [showLink, setShowLink] = useState(false)

  const fetchData = async () => {
    try {
      let limitRender = 3
      const { data } = await axios.get(
        `/questions-and-answers?productId=${product._id}`
      )
      if (data) {
        setListQuestion(data.QA.slice(0, limitRender))
        setListShowAll(data.QA)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkRenderLinkShowAll = () => {
    if (listShowAll && listShowAll.length > 0) {
      listShowAll.forEach((elm: any) => {
        const { answers } = elm
        if (answers && answers.length > 0) {
          answers.forEach((_elm) => {
            if (_elm.status === 'approved') {
              setShowLink(true)
            }
          })
        }
      })
    }
  }
  useEffect(() => {
    checkRenderLinkShowAll()
  }, [listShowAll])
  useEffect(() => {
    fetchData()
  }, [product])
  return (
    <div className='questions-answers'>
      <h3 className='title'>Question about product?</h3>
      <div className='wrap-content'>
        {listQuestion.length > 0 ? (
          <div className='question-block'>
            {listQuestion &&
              listQuestion.map((elm, index) => (
                <QuestionBlock question={elm} key={index} />
              ))}
            {showLink && <LinkShowAll product={product} />}
          </div>
        ) : (
          ''
        )}
        <div className='post-question'>
          <PostQuestion product={product} />
        </div>
      </div>
    </div>
  )
}
