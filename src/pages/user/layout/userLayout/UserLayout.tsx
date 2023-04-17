import React from 'react'
import UserSideNav from '../../components/userSideNav/UserSideNav'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <div className='bg-slate-100'>
      <div className='mx-auto py-10 lg:w-[1200px]'>
        <div className='grid grid-cols-1 lg:grid-cols-12'>
          <div className='p-5 lg:col-span-2'>
            <UserSideNav></UserSideNav>
          </div>
          <div className='lg:col-span-10'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLayout
