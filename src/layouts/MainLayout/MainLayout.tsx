import React from 'react'
import Footer from 'src/components/footer/Footer'
import Header from 'src/components/header/Header'

interface props {
  children: React.ReactNode
}
const MainLayout = ({ children }: props) => {
  return (
    <div>
      <Header></Header>
      <div className='mt-[80px] lg:mt-0'>{children}</div>
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
