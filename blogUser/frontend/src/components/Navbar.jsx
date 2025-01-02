
import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import logo from '../../public/logo.svg'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../utils/userSlice';

export const Navbar = () => {
  const { token, name } = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const [showPopup, setShowPopup] = useState(false);


  function handleLogout() {
    dispatch(logout());
    setShowPopup(false);
  }
  return (
    <>
    <div className="bg-white max-w-full flex justify-between items-center relative h-[70px] px-[30px] border-b drop-shadow-sm">
      <div className="flex gap-4 items-center">
        <Link to={"/"}>
          <div className="">
            <img src={logo} alt="" />
          </div>
        </Link>
        <div className="relative">
          <i className="fi fi-rr-search absolute text-lg top-1/2 -translate-y-1/2  ml-4 opacity-40"></i>
          <input
            type="text"
            className="bg-gray-100 focus:outline-none rounded-full pl-12 p-2 "
            placeholder="Search"
          />
        </div>
      </div>

      <div className="flex gap-5 justify-center items-center">
        <Link to={"/add-blog"}>
          <div className=" flex gap-2 items-center">
            <i className="fi fi-rr-edit text-2xl mt-1"></i>
            <span className="text-xl">write</span>
          </div>
        </Link>

        {token ? (
          <div className="h-10 w-10 cursor-pointer" onClick={()=>setShowPopup(prev=>!prev)}>
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${name}`}
            alt=""
            className="rounded-full "
          />
        </div>
        ) : (
          <div className=" flex gap-2">
            <Link to={"/signup"}>
              <button className="bg-blue-500  px-6 py-3 text-white rounded-full">
                Signup
              </button>
            </Link>
            <Link to={"/signin"}>
              <button className="border px-6 py-3 rounded-full">
                Signin
              </button>
            </Link>
          </div>
        )}
      </div>
      {
        showPopup ? (<div className='w-[150px]  bg-gray-200 absolute right-2 rounded-xl top-14 drop-shadow-md'>
          <p className="popup rounded-t-xl">Profile</p>
                <p className="popup">Setting</p>
                <p className="popup rounded-b-xl" onClick={handleLogout}>
                  Logout
                </p>
          </div>):null
      }
    </div>
    <Outlet />
  </>
  )
}
