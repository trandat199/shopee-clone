import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { productApi } from 'src/apis/product.api'
import { exchangeMenony, formatNumberToSocialStyle, generateNameId, getIdFromNameId, rateSale } from 'src/utils/utils'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'
import DOMPurify from 'dompurify'
import purchaseApi from 'src/apis/purchases.api'
import { purchasesStatus } from 'src/constants/purchases'
import { Appcontext } from 'src/contexts/app.context'
const ProductDetail = () => {
  const { isAuthenticated } = useContext(Appcontext)
  const nav = useNavigate()
  const { nameId } = useParams()
  const [number, setNumber] = useState<number[]>([0, 5])
  const [quantity, setQuantity] = useState<number>(1)
  const [image, setImage] = useState<string[]>([])
  const [avatar, setAvatar] = useState<string>('')
  const Id = getIdFromNameId(nameId as string)

  const { data } = useQuery({
    queryKey: ['productdetail', nameId],
    queryFn: () => productApi.getProductDetails(Id)
  })

  const productdetail = data?.data
  const queryClient = useQueryClient()

  const purchaseMutation = useMutation({
    mutationFn: () => purchaseApi.addToCart({ product_id: productdetail?.data._id as string, buy_count: quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
      nav('/cart')
    }
  })

  const { data: productsData } = useQuery({
    queryKey: ['products', { category: productdetail?.data.category._id, limit: '20', page: '1' }],
    queryFn: () => productApi.getProduct({ limit: '20', page: '1', category: productdetail?.data.category._id })
  })

  useEffect(() => {
    if (productdetail) {
      setImage(productdetail.data.images.slice(number[0], number[1]))
    }
  }, [productdetail, number])

  useEffect(() => {
    if (productdetail) {
      setAvatar(productdetail.data.images[0])
    }
  }, [productdetail])

  const increaseImage = () => {
    if (number[1] < Number(productdetail?.data.images.length)) {
      setNumber((prev) => {
        return [prev[0] + 1, prev[1] + 1]
      })
    }
  }

  const reduceImage = () => {
    if (number[0] >= 1) {
      setNumber((prev) => {
        return [prev[0] - 1, prev[1] - 1]
      })
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d*$/.test(e.target.value)) {
      setQuantity(Number(e.target.value))
    }
  }

  return (
    <div className='bg-[#e6e6e651] px-5'>
      <div className='mx-auto py-5 lg:w-[1200px]'>
        {productdetail && (
          <div className='w-full'>
            <div className='grid grid-cols-1 bg-white lg:grid-cols-10 lg:gap-4'>
              <div className='col-span-4'>
                <img src={avatar} alt={productdetail?.data.name} className='w-full object-cover lg:h-[500px]' />
                <div className='relative py-3'>
                  <div className='grid grid-cols-5'>
                    {image &&
                      image.map((item, index) => {
                        const isImages = item === avatar
                        return (
                          <div
                            key={index}
                            className={`cursor-pointer ${isImages ? 'border-[2px] border-red-500' : ''} shrink-0 `}
                            onMouseEnter={() => setAvatar(item)}
                          >
                            <img src={item} alt='' className='object-cover' />
                          </div>
                        )
                      })}
                  </div>
                  <button className='absolute top-2/4 -translate-y-2/4 bg-gray-300 py-4' onClick={reduceImage}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-6 w-6 text-black '
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75'
                      />
                    </svg>
                  </button>
                  <button
                    className='absolute right-0 top-2/4 -translate-y-2/4 bg-gray-300 py-4'
                    onClick={increaseImage}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-6 w-6 text-black '
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75'
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className='px-5 lg:col-span-6'>
                <h1 className='text-3xl'>{productdetail?.data.name}</h1>
                <div className='flex items-center gap-2 py-8 lg:gap-8'>
                  <div className='flex items-center gap-2'>
                    <h2 className='text-red-500 underline'>{productdetail?.data.rating.toFixed(1)}</h2>
                    <Stack spacing={1}>
                      <Rating
                        name='half-rating-read'
                        value={Number(productdetail?.data.rating.toFixed(1))}
                        precision={0.5}
                        readOnly
                      />
                    </Stack>
                  </div>
                  <div className='flex items-center gap-2'>
                    <h2 className='underline'>3,7k</h2>
                    <span className='text-xl text-gray-400'>Đánh Giá</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <h2>{formatNumberToSocialStyle(productdetail?.data.sold)}</h2>
                    <span className='flex items-center gap-2 text-xl text-gray-400'>
                      Đã Bán{' '}
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
                          d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z'
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-6 bg-slate-100 px-7 py-10'>
                  <p className='line-through'>{exchangeMenony(Number(productdetail?.data.price_before_discount))}</p>
                  <p className='text-5xl text-red-500'>{exchangeMenony(Number(productdetail?.data.price))}</p>
                  <p className='bg-red-500 p-1 text-base font-semibold text-white'>
                    {rateSale(Number(productdetail?.data.price_before_discount), Number(productdetail?.data.price))}{' '}
                    GIẢM
                  </p>
                </div>
                <div className='mt-10 flex items-center'>
                  <button
                    className='flex h-[30px] w-14 items-center justify-center border border-y-gray-300 border-l-gray-300 border-r-transparent outline-none'
                    onClick={() => {
                      if (quantity > 1) {
                        setQuantity((prev) => prev - 1)
                      }
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-6 w-6'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M18 12H6' />
                    </svg>
                  </button>
                  <input
                    type='text'
                    value={quantity}
                    onBlur={() => {
                      if (quantity === 0) {
                        setQuantity(1)
                      }
                    }}
                    onChange={handleQuantityChange}
                    className='h-[30px] w-16 border border-gray-300 text-center outline-none'
                  />
                  <button
                    className='flex h-[30px] w-14 items-center justify-center border border-y-gray-300 border-l-transparent border-r-gray-300 outline-none'
                    onClick={() => {
                      if (quantity < Number(productdetail?.data.quantity)) {
                        setQuantity((prev) => prev + 1)
                      }
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-6 w-6'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v12m6-6H6' />
                    </svg>
                  </button>
                </div>
                <div className='mb-10 mt-10 flex items-center gap-4'>
                  <button
                    className='flex items-center gap-2 border border-red-500 bg-red-100 px-6 py-4 capitalize text-red-500'
                    onClick={() => {
                      if (isAuthenticated) {
                        purchaseMutation.mutate()
                      } else {
                        nav('/login')
                      }
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-8 w-8'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                      />
                    </svg>
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    className='bg-red-500 px-4 py-5 text-white'
                    onClick={() => {
                      if (isAuthenticated) {
                        purchaseMutation.mutate()
                      } else {
                        nav('/login')
                      }
                    }}
                  >
                    Mua Ngay
                  </button>
                </div>
              </div>
            </div>
            <div className='mt-4 bg-white p-5'>
              <h3>MÔ TẢ SẢN PHẨM</h3>
              <div
                className='flex flex-col gap-4 text-xl'
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(`<p>${productdetail?.data.description}</p>`)
                }}
              ></div>
            </div>
            <div className='mt-5'>
              <p className='text-2xl capitalize text-gray-500'>Sản phẩm tương tự</p>
              <ul className='grid grid-cols-2 gap-4 p-3 lg:grid-cols-6'>
                {productsData &&
                  productsData.data.data.products.slice(0, 6).map((item) => {
                    return (
                      <Link key={item._id} to={`/${generateNameId({ name: item.name, id: item._id })}`}>
                        <li className='bg-white'>
                          <img src={item.image} alt={item.name} className='w-full' />
                          <div className='p-2'>
                            <h2 className='line-clamp-2 text-xl'>{item.name}</h2>
                            <div className='mt-3 flex gap-2'>
                              <p className='text-xl line-through'>{exchangeMenony(item.price_before_discount)}</p>
                              <p className='text-red-500'>{exchangeMenony(item.price)}</p>
                            </div>
                          </div>
                        </li>
                      </Link>
                    )
                  })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
