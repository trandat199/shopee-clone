/* eslint-disable jsx-a11y/label-has-associated-control */
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { userApi } from 'src/apis/user.api'
import InputUser from '../../components/InputUser/InputUser'
import { UserSchema, userSchema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { getAvatarUrl } from 'src/utils/utils'
import { Appcontext } from 'src/contexts/app.context'
import { setProfileLS } from 'src/utils/auth'
import DateSelect from '../../components/DateSelect/DateSelect'

type FormData1 = Pick<UserSchema, 'name' | 'phone' | 'address' | 'avatar' | 'date_of_birth'>
const userdSchema = userSchema.pick(['name', 'phone', 'address', 'avatar', 'date_of_birth'])
const Profile = () => {
  const { setProfile } = useContext(Appcontext)
  const imgRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File>()
  const { data: profileUser, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile()
  })

  const uploadAvatar = useMutation(userApi.uploadAvatar)

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const uploadAvatarMutaion = useMutation({
    mutationFn: userApi.updateProfile
  })

  const methods = useForm<FormData1>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(userdSchema)
  })

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = methods

  const avatar = watch('avatar')

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatar.mutateAsync(form)
        avatarName = uploadRes.data.data
      }
      const res = await uploadAvatarMutaion.mutateAsync({
        ...data,
        avatar: avatarName,
        date_of_birth: data.date_of_birth?.toISOString()
      })

      setProfile(res?.data.data)
      setProfileLS(res.data.data)
      refetch()
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (profileUser) {
      setValue('address', profileUser.data.data.address)
      setValue('name', profileUser.data.data.name)
      setValue('phone', profileUser.data.data.phone)
      setValue(
        'date_of_birth',
        profileUser.data.data.date_of_birth ? new Date(profileUser.data.data.date_of_birth) : new Date(1990, 0, 1)
      )
    }
  }, [profileUser, setValue])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filefromLocal = e.target.files?.[0]
    setFile(filefromLocal)
  }

  return (
    <div className='rounded-md bg-white p-3 shadow-lg lg:px-14 lg:py-8'>
      <div className='border border-x-transparent border-b-gray-200 border-t-transparent pb-8'>
        <h1 className='text-3xl'>Hồ Sơ Của Tôi</h1>
        <p className='mt-2 text-xl font-light text-gray-500'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <div className='grid grid-cols-8 px-2 lg:px-14'>
        <div className='col-span-5'>
          <FormProvider {...methods}>
            <form className='mt-16 flex flex-col gap-10' onSubmit={onSubmit}>
              <div className='flex flex-col items-center lg:flex-row lg:gap-5'>
                <div className='w-full text-2xl text-gray-600 lg:w-[20%] lg:text-right'>Tên</div>
                <InputUser type='text' name='name' control={control} />
              </div>
              <div className='flex flex-col items-center lg:flex-row lg:gap-5'>
                <div className='w-full text-2xl text-gray-600 lg:w-[20%] lg:text-right'>Địa chỉ</div>
                <InputUser type='text' name='address' control={control} />
              </div>
              <div className='flex flex-col items-center lg:flex-row lg:gap-5'>
                <div className='w-full text-2xl text-gray-600 lg:w-[20%] lg:text-right'>Email</div>
                <p className='text-xl'>{profileUser?.data.data.email}</p>
              </div>
              <div className='flex flex-col items-center lg:flex-row lg:gap-5'>
                <div className='w-full text-2xl text-gray-600 lg:w-[20%] lg:text-right'>Số điện thoại</div>
                <InputUser type='text' name='phone' control={control} />
              </div>
              <Controller
                control={control}
                name='date_of_birth'
                render={({ field }) => (
                  <DateSelect
                    errorMessage={errors.date_of_birth?.message}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <button type='submit' className='w-[70px] rounded-sm bg-red-500 py-4 text-white shadow-md lg:ml-[118px]'>
                Lưu
              </button>
            </form>
          </FormProvider>
        </div>
        <div className='col-span-3 mt-14'>
          <div className='mx-auto flex w-[80%] flex-col items-center justify-center gap-5 border-l-2 border-gray-300 pl-5 lg:px-20'>
            <img
              src={previewImage || getAvatarUrl(profileUser?.data.data.avatar)}
              alt=''
              className='h-[50px] w-[50px] rounded-full object-cover lg:h-[100px] lg:w-[100px]'
            />
            <input type='file' className='hidden' ref={imgRef} accept='.png,.jpg' onChange={onFileChange} />
            <button
              className='border border-gray-300 px-2 py-2 text-lg capitalize lg:px-5 lg:py-3 lg:text-2xl'
              onClick={() => imgRef.current?.click()}
            >
              Chọn ảnh
            </button>
            <p className='text-sm lg:text-xl'>Dụng lượng file tối đa 1 MB Định dạng:.JPEG, .PNG</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
