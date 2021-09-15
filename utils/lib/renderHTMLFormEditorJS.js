
import React  from 'react';
import renderHTML from 'react-render-html'
import Image from 'next/image'

const makeUpText = (text) => {
  if (text && text.indexOf('&amp;') !== -1) {
    text.replace('&amp;', '&')
  }
  if (text && text.indexOf('�') !== '1') {
    text = text.replace(/[�]/g, '')
  }
  return text
}

const truncateText = (text, length) => {
  if (text.length <= length) {
    return text
  }
  text = text.substring(0, length)
  let last = text.lastIndexOf(' ')
  text = text.substring(0, last)
  return text + '...'
}

const renderHTMLFormEditorJS = (elm, index, truncate) => {
  if (!elm || !elm.data) return null
  let html = []
  switch (elm.type) {
    case 'paragraph':
      if (truncate && truncate.activeTruncate) {
        html.push(<p key={index}>{renderHTML(makeUpText(truncateText(elm.data.text, truncate.length)) || '')}</p>)
      } else html.push(<p key={index}>{renderHTML(makeUpText(elm.data.text) || '')}</p>)
      break
    case 'header':
      const level = elm.data && elm.data.level
      let dom = <h3 key={index}>{renderHTML(makeUpText(elm.data.text) || '')}</h3>
      if (level === 2) dom = <h2 key={index}>{renderHTML(makeUpText(elm.data.text) || '')}</h2>
      else if (level === 4) dom = <h4 key={index}>{renderHTML(makeUpText(elm.data.text) || '')}</h4>
      html.push(dom)
      break
    case 'list':
      html = (
        <ul key={index} style={{ listStyleType: 'disc' }}>
          {elm.data.items.length > 0 &&
           elm.data.items.map((elm, index) => (
             <li key={index}><p>{renderHTML(makeUpText(elm) || '')}</p></li>
           ))}
        </ul>
      )
      break
    case 'image':
      html.push(<><Image width='970' height='500' objectFit='contain' key={index} src={elm.data.file.url || ''} />
        <div className='caption'>{elm.data.caption}</div></>)
      break
    case 'checkList':
      html = (
        <>
          {elm.data.items.length > 0 && elm.data.items.map((elm, index) => (
            <div className='d-flex align-items-center' key={index}>
              <input checked={elm.checked ? checked : ''} type='checkbox' name={index} id={index} />
              <span style={{ marginLeft: '3px' }}>{renderHTML(makeUpText(elm.text) || '')}</span>
            </div>
          ))}
        </>
      )
      break
    case 'raw':
      html = renderHTML(elm.data.html)
      break
    case 'table':
      html = (
        <table border='1' style={{ width: '100%', tableLayout: 'fixed' }}>
          <tbody>
            {elm.data.content.map((elm, index) => (
              <tr key={index}>
                {elm.map((subElm, stt) => (
                  <td style={{ padding: '10px 10px' }} key={stt}>{makeUpText(subElm)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
  }
  return html
}

export default renderHTMLFormEditorJS
