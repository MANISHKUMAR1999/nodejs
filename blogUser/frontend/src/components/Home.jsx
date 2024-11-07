import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const Home = () => {
    const [blogs,setBlogs] = useState([])

    async function fetchBlogs(){
     // import.meta.env.VITE_BACKEND_URL
        let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`)
        console.log(res.data.allBlogs,"res")
        setBlogs(res.data.allBlogs)
    }
    useEffect(()=>{
fetchBlogs()
    },[])


  return (
    <div className='w-[60%]'>
      {blogs&&
        blogs.map((blog)=>(
<Link to={"blog/" + blog.blogId} key={blog._id}>
            <div className='my-10 flex justify-between' key={blog._id}>
            <div className='w-[60%] flex flex-col gap-2'>
              <div>
                <img src="" alt="" />
                <p>{blog.creator ? blog.creator.name :'Manish'}</p>
              </div>
                <h2 className='font-bold text-3xl'>{blog.title}</h2>
                <h4 className='line-clamp-2'>{blog.description}</h4>
                <div className='flex gap-5'>
                    <p>{blog.createdAt}</p>
                    <p>500</p>
                    <p>200</p>
                </div>
            </div>
            <div className='w-[25%]'>
                <img src={blog.image} alt="" />
            </div>
        </div>
        </Link>
        ))
      }
    </div>
  )
}
