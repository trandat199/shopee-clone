import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import keyBy from 'lodash/keyBy'
import { useEffect, useMemo, useState } from 'react'
import purchaseApi from 'src/apis/purchases.api'
import { purchasesStatus } from 'src/constants/purchases'
import { ExtendedPurchase } from 'src/types/purchases.type'
import { produce } from 'immer'
import { exchangeMenony } from 'src/utils/utils'
import { Link } from 'react-router-dom'

interface Update {
  product_id: string
  buy_count: number
}

const Cart = () => {
  const queryClient = useQueryClient()
  const [listPurchases, setListPurchases] = useState<ExtendedPurchase[]>([])
  const { data: purchasesData, refetch } = useQuery({
    queryKey: ['cart', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })

  const purchaseMutation = useMutation({
    mutationFn: (body: Update) => purchaseApi.updatePurchase(body),
    onSuccess: () => {
      refetch()
    }
  })

  const buyProductsMutation = useMutation({
    mutationFn: (body: Update[]) => purchaseApi.buyProducts(body),
    onSuccess: () => {
      refetch()
    }
  })

  const purchaseDeleteMutation = useMutation({
    mutationFn: (body: string[]) => purchaseApi.deletePurchase(body),
    onSuccess: () => {
      refetch()
    }
  })

  const purchaseAll = useMemo(() => {
    return listPurchases.filter((item) => item.checked)
  }, [listPurchases])

  const isActive = useMemo(() => {
    if (listPurchases.length > 0) {
      return listPurchases.every((item) => item.checked)
    }
    return false
  }, [listPurchases])

  useEffect(() => {
    if (purchasesData) {
      setListPurchases((prev) => {
        const purchaseL = keyBy(prev, '_id')
        return purchasesData.data.data.map((item) => {
          return {
            ...item,
            checked: Boolean(purchaseL[item._id]?.checked),
            disabled: false
          }
        })
      })
    }
  }, [purchasesData])

  const priceAll = useMemo(() => {
    return listPurchases
      .filter((item) => item.checked === true)
      .reduce((acc, item) => {
        const data = acc + item.price * item.buy_count
        return data
      }, 0)
  }, [listPurchases])

  const purchaseQuantity = (index: number, buy_count: number, id: string) => {
    setListPurchases(
      produce((draft) => {
        draft[index].disabled = true
      })
    )
    purchaseMutation.mutate({ product_id: id, buy_count: buy_count })
  }

  const handleCheckAll = () => {
    setListPurchases((prev) => {
      return prev.map((item) => {
        return {
          ...item,
          checked: !isActive
        }
      })
    })
  }

  const handleCheckItem = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setListPurchases(
      produce((draft) => {
        draft[index].checked = e.target.checked
      })
    )
  }

  return (
    <div className='mx-auto py-5 lg:w-[1200px]'>
      {listPurchases.length > 0 ? (
        <div>
          <div className='grid grid-cols-2 bg-gray-200 px-10 py-7'>
            <div className='col-span-1 flex items-center gap-5 text-black'>
              <input
                type='checkbox'
                checked={isActive}
                aria-describedby='helper-checkbox-text'
                className='h-7 w-7 cursor-pointer rounded border-gray-300  bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800'
                onChange={handleCheckAll}
              />
              <p>Sản Phẩm</p>
            </div>
            <div className='col-span-1 hidden lg:block'>
              <div className='grid grid-cols-4 text-center'>
                <p>Đơn Giá</p>
                <p>Số Lượng</p>
                <p>Số Tiền</p>
                <p>Thao Tác</p>
              </div>
            </div>
          </div>
          {listPurchases &&
            listPurchases.map((item, index) => {
              return (
                <div className=' grid items-center px-10 py-5 lg:grid-cols-2' key={item._id}>
                  <div className='col-span-1'>
                    <div className='grid lg:grid-cols-2'>
                      <div className='flex items-center gap-2 lg:gap-7'>
                        <input
                          type='checkbox'
                          checked={item.checked}
                          aria-describedby='helper-checkbox-text'
                          className='h-7 w-7 cursor-pointer rounded border-gray-300  bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800'
                          onChange={handleCheckItem(index)}
                        />
                        <img src={item.product.image} alt={item.product.name} className='w-[50px]' />
                        <p className='line-clamp-2 text-xl'>{item.product.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className='col-span-1 mt-5'>
                    <div className='grid items-center justify-center gap-3 lg:grid-cols-4'>
                      <p className='flex items-center gap-3 text-xl lg:justify-start'>
                        <span className='text-gray-400 line-through'>{exchangeMenony(item.price_before_discount)}</span>
                        <span>{exchangeMenony(item.price)}</span>
                      </p>
                      <div className='flex items-center justify-center'>
                        <button
                          disabled={item.buy_count === 1}
                          className='flex h-[30px] w-14 items-center justify-center border border-y-gray-300 border-l-gray-300 border-r-transparent outline-none'
                          onClick={() => {
                            // eslint-disable-next-line prefer-const
                            let newbuyCount = item.buy_count
                            if (newbuyCount > 1) {
                              newbuyCount -= 1
                            }
                            purchaseQuantity(index, newbuyCount, item.product._id)
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
                          value={item.buy_count}
                          disabled={item.disabled}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            purchaseQuantity(index, Number(e.target.value), item.product._id)
                          }}
                          className=' h-[30px] w-16 border border-gray-300 text-center outline-none'
                        />
                        <button
                          className='flex h-[30px] w-14 items-center justify-center border border-y-gray-300 border-l-transparent border-r-gray-300 outline-none'
                          onClick={() => {
                            // eslint-disable-next-line prefer-const
                            let newbuyCount = item.buy_count
                            if (newbuyCount < item.product.quantity) {
                              newbuyCount += 1
                            }
                            purchaseQuantity(index, newbuyCount, item.product._id)
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
                      <p className='text-center text-red-500'>{exchangeMenony(item.price * item.buy_count)}</p>
                      <button
                        onClick={() => {
                          purchaseDeleteMutation.mutate([item._id])
                        }}
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          <div className='sticky bottom-0 z-10 mt-8 flex h-[100px] justify-between rounded-sm border border-gray-100 bg-white px-2 shadow sm:flex-row sm:items-center lg:p-5 lg:px-10'>
            <div className='flex items-center gap-2 lg:gap-7'>
              <input type='checkbox' checked={isActive} onChange={handleCheckAll} className='h-7 w-7 cursor-pointer' />
              <p className='truncate whitespace-nowrap text-xl'>Xóa tất cả ({listPurchases.length})</p>
              <button
                onClick={() => {
                  const data = listPurchases
                    .filter((item) => item.checked == true)
                    .map((item) => {
                      return item._id
                    })
                  if (data.length > 0) {
                    purchaseDeleteMutation.mutate(data)
                  }
                }}
                className='text-xl'
              >
                Xóa
              </button>
            </div>
            <div className='flex items-center gap-2 pl-4 lg:gap-5'>
              <p className='text-2xl'>
                Tổng thanh toán ({purchaseAll.length} Sản phẩm):{' '}
                <span className='text-3xl text-red-500'>{exchangeMenony(priceAll)}</span>
              </p>
              <button
                className='whitespace-nowrap bg-red-500 px-5 py-4 text-xl text-white'
                onClick={() => {
                  const data = listPurchases.filter((item) => item.checked == true)
                  const newData = data.map((item) => {
                    return { product_id: item.product._id, buy_count: item.buy_count }
                  })
                  if (data.length > 0) {
                    buyProductsMutation.mutate(newData, {
                      onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
                      }
                    })
                  }
                }}
              >
                Mua Hàng
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center '>
          <img src='https://drive.gianhangvn.com/image/empty-cart.jpg' alt='' className='w-[500px]' />
          <Link to='/' className='mt-5 rounded-sm bg-red-500 px-10 py-5 text-white shadow-md'>
            Mua Hàng
          </Link>
        </div>
      )}
    </div>
  )
}

export default Cart
