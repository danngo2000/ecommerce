import React, { FC } from "react"
import { TextField } from "@material-ui/core"

interface IProp {
  value: string
  onChange: any
  name: string
  label: string
  error: boolean
  children: any
}

const Select: FC<IProp> = ({ children, name, label, onChange, value, error = null }) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      name={name}
      defaultValue={0}
      fullWidth
      select
      label={label}
      margin='normal'
      SelectProps={{
        native: true
      }}
      variant='outlined'
      {...(error && { error: true, helperText: error })}
    >
      {children}
    </TextField>
  )
}

export default Select
