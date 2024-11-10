import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'
//import {jwt} from 'jsonwebtoken'

export const BlogPage = () => {
  const user =  JSON.parse(localStorage.getItem("user"));
  const token =  JSON.parse(localStorage.getItem("tokn"));
 
    const [blogData,setBlogData] = useState({})
    const {id} = useParams()
    console.log(id)
    async function fetchBlogById(){
    try{
       
            let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`)
            console.log(res)
            setBlogData(res.data.blog)
        }
    
   catch(error){
    console.log(error)
toast.error(error.message)
   }
}
useEffect(()=>{
    fetchBlogById()
},[id])

  return (
    <div>

    
    {
        blogData ? <div className='max-w-[1000px]'> 
            <h1 className='mt-10 font-bold text-6xl'>{blogData.title}</h1>
            <h2 className='my-5 text-3xl'>{blogData.creator && blogData.creator.name}</h2>
            <img src={blogData.image} alt="" srcset="" />
            {
              blogData.creator&& user.email === blogData.creator.email && (
                <button className='bg-green-400 mt-5 px-6 py-2 rounded-xl'>
                <Link to={"/edit/" + blogData.blogId} >
                Edit
                </Link>
                </button>
              )
            }
           
             </div> : <h1>Loading........</h1>
    }
    </div>
  )
}
