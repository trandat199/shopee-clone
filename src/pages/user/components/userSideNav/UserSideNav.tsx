import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Appcontext } from 'src/contexts/app.context'
import { getAvatarUrl } from 'src/utils/utils'

const UserSideNav = () => {
  const { profile } = useContext(Appcontext)
  return (
    <div>
      <div className='flex items-center gap-3'>
        <img
          src={getAvatarUrl(profile?.avatar)}
          alt=''
          className='h-[40px] w-[40px] shrink-0 rounded-full object-cover'
        />
        <div className='flex flex-col gap-1'>
          <h2 className='font-semibold'>dattran199920</h2>
          <div className='flex text-xl text-gray-400'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 10-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25L12.75 9'
              />
            </svg>
            Sửa Hồ Sơ
          </div>
        </div>
      </div>
      <div className='mt-16 flex flex-col gap-5 text-xl'>
        <NavLink
          end
          to='/user/profile'
          className={({ isActive }) => (isActive ? 'text-red-500' : 'text-black hover:text-red-500')}
        >
          Hồ Sơ
        </NavLink>
        <NavLink
          to='/user/password'
          className={({ isActive }) => (isActive ? 'text-red-500' : 'text-black hover:text-red-500')}
        >
          Đổi Mật Khẩu
        </NavLink>
        <NavLink
          to='/user/purchase'
          className={({ isActive }) => (isActive ? 'text-red-500' : 'text-black hover:text-red-500')}
        >
          Đơn Mua
        </NavLink>
      </div>
    </div>
  )
}

export default UserSideNav
