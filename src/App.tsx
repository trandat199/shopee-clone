import { useContext, useEffect } from 'react'
import useRouterElmemts from './useRouterElmemts'
import { localStorageEventTarget } from './utils/auth'
import { Appcontext } from './contexts/app.context'

function App() {
  const { reset } = useContext(Appcontext)
  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLS', reset)
    return () => localStorageEventTarget.removeEventListener('clearLS', reset)
  }, [reset])

  useEffect(() => {
    window.scrollTo(0, 0)
  })
  const useRouterElmemt = useRouterElmemts()
  return <div className='App'>{useRouterElmemt}</div>
}

export default App
