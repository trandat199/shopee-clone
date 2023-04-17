import { User } from './user.type'
import { SuccessResponse } from './utils.type'

export interface Auth {
  access_token: string
  refresh_token: string
  expires: string
  user: User
}

export type RefreshTokenReponse = SuccessResponse<{ access_token: string }>
