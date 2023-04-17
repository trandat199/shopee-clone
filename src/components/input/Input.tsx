import React, { Fragment } from 'react'
import { Control, useController } from 'react-hook-form'

interface Props {
  type: React.HTMLInputTypeAttribute
  placeholder?: string
  control: Control<any>
  name: string
  className?: string
  errors: string
}
const Input = ({ control, errors, ...props }: Props) => {
  const { field } = useController({ control, name: props.name, defaultValue: '' })
  return (
    <Fragment>
      <input
        {...field}
        {...props}
        className={`w-full rounded-sm border border-gray-400 px-5 py-3 text-xl outline-none placeholder:text-xl ${props.className}}`}
      />
      <div className='min-h-[1.7rem] text-xl text-red-500'>{errors}</div>
    </Fragment>
  )
}

export default Input
