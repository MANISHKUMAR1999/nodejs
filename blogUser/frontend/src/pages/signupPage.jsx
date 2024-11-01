//import React from 'react';
import { useState} from 'react'
function SignupPage() {
    const [userSingUpData, setuserSingUpData] = useState({
        name:"",
        password:"",
        email:""
      })
 
    async function handleSubmit() {
      const response = await fetch('http://localhost:3000/api/v1/users',{
        method:'POST',
        headers:{
          "CONTENT-TYPE":"application/json"
        },
    
        body:JSON.stringify(userSingUpData)
    
      })
      let res = await response.json()
      if(res.sucess){
        localStorage.setItem('user',JSON.stringify(res.User))
      }
      
      alert(res.message)
      
    }
  return (
    <>
    <div>
    <h1>Sign Up</h1>
    <input type="text" onChange={(e)=>setuserSingUpData((prev)=>({...prev,name:e.target.value}))} name="name" id="name" placeholder='' />
    <br></br>
    <input type="email" name="email" onChange={(e)=>setuserSingUpData((prev)=>({...prev,email:e.target.value}))} id="" placeholder='email' />
    <br></br>
    <input type="password" name="password" id="" onChange={(e)=>setuserSingUpData((prev)=>({...prev,password:e.target.value}))} placeholder='password' />
    <br></br>
    <button type="submit" onClick={handleSubmit}>Submit</button>
    
    </div>
   
    </>
  )
}

export default SignupPage