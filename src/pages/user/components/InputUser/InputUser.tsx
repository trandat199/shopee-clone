import React, { Fragment } from 'react'
import { Control, useController } from 'react-hook-form'

interface Props {
  type: React.HTMLInputTypeAttribute
  placeholder?: string
  control: Control<any>
  name: string
  errors?: string
}
const InputUser = ({ control, ...props }: Props) => {
  const { field } = useController({ control, name: props.name, defaultValue: '' })
  return (
    <Fragment>
      <input
        {...field}
        {...props}
        className='h-[35px] w-full border border-gray-400 px-5 text-xl outline-none lg:w-[80%]'
      />
    </Fragment>
  )
}

export default InputUser
