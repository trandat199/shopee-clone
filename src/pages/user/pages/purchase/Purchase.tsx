import { useQuery } from '@tanstack/react-query'
import { Link, createSearchParams, useSearchParams } from 'react-router-dom'
import purchaseApi from 'src/apis/purchases.api'
import { purchasesStatus } from 'src/constants/purchases'
import { PurchaseListStatus } from 'src/types/purchases.type'
import { exchangeMenony, generateNameId } from 'src/utils/utils'

const option = [
  {
    name: 'Tất cả',
    status: purchasesStatus.all
  },
  {
    name: 'Chờ thanh toán',
    status: purchasesStatus.waitForConfirmation
  },
  {
    name: 'Vận chuyển',
    status: purchasesStatus.waitForGetting
  },
  {
    name: 'Đang giao',
    status: purchasesStatus.inProgress
  },
  {
    name: 'Hoàn thành',
    status: purchasesStatus.delivered
  },
  {
    name: 'Đã hủy',
    status: purchasesStatus.cancelled
  }
]
const Purchase = () => {
  const [QueryParams] = useSearchParams()
  const PurchaseQueryParam: { status?: string } = Object.fromEntries([...QueryParams])
  const PurchaseQuery: number = Number(PurchaseQueryParam.status) || purchasesStatus.all
  const { data: purchaseList } = useQuery({
    queryKey: ['purchase', { status: PurchaseQuery }],
    queryFn: () => purchaseApi.getPurchases({ status: PurchaseQuery as PurchaseListStatus })
  })

  return (
    <div className='min-h-screen'>
      <nav>
        <ul className='grid grid-cols-6 bg-white text-center'>
          {option.map((option, index) => {
            const isActive = PurchaseQuery === option.status
            return (
              <li key={index}>
                <Link
                  className={`${isActive ? 'border-b-2 border-red-500' : null} block w-full py-6 text-sm lg:text-xl`}
                  to={{
                    pathname: '/user/purchase',
                    search: createSearchParams({
                      status: option.status.toString()
                    }).toString()
                  }}
                >
                  {option.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className='mt-5 flex flex-col gap-5'>
        {purchaseList &&
          purchaseList?.data.data.map((item) => {
            return (
              <div key={item._id} className='bg-white p-5'>
                <div className='flex items-center justify-between'>
                  <div className='flex gap-5'>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className='h-[100px] w-[100px] object-cover'
                    />
                    <div>
                      <h2 className='text-xl'>{item.product.name}</h2>
                      <span className='text-xl'>x{item.buy_count}</span>
                    </div>
                  </div>
                  <p className='text-xl'>{exchangeMenony(item.price)}</p>
                </div>
                <p className='flex items-center justify-end gap-3 text-xl'>
                  Thành tiền:{' '}
                  <span className='text-4xl text-red-500'>{exchangeMenony(item.price * item.buy_count)}</span>{' '}
                </p>
                <div className='mt-5 flex justify-end'>
                  <Link
                    to={`/${generateNameId({ name: item.product.name, id: item.product._id })}`}
                    className='rounded-mdtext-xl bg-red-500 px-14  py-3 text-white shadow-md'
                  >
                    Mua lại
                  </Link>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Purchase
