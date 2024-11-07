

export const Signin = () => {
  return (
    <div className=" w-[20%] flex flex-col items-center gap-5 mt-32">
        <h1 className="text-3xl">Sign In</h1>
      <input type="email" className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500" placeholder="Enter your email"/>
      <input type="password" className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500" placeholder="Enter your password" />
      <button className="w-[100px] h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500" >Log In</button>
    </div>
  )
}
