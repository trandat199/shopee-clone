import { Product, ProductQueryParams, Products } from 'src/types/product.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export const productApi = {
  getProduct: (params: ProductQueryParams) => {
    return http.get<SuccessResponse<Products>>('products', { params })
  },
  getProductDetails: (id: string) => {
    return http.get<SuccessResponse<Product>>(`products/${id}`)
  }
}
