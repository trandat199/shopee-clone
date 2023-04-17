import { Categories } from 'src/types/categories.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export const CategoriesApi = {
  getcategories: () => {
    return http.get<SuccessResponse<Categories[]>>('categories')
  }
}
