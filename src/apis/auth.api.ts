import { Auth } from 'src/types/auth.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export const authApi = {
  registerAccount: (body: { email: string; password: string }) => {
    return http.post<SuccessResponse<Auth>>('register', body)
  },
  login: (body: { email: string; password: string }) => {
    return http.post<SuccessResponse<Auth>>('login', body)
  },
  logout: () => {
    return http.post('logout')
  }
}
