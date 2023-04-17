import { User } from 'src/types/user.type'

export const localStorageEventTarget = new EventTarget()

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken)
}

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem('refresh_token', refreshToken)
}

export const getAccessToken = () => localStorage.getItem('access_token') || ''
export const getRefreshToken = () => localStorage.getItem('refresh_token') || ''

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  const clearLSSEvent = new Event('clearLS')
  localStorageEventTarget.dispatchEvent(clearLSSEvent)
}

export const setProfileLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

export const getProfileLS = () => {
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(profile) : null
}
