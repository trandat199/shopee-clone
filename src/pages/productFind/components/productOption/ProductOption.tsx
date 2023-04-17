import React from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { order, sortBy } from 'src/constants/product'
import { ProductQueryParam } from '../../ProductFind'
import { ProductQueryParams, Products } from 'src/types/product.type'
import omit from 'lodash/omit'

interface Props {
  dataQueryParam: ProductQueryParam
  productList?: Products
}
const ProductOption = ({ dataQueryParam, productList }: Props) => {
  const nav = useNavigate()
  const isActive = (value: ProductQueryParams['sort_by']) => {
    return dataQueryParam?.sort_by === value
  }

  const handleOptions = (value: Exclude<ProductQueryParams['sort_by'], undefined>) => {
    nav({
      pathname: '/productFind',
      search: createSearchParams(
        omit(
          {
            ...dataQueryParam,
            sort_by: value
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePrice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    nav({
      pathname: '/productFind',
      search: createSearchParams({
        ...dataQueryParam,
        sort_by: 'price',
        order: e.target.value
      }).toString()
    })
  }

  const handleIncrease = () => {
    if (Number(dataQueryParam.page) < Number(productList?.pagination.page_size)) {
      nav({
        pathname: '/productFind',
        search: createSearchParams({
          ...dataQueryParam,
          page: (Number(dataQueryParam.page) + 1).toString()
        }).toString()
      })
    }
  }
  const handleReduce = () => {
    if (Number(dataQueryParam.page) > 1) {
      nav({
        pathname: '/productFind',
        search: createSearchParams({
          ...dataQueryParam,
          page: (Number(dataQueryParam.page) - 1).toString()
        }).toString()
      })
    }
  }
  return (
    <div className='flex items-center gap-6 overflow-y-auto bg-slate-100 px-8 py-5 text-xl'>
      <span className='hidden lg:block'>Sắp xếp theo</span>
      <button
        className={`${
          isActive(sortBy.createdAt) ? 'bg-red-500 text-white' : 'bg-white text-black'
        } whitespace-nowrap rounded-sm px-5 py-4 text-xl`}
        onClick={() => handleOptions(sortBy.createdAt)}
      >
        Liên Quan
      </button>
      <button
        className={`${
          isActive(sortBy.view) ? 'bg-red-500 text-white' : 'bg-white text-black'
        } whitespace-nowrap rounded-sm px-5 py-4 text-xl`}
        onClick={() => handleOptions(sortBy.view)}
      >
        Mới Nhất
      </button>
      <button
        className={`${
          isActive(sortBy.sold) ? 'bg-red-500 text-white' : 'bg-white text-black'
        } whitespace-nowrap rounded-sm px-5 py-4 text-xl`}
        onClick={() => handleOptions(sortBy.sold)}
      >
        Bán Chạy
      </button>
      <select
        value={dataQueryParam.order || ''}
        className={`cursor-pointer px-1 py-3  outline-none ${dataQueryParam.order ? 'text-red-500' : ''}`}
        onChange={handlePrice}
      >
        <option value='' disabled>
          Giá
        </option>
        <option value={order.asc}>Giá: Thấp đến cao</option>
        <option value={order.desc}>Giá: Cao đến Thấp</option>
      </select>
      <div className=' hidden flex-1 lg:block'>
        <div className='flex items-center justify-end gap-5'>
          {dataQueryParam.page}/{productList?.pagination.page_size}
          <div className='flex items-center gap-1'>
            <button
              className={`bg-white px-5 py-5 ${dataQueryParam.page === '1' ? 'cursor-no-drop' : null}`}
              disabled={dataQueryParam.page === '1'}
              onClick={handleReduce}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18' />
              </svg>
            </button>
            <button
              className={`bg-white px-5 py-5 ${
                Number(dataQueryParam.page) >= Number(productList?.pagination.page_size) ? 'cursor-no-drop' : null
              }`}
              disabled={Number(dataQueryParam.page) >= Number(productList?.pagination.page_size)}
              onClick={handleIncrease}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductOption
