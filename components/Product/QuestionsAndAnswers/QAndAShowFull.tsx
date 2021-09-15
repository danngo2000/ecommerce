import React, { useEffect, useState } from 'react'
import QuestionBlock from './QuestionBlock'
import ProductItem from '../ProductItem'
import axios from 'axios'
import { Row, Col } from 'antd'

export default function QAndAShowFull({ product }) {
  const [listQuestion, setListQuestion] = useState([])
  const getData = async () => {
    try {
      if (product) {
        const { data } = await axios.get(
          `/questions-and-answers?productId=${product._id}`
        )
        let questionArr: any = []
        if (data) {
          if (Array.isArray(data.QA) && data.QA.length > 0) {
            questionArr = data.QA.filter((elm) => {
              if (elm.answers.length > 0) return elm
            })
          }
        }
        setListQuestion(questionArr)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getData()
  }, [])
  return (
    <div className='show-all-questions'>
      <Row>
        <Col xl={17} lg={17} md={17} className='show-questions'>
          {listQuestion.length > 0 ? (
            <div className='question-block'>
              {listQuestion &&
                listQuestion.map((elm, index) => (
                  <QuestionBlock question={elm} key={index} />
                ))}
            </div>
          ) : (
            ''
          )}
        </Col>
        <Col xl={2} lg={2} md={2} sm={0} />
        <Col xl={5} lg={5} md={5} className='product-detail'>
          <ProductItem type='question' product={product} />
        </Col>
      </Row>
    </div>
  )
}
