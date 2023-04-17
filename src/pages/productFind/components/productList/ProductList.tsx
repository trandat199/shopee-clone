import React from 'react'
import { Link, createSearchParams, useMatch, useNavigate } from 'react-router-dom'
import { Products } from 'src/types/product.type'
import { exchangeMenony, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import Rating from '@mui/material/Rating'
import { ProductQueryParam } from '../../ProductFind'

interface Props {
  productList?: Products
  dataQueryParam: ProductQueryParam
}
const ProductList = ({ productList, dataQueryParam }: Props) => {
  const home = useMatch('/')
  const nav = useNavigate()
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    nav({
      pathname: `${home ? '/' : '/productfind'}`,
      search: createSearchParams({
        ...dataQueryParam,
        page: value.toString()
      }).toString()
    })
  }
  return (
    <div className='px-3 py-10 lg:px-0'>
      <ul className='grid grid-cols-2 gap-4 lg:grid-cols-5'>
        {productList &&
          productList.products.map((product) => {
            return (
              <Link to={`/${generateNameId({ name: product.name, id: product._id })}`} key={product._id}>
                <li className='ease cursor-pointer shadow-md duration-300 hover:-translate-y-2'>
                  <img src={product.image} alt={product.name} className='h-[200px] w-full object-cover' />
                  <div className='p-3'>
                    <h2 className='line-clamp-2 text-xl'>{product.name}</h2>
                    <div className='mt-3 flex items-center gap-3 text-xl'>
                      <p className='line-through'>{exchangeMenony(product.price_before_discount)}</p>
                      <p className=' text-2xl text-red-500'>{exchangeMenony(product.price)}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Rating name='read-only' value={product.rating} readOnly />
                      <span className='relative top-1 text-xl'>{formatNumberToSocialStyle(product.sold)}</span>
                    </div>
                  </div>
                </li>
              </Link>
            )
          })}
      </ul>
      <div className='mt-10 flex justify-center'>
        <Stack spacing={2}>
          <Pagination
            count={productList?.pagination.page_size}
            variant='outlined'
            shape='rounded'
            page={Number(dataQueryParam.page)}
            onChange={handleChange}
          />
        </Stack>
      </div>
    </div>
  )
}

export default ProductList
