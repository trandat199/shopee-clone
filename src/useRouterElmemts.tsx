import React, { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Register from './pages/register/Register'
import RegisterLayout from './layouts/registerLayout/RegisterLayout'
import Login from './pages/login/Login'
import MainLayout from './layouts/MainLayout/MainLayout'
import ProductFind from './pages/productFind/ProductFind'
import ProductDetail from './pages/productDetail/ProductDetail'
import UserLayout from './pages/user/layout/userLayout/UserLayout'
import Profile from './pages/user/pages/profile/Profile'
import Password from './pages/user/pages/password/Password'
import Cart from './pages/cart/Cart'
import Purchase from './pages/user/pages/purchase/Purchase'
import { Appcontext } from './contexts/app.context'
import Product from './pages/product/ProductHome'
import ProductHome from './pages/product/ProductHome'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(Appcontext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}
function RejectedRoute() {
  const { isAuthenticated } = useContext(Appcontext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
const useRouterElmemts = () => {
  const element = useRoutes([
    {
      path: '',
      element: <RejectedRoute></RejectedRoute>,
      children: [
        {
          path: '/register',
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        },
        {
          path: '/login',
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute></ProtectedRoute>,
      children: [
        {
          path: '/cart',
          element: (
            <MainLayout>
              <Cart />
            </MainLayout>
          )
        },
        {
          path: '/user',
          element: (
            <MainLayout>
              <UserLayout></UserLayout>
            </MainLayout>
          ),
          children: [
            {
              path: '/user/profile',
              element: <Profile></Profile>
            },
            {
              path: '/user/password',
              element: <Password></Password>
            },
            {
              path: '/user/purchase',
              element: <Purchase></Purchase>
            }
          ]
        }
      ]
    },

    {
      path: '/:nameId',
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: '/productfind',
      element: (
        <MainLayout>
          <ProductFind />
        </MainLayout>
      )
    },
    {
      path: '/',
      index: true,
      element: (
        <MainLayout>
          <ProductHome />
        </MainLayout>
      )
    }
  ])

  return element
}

export default useRouterElmemts
