import React from 'react'

const Footer = () => {
  return (
    <div className='mx-auto w-full bg-white py-10 lg:w-[1200px]'>
      <div className='grid grid-cols-1 gap-3 lg:grid-cols-3'>
        <span className='text-center text-xl lg:text-start'>© 2023 Shopee. Tất cả các quyền được bảo lưu.</span>
        <ul className='flex items-center justify-center gap-2 text-lg lg:col-span-2 lg:justify-start lg:gap-5 lg:text-xl'>
          <li>Quốc gia & Khu vực:</li>
          <li>Singapore</li>
          <li>Indonesia</li>
          <li>Đài Loan</li>
          <li>Thái Lan</li>
          <li>Malaysia</li>
        </ul>
      </div>
      <div className='mt-10 flex flex-col gap-5 text-center text-xl'>
        <p>
          Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành phố
          Hà Nội, Việt Nam. Tổng đài hỗ trợ: 19001221 - Email: cskh@hotro.shopee.vn
        </p>
        <p>Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Đức Trí - Điện thoại liên hệ: 024 73081221 (ext 4678)</p>
        <p>Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch & Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/2015</p>
        <p>© 2015 - Bản quyền thuộc về Công ty TNHH Shopee</p>
      </div>
    </div>
  )
}

export default Footer
