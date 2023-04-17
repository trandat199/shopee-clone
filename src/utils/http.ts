import axios, { AxiosError, AxiosInstance } from 'axios'
import { clearLS, getAccessToken, getRefreshToken, setAccessToken, setProfileLS, setRefreshToken } from './auth'
import { SuccessResponse } from 'src/types/utils.type'
import { Auth, RefreshTokenReponse } from 'src/types/auth.type'
import { HttpStatusCode } from 'src/constants/HttpStatusCode'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.refreshTokenRequest = null
    this.accessToken = getAccessToken()
    this.refreshToken = getRefreshToken()
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 60 * 24, // 1 ngày
        'expire-refresh-token': 60 * 60 * 24 * 160 // 160 ngày
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        // Do something before request is sent
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
        }
        return config
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error)
      }
    )

    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        const { url } = response.config
        if (url === 'login') {
          const data = response.data as SuccessResponse<Auth>
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          setAccessToken(this.accessToken)
          setRefreshToken(this.refreshToken)
          setProfileLS(data.data.user)
        } else if (url === 'logout') {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      function (error: AxiosError) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          clearLS()
        }
        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenReponse>('refresh-access-token', {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        setAccessToken(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}
const http = new Http().instance

export default http
