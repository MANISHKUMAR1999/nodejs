
import React from 'react'
import { Outlet } from 'react-router-dom'

export const Navbar = () => {
  return (
    <>
    <div className='w-full h-full flex flex-col items-center overflow-x-hidden'>

    
    <div className='flex-none w-full bg-gray-700 text-white h-[70px]'>Navbar</div>
    <Outlet/>
    </div>
    </>
  )
}
