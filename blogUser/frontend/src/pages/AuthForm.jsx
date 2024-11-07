/* eslint-disable react/prop-types */

import { useState } from "react";
import toast from "react-hot-toast";
import axios from 'axios'
import {Link} from 'react-router-dom'

   function AuthForm({type}){
    console.log(type)
    const [userData, setUserData] = useState({
      name: "",
      email: "",
      password: "",
    });
    async function handleAuthForm(e) {
      e.preventDefault();
      console.log(userData)
      alert("hello");
     try{
      // const data = await fetch(`http://localhost:3000/api/v1/${type}`, {
      //     method: "POST",
      //     body: JSON.stringify(userData),
      //     headers:{
      //       'Content-Type':'application/json',
      //     }
      //   });
    
      //   const response = await data.json()
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/${type}`,userData
      )
      localStorage.setItem('user',JSON.stringify(res.data.user));
      localStorage.setItem('token',JSON.stringify(res.data.token))
      toast.success(res.data.message)
      console.log(res.data.message)
     }
     catch(error){
      toast.error(error.response.data.message)
  console.log(error.response.data.message)//error.response.data.message
     }
    }
    return (
      <div className=" w-[20%] flex flex-col items-center gap-5 mt-32">
        <h1 className="text-3xl">{type == 'signin' ?'Sign In Page' : 'Sign Up Page'}</h1>
        <form
          className=" w-[100%] flex flex-col items-center gap-5"
          onSubmit={handleAuthForm}
        >
         { type =='signup'? <input
            type="text"
            className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500"
            placeholder="Enter your Name"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          /> : ''
   }
          <input
            type="email"
            className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500"
            placeholder="Enter your email"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <input
            type="password"
            className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500"
            placeholder="Enter your password"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
  
          <button className="w-[100px] h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500">
            {type =='signin' ? 'Login' : 'Register'}
          </button>
        </form>
        { type == "signin"  ?  <p>Don't have an account <Link to={"/signup"}>Sign up</Link></p> : <p>Already have an account <Link to={"/signin"}>Sign in</Link></p> }
      </div>
    );
  }
  
  export default AuthForm