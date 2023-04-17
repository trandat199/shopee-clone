import React from 'react'
import Footer from 'src/components/footer/Footer'
import RegisterHeader from 'src/components/registerHeader/RegisterHeader'

interface Props {
  children: React.ReactNode
}
const RegisterLayout = ({ children }: Props) => {
  return (
    <div>
      <RegisterHeader></RegisterHeader>
      {children}
      <Footer></Footer>
    </div>
  )
}

export default RegisterLayout
