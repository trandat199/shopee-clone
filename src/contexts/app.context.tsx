import { createContext, useState } from 'react'
import { User } from 'src/types/user.type'
import { getAccessToken, getProfileLS } from 'src/utils/auth'

interface AppContext {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  reset: () => void
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
}

const intenitValue: AppContext = {
  isAuthenticated: Boolean(getAccessToken()),
  setIsAuthenticated: () => null,
  profile: getProfileLS(),
  setProfile: () => null,
  reset: () => null
}

export const Appcontext = createContext<AppContext>(intenitValue)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(intenitValue.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(intenitValue.profile)

  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
  }

  return (
    <Appcontext.Provider value={{ reset, isAuthenticated, setIsAuthenticated, profile, setProfile }}>
      {children}
    </Appcontext.Provider>
  )
}
