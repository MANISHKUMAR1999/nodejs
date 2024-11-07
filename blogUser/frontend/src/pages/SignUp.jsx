import { useState } from "react";

export const SignUp = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  async function handleRegister(e) {
    e.preventDefault();
    alert("hello");
   try{
    const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
        method: "POST",
        body: JSON.stringify(userData),
        headers:{
          'Content-Type':'application/json',
        }
      });
  
      const response = await data.json()
      console.log(response)
   }
   catch(error){
console.log(error)
   }
  }
  return (
    <div className=" w-[20%] flex flex-col items-center gap-5">
      <h1 className="text-3xl">Sign In</h1>
      <form
        className=" w-[100%] flex flex-col items-center gap-5"
        onSubmit={handleRegister}
      >
        <input
          type="text"
          className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500"
          placeholder="Enter your Name"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
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
          Register
        </button>
      </form>
    </div>
  );
};
