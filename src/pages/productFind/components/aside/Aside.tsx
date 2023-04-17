import { useQuery } from '@tanstack/react-query'
import { CategoriesApi } from 'src/apis/categories'
import { ProductQueryParam } from '../../ProductFind'
import { Link, createSearchParams } from 'react-router-dom'
import omit from 'lodash/omit'
interface Props {
  dataQueryParam: ProductQueryParam
}
const Aside = ({ dataQueryParam }: Props) => {
  const { data: categorys } = useQuery({
    queryKey: ['category'],
    queryFn: () => CategoriesApi.getcategories()
  })

  const category = categorys?.data.data

  return (
    <div className='w-full'>
      <h1 className='flex gap-4 font-semibold uppercase'>
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
            d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z'
          />
        </svg>
        Bộ lọc tìm kiếm
      </h1>
      <h2 className='mt-9 text-2xl font-light'>Theo Danh Mục</h2>
      <ul className='mt-4'>
        {category &&
          category.map((category) => {
            const isActive = dataQueryParam.category === category._id
            return (
              <li
                key={category._id}
                className={`my-3 cursor-pointer text-xl ${isActive ? 'text-red-500' : 'text-black'}`}
              >
                <Link
                  to={{
                    pathname: '/productFind',
                    search: createSearchParams(
                      omit(
                        {
                          ...dataQueryParam,
                          page: '1',
                          category: category._id
                        },
                        ['name']
                      )
                    ).toString()
                  }}
                >
                  {category.name}
                </Link>
              </li>
            )
          })}
      </ul>
      <Link
        to={{
          pathname: '/productFind',
          search: createSearchParams({
            page: '1',
            limit: '15',
            sort_by: 'createdAt'
          }).toString()
        }}
      >
        <button className='mt-4 w-full bg-red-500 py-5 text-white'>Xoá tất cả</button>
      </Link>
    </div>
  )
}

export default Aside
