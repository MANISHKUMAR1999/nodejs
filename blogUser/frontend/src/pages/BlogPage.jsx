import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

export const BlogPage = () => {
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
             </div> : <h1>Loading........</h1>
    }
    </div>
  )
}
