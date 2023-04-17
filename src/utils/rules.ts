import * as yup from 'yup'

export const schemaAuth = yup
  .object({
    email: yup.string().email().required(),
    password: yup
      .string()
      .min(6, 'Mật khẩu cần ít nhất 6 ký tự')
      .max(120, 'Mật khẩu không được vượt quá 120 ký tự')
      .required(),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('password')], 'Mật khẩu không trùng khớp')
      .min(6, 'Mật khẩu cần ít nhất 6 ký tự')
      .max(120, 'Mật khẩu không được vượt quá 120 ký tự')
      .required()
  })
  .required()

export type SchemaAuth = yup.InferType<typeof schemaAuth>

export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: yup
    .string()
    .min(6, 'Mật khẩu cần ít nhất 6 ký tự')
    .max(120, 'Mật khẩu không được vượt quá 120 ký tự')
    .required(),
  new_password: yup
    .string()
    .min(6, 'Mật khẩu cần ít nhất 6 ký tự')
    .max(120, 'Mật khẩu không được vượt quá 120 ký tự')
    .required(),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Mật khẩu không trùng khớp')
    .min(6, 'Mật khẩu cần ít nhất 6 ký tự')
    .max(120, 'Mật khẩu không được vượt quá 120 ký tự')
    .required()
})

export type UserSchema = yup.InferType<typeof userSchema>
