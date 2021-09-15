import React from 'react'
import Moment from 'react-moment'

export default function AnswerContent({ answers }) {
  return (
    <>
      {answers && answers.length > 0 ? (
        <div className='answer-content'>
          {answers.map((elm, index) => (
            <div key={index} className='wrap-answer'>
              <p className='content'>{elm.content}</p>
              <p className='author'>
                {elm.author_name} answers at
                <span>
                  {
                    <Moment format='DD/MM/YYYY'>
                      {elm.created_at.split('T')[0]}
                    </Moment>
                  }
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
