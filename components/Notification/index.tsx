import { Snackbar } from '@material-ui/core'
import React, { useState } from 'react'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const Notification = ({ info, isOpen, onClose }) => {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      <Alert onClose={onClose} severity='success'>
        {info}
      </Alert>
    </Snackbar>
  )
}

export default Notification
