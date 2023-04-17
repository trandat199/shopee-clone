import { useQuery } from '@tanstack/react-query'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import { useSearchParams } from 'react-router-dom'
import { productApi } from 'src/apis/product.api'
import { ProductQueryParams } from 'src/types/product.type'
import Aside from './components/aside/Aside'
import ProductOption from './components/productOption/ProductOption'
import ProductList from './components/productList/ProductList'
export type ProductQueryParam = {
  [key in keyof ProductQueryParams]: string
}
const ProductFind = () => {
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

  const { data: products } = useQuery({
    queryKey: ['products', dataQueryParam],
    queryFn: () => productApi.getProduct(dataQueryParam as ProductQueryParams),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const productList = products?.data.data

  return (
    <div className='mx-auto py-10 lg:w-[1200px]'>
      <div className='grid grid-cols-12 gap-3'>
        <div className='col-span-2 hidden lg:block'>
          <Aside dataQueryParam={dataQueryParam}></Aside>
        </div>
        <div className='col-span-12 lg:col-span-10'>
          <ProductOption dataQueryParam={dataQueryParam} productList={productList}></ProductOption>
          {productList && <ProductList dataQueryParam={dataQueryParam} productList={productList}></ProductList>}
        </div>
      </div>
    </div>
  )
}

export default ProductFind
