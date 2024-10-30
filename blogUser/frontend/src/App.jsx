import { useState,useEffect} from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import { json } from 'express'
import './App.css'

function App() {
  const [userSingUpData, setuserSingUpData] = useState({
    name:"",
    password:"",
    email:""
  })

  const [blogs,setBlogs] = useState([]);


  async function fetchBlogs(){
    const response = await fetch('http://localhost:3000/api/v1/blogs');
    const blogData = await response.json()
    setBlogs(blogData.allBlogs)
  }

  useEffect(()=>{
   fetchBlogs()
  },[])
async function handleSubmit() {
  const response = await fetch('http://localhost:3000/users',{
    method:'POST',
    headers:{
      "CONTENT-TYPE":"application/json"
    },

    body:JSON.stringify(userSingUpData)

  })
  let res = await response.json()
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
    {
      blogs.map(blog=>(
        <ul key={blog.id}>
          <li>{blog.title}</li>
          <li>{blog.description}</li>
        </ul>
      ))
     
    }
    </div>
   
    </>
  )
}

export default App
