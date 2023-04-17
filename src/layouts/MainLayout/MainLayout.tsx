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
      {children}
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
