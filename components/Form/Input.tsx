import React, { FC } from "react"
import { TextField } from "@material-ui/core"

interface IProp {
    onChange: any
    name: string
    label: string
    placeholder: string
    value: string
    error?: boolean
    type?: string
}

const Input:FC<IProp> = ({ name, label, onChange, placeholder, value, error = null, type }) => {
  return (
    <TextField
      onChange={onChange}
      helperText=''
      name={name}
      label={label}
      placeholder={placeholder}
      value={value}
      fullWidth
      type={type}
      margin='normal'
      InputLabelProps={{
        shrink: true,
      }}
      rows={4}
      variant='outlined'
      {...(error && { error: true, helperText: error })}
      // {...(multiline && {multiline: true })}
    />
  )
}

export default Input
