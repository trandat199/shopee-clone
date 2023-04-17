import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { SchemaAuth, schemaAuth } from 'src/utils/rules'
import Input from 'src/components/input/Input'
import { authApi } from 'src/apis/auth.api'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
const Register = () => {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<SchemaAuth>({
    resolver: yupResolver(schemaAuth)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<SchemaAuth, 'confirm_password'>) => authApi.registerAccount(body)
  })
  const onSubmit: SubmitHandler<SchemaAuth> = (data) => {
    registerAccountMutation.mutate(omit(data, ['confirm_password']), {
      onSuccess: () => {
        toast.success('🦄 Wow so easy!', {
          position: 'top-right',
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
        reset()
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<SchemaAuth, 'confirm_password'>>>(error)) {
          const FormError = error.response?.data.data
          if (FormError?.email) {
            setError('email', {
              type: 'Sever',
              message: FormError?.email
            })
          }
        }
      }
    })
  }
  return (
    <div className='bg-[rgb(238,_77,_45)]'>
      <div className='mx-auto bg-auto bg-no-repeat lg:h-[600px] lg:w-[1100px] lg:bg-[url(https://down-vn.img.susercontent.com/file/sg-11134004-23030-0zzd19u7qvov47)]'>
        <div className='grid h-full items-center p-5 lg:grid-cols-12'>
          <div className='bg-white p-10 lg:col-span-12 lg:col-start-8'>
            <h2 className='text-4xl'>Đăng ký</h2>
            <form className='mt-7 flex flex-col gap-1' onSubmit={handleSubmit(onSubmit)}>
              <Input
                control={control}
                type='email'
                placeholder='Email'
                name='email'
                errors={errors.email?.message as string}
              />
              <Input
                control={control}
                type='password'
                placeholder='Password'
                name='password'
                errors={errors.password?.message as string}
              />
              <Input
                control={control}
                type='password'
                placeholder='Password'
                name='confirm_password'
                errors={errors.confirm_password?.message as string}
              />
              <button
                type='submit'
                className={`bg-red-500 py-3 font-semibold text-white shadow-md ${
                  registerAccountMutation.isLoading ? 'flex items-center justify-center' : null
                }`}
              >
                {registerAccountMutation.isLoading && (
                  <svg
                    aria-hidden='true'
                    className='mr-2 h-6 w-6 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                )}
                Đăng ký
              </button>
            </form>
            <p className='mt-6 text-center text-xl'>
              {' '}
              Bạn đã có tài khoản?
              <Link to='/login' className='ml-2 text-2xl text-red-500'>
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
