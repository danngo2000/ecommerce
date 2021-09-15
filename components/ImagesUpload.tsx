import React, { useState, useEffect, CSSProperties } from 'react'
import { Upload, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
const container: CSSProperties = {
  width: '100%'
}

const uploadButton = (
  <div>
    <PlusOutlined />
    <div className='ant-upload-text'>Upload</div>
  </div>
)

type UploadImageGroupProps = {
  values?: string | any[],
  handleValueChange?: any,
  maximumImages?: number,
  className?: string,
  conditionToRevertComponent?: boolean,
  actionUrl?: string
}

const handleRequest = async ({ onSuccess, onProgress, file }: any, actionUrl = 'customer-reviews/upload/customer' , handleValueChange) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'customer-review')
    const { data } = await axios.post(
      actionUrl,
      formData,
      {
        onUploadProgress: (e) => {
          onProgress({ percent: (e.loaded / e.total) * 100 })
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    if (data) {
      onSuccess({
        url: (data.file && data.file.url) || data.url,
        thumbUrl: (data.file && data.file.url) || data.url,
        status: 'done',
        type: 'fileStorage',
        fileStorageId: data._id ? data._id : '',
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const UploadImageGroup = ({ values, handleValueChange, maximumImages = 5, className, actionUrl = 'customer-reviews/upload/customer' }: UploadImageGroupProps) => {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewType, setPreviewType] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [files, setFiles] = useState<any>([])

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewType(file.type?.substring(0, file.type?.lastIndexOf('/')) || 'image')
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const handleChange = ({ fileList }) => {
    setFiles(fileList.map(file => {
      if (file.response && file.response.url) {
        file.thumbUrl = file.response.url
        return file
      } else return file
    }))
  }

  const handleRemoveFile = async (file) => {
    try {
        if (file?.response?.fileStorageId) await axios.delete(`customer-reviews/upload/customer?_id=${file?.response?.fileStorageId}`)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = () => setPreviewVisible(false)

  // TODO : Format Data In Our DB For Ant Upload
  useEffect(() => {
    if (typeof values === 'string') {
      setFiles([{ url: values, status: 'done', name: 'avatar.jpg', uid: '-1' }])
    }
  }, [values])

  useEffect(() => {
    if (files.length) {
      let _files: any = []
      for (let file of files) {
          _files.push({
            _id: file?.response?.fileStorageId,
            url: file?.response?.url,
            type: file.type
          })
      }
      handleValueChange(_files)       
    }
  }, [files])

  return (
    <div className='clearfix' style={container}>
      <Upload
        listType='picture-card'
        fileList={files}
        onPreview={handlePreview}
        customRequest={(data) => handleRequest(data, actionUrl, handleValueChange)}
        onChange={handleChange}
        className={className}
        accept='image/*, video/*'
        onRemove={(file) => handleRemoveFile(file)}
      >
        {files.length >= maximumImages ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        {   
            previewType === 'image' ? <img alt='example' style={{ width: '100%' }} src={previewImage} /> :
            <video controls style={{ width: '100%' }} src={previewImage} />
        }
      </Modal>
    </div>
  )
}

export default UploadImageGroup