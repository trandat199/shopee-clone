import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.css'
// eslint-disable-next-line import/no-unresolved
import 'swiper/css/navigation'

import { Autoplay, Pagination, Navigation } from 'swiper'
import { useQuery } from '@tanstack/react-query'
import { productApi } from 'src/apis/product.api'
import { useSearchParams } from 'react-router-dom'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import { ProductQueryParam } from '../productFind/ProductFind'
import { ProductQueryParams } from 'src/types/product.type'
import ProductList from '../productFind/components/productList/ProductList'
const ProductHome = () => {
  const [QueryParams] = useSearchParams()
  const QueryParam = Object.fromEntries([...QueryParams])
  const dataQueryParam: ProductQueryParam = omitBy(
    {
      page: QueryParam.page || 1,
      limit: QueryParam.limit || 15,
      order: QueryParam.order,
      sort_by: QueryParam.sort_by || 'createdAt',
      category: QueryParam.category,
      exclude: QueryParam.exclude,
      rating_filter: QueryParam.rating_filter,
      price_max: QueryParam.price_max,
      price_min: QueryParam.price_min,
      name: QueryParam.name
    },
    isUndefined
  )

  const { data: product } = useQuery({
    queryKey: ['product', dataQueryParam],
    queryFn: () => productApi.getProduct(dataQueryParam as ProductQueryParams),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })
  console.log(product)
  useEffect(() => {
    const Time = setInterval(() => {
      const hours: HTMLElement = document.getElementById('hours') as HTMLElement
      const minutes: HTMLElement = document.getElementById('minutes') as HTMLElement
      const seconds: HTMLElement = document.getElementById('seconds') as HTMLElement
      let hoursTime = 2
      if (new Date().getHours() % 2 === 0) {
        hoursTime = 2
      } else {
        hoursTime = 1
      }
      const extraTime = new Date().getHours() + hoursTime
      const presentTime = new Date().setHours(extraTime, 0, 0)
      const countDownDate = new Date(presentTime).getTime()

      const now = new Date().getTime()
      const distance = countDownDate - now
      const hour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString()
      const minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString()
      const second = Math.floor((distance % (1000 * 60)) / 1000).toString()
      hours.innerHTML = '0' + hour
      minutes.innerHTML = Number(minute) < 10 ? '0' + minute : minute
      seconds.innerHTML = Number(second) < 10 ? '0' + second : second
    }, 1000)

    return () => {
      clearInterval(Time)
    }
  }, [])

  const productList = product?.data.data

  return (
    <div className='bg-[#e6e6e677]'>
      <div className='mx-auto py-5 lg:w-[1200px]'>
        <div className='grid grid-cols-3 gap-2 lg:h-[235px]'>
          <div className='z-1 col-span-2'>
            <Swiper
              centeredSlides={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false
              }}
              pagination={{
                clickable: true
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className='mySwiper z-0'
            >
              <SwiperSlide>
                <img
                  src='https://cf.shopee.vn/file/vn-50009109-02787875361d9135e404351a82ba1613_xxhdpi'
                  alt=''
                  className='h-full w-full object-cover'
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src='https://cf.shopee.vn/file/vn-50009109-a7cb35117f58b4926d05c1bc89da01dc_xxhdpi'
                  alt=''
                  className='h-full w-full object-cover'
                />
              </SwiperSlide>
            </Swiper>
          </div>
          <div className='col-span-1 flex flex-col gap-2'>
            <img src='https://cf.shopee.vn/file/vn-50009109-5a201408909a0be439a3d963f39f46b7_xhdpi' alt='' />
            <img src='https://cf.shopee.vn/file/vn-50009109-5cbd9ef5af9a1b9d8e6486e751cff063_xhdpi' alt='' />
          </div>
        </div>
        <div className='mt-10'>
          <div className='flex items-center justify-between p-4'>
            <div className='flex items-center gap-5'>
              <img
                src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/fb1088de81e42c4e538967ec12cb5caa.png'
                alt=''
                className='h-[20px] lg:h-[30px]'
              />
              <div className='relative -top-1 flex items-center gap-2 text-xl'>
                <p id='hours' className='bg-black px-2 py-1 text-white'></p>
                <p id='minutes' className='bg-black px-2 py-1 text-white'></p>
                <p id='seconds' className='bg-black px-2 py-1 text-white'></p>
              </div>
            </div>
            <p className='cursor-pointer text-xl text-red-500'>Xem Tất Cả</p>
          </div>
          <div className='h-[150px] lg:h-[200px]'>
            <Swiper
              slidesPerView={4}
              spaceBetween={10}
              pagination={{
                clickable: true
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className='mySwiper z-0 '
            >
              <SwiperSlide>
                <img src='https://down-vn.img.susercontent.com/file/sg-11134201-22110-hqyraeo36wjv07_tn' alt='' />
              </SwiperSlide>
              <SwiperSlide>
                <img src='https://down-vn.img.susercontent.com/file/vn-11134201-23030-z6at40fcdlov38_tn' alt='' />
              </SwiperSlide>
              <SwiperSlide>
                <img src='https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lfe9urj8ucucdc_tn' alt='' />
              </SwiperSlide>
              <SwiperSlide>
                <img src='https://down-vn.img.susercontent.com/file/vn-11134201-23030-z9atrs3gmwovb2_tn' alt='' />
              </SwiperSlide>
              <SwiperSlide>
                <img src='https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lfh5jx32fgqd05_tn' alt='' />
              </SwiperSlide>
              <SwiperSlide>
                <img src='https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lfe9x95vokg4dc_tn' alt='' />
              </SwiperSlide>
            </Swiper>
          </div>
          {productList && <ProductList dataQueryParam={dataQueryParam} productList={productList}></ProductList>}
        </div>
      </div>
    </div>
  )
}

export default ProductHome
