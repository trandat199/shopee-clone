import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { UserSchema, userSchema } from 'src/utils/rules'
import Input from 'src/components/input/Input'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { useMutation } from '@tanstack/react-query'
import { userApi } from 'src/apis/user.api'
import omit from 'lodash/omit'
import { ErrorResponse } from 'src/types/utils.type'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'confirm_password', 'new_password'])
const Password = () => {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
      new_password: ''
    }
  })

  const updateProfileMutation = useMutation(userApi.updateProfile)

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      // toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError?.password) {
          setError('password', {
            type: 'Sever',
            message: formError.password
          })
        }
      }
    }
  })

  return (
    <div className='rounded-md bg-white px-14 py-8 shadow-lg'>
      <div className='border border-x-transparent border-b-gray-200 border-t-transparent pb-8'>
        <h1 className='text-3xl'>Đổi Mật Khẩu</h1>
        <p className='mt-2 text-xl font-light text-gray-500'>
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </p>
      </div>
      <div className='grid lg:grid-cols-8 lg:px-14'>
        <div className='lg:col-span-5'>
          <form className='mt-16 flex flex-col gap-8' onSubmit={onSubmit}>
            <div className='flex flex-col items-center gap-5 lg:flex-row'>
              <div className='text-2xl text-gray-600 lg:w-[40%] lg:text-right'>Mật Khẩu Hiện Tại</div>
              <div className='h-[35px] lg:w-[60%]'>
                <Input
                  type='password'
                  errors={errors.password?.message as string}
                  className='h-full w-full'
                  name='password'
                  control={control}
                />
              </div>
            </div>
            <div className='flex flex-col items-center gap-5 lg:flex-row'>
              <div className='text-2xl text-gray-600 lg:w-[40%] lg:text-right'>Mật Khẩu Mới</div>
              <div className='h-[35px] lg:w-[60%]'>
                <Input
                  type='password'
                  className='h-full w-full'
                  name='new_password'
                  errors={errors.new_password?.message as string}
                  control={control}
                />
              </div>
            </div>
            <div className='flex flex-col items-center gap-5 lg:flex-row'>
              <div className=' text-2xl text-gray-600 lg:w-[40%] lg:text-right'>Xác Nhận Mật Khẩu</div>
              <div className='h-[35px] lg:w-[60%]'>
                <Input
                  type='password'
                  className='h-full w-full'
                  name='confirm_password'
                  errors={errors.confirm_password?.message as string}
                  control={control}
                />
              </div>
            </div>
            <div className='text-center'>
              <button
                type='submit'
                className='w-[100px] rounded-sm bg-red-500 py-4 text-white shadow-md lg:ml-[225px] lg:w-[100px]'
              >
                Xác Nhận
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Password
