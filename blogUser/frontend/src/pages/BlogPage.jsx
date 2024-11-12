import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { addSlectedBlog,removeSelectedBlog } from '../utils/selectedBlogSlice'
//import {jwt} from 'jsonwebtoken'

export const BlogPage = () => {
  // const user =  JSON.parse(localStorage.getItem("user"));
  // const token =  JSON.parse(localStorage.getItem("tokn"));

  const {email,token,name,id:userId} = useSelector((slice)=>slice.user)
  
  //const {likes} = useSelector((slice)=>slice.selectedBlog)
  //console.log(likes,"likes")
  const dispatch = useDispatch()
  const location = useLocation();
  //console.log("token",token)
 
    const [blogData,setBlogData] = useState({})
    const [isLike,setIsLike] = useState(false)
    const {id} = useParams()
    console.log(id)
    async function fetchBlogById(){
      try {
        let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`)
        console.log(res,"res from blog page")
        setBlogData(res.data.blog)
        dispatch(addSlectedBlog(res.data.blog))
  
        if (res.data.blog.likes.includes(userId)) {
          setIsLike((prev) => !prev);
        }
  
      } catch (error) {
        toast.error(error);
      }
}

async function handleLike(){
  if (token) {
    setIsLike((prev) => !prev);

    let res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogData._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(userId,"user id from store")
    dispatch(changeLikes(userId));
    toast.success(res.data.message);
  } else {
    return toast.error("Please signin for like this blog");
  }
}


useEffect(()=>{
    fetchBlogById()
    return () => {
      //   console.log(window.location.pathname); // currnt path
      //   console.log(location.pathname); //previous path
      //dispatch(setIsOpen(false));
      if (window.location.pathname !== `/edit/${id}`&& window.location.pathname !== `/blog/${id}`) {
        dispatch(removeSelectedBlog());
      }
    };
},[id])

  return (
    <div className='max-w-[700px] mx-auto'>

    
    {
        blogData ? <div > 
            <h1 className='mt-10 font-bold text-6xl capitalize'>{blogData.title}</h1>
            <h2 className='my-5 text-3xl'>{blogData.creator && blogData.creator.name}</h2>
            <img src={blogData.image} alt="" srcset="" />
            {
              blogData.creator&& email === blogData.creator.email && (
                <button className='bg-green-400 mt-5 px-6 py-2 rounded-xl'>
                <Link to={"/edit/" + blogData.blogId} >
                Edit
                </Link>
                </button>
              )
            }


            <div className='flex gap-4 mt-4'>

            <div onClick={handleLike} className='cursor-pointer flex gap-2'>
              {
                isLike ? ( <i class="fi fi-sr-thumbs-up text-blue-600 text-3xl"></i>) : (  <i className="fi fi-rr-social-network text-3xl"></i>)
                
              }
             {
              blogData.likes && <p className='text-2xl'>{blogData.likes.length}</p>
             } 
            
           
           
          
              </div>
              <div className='flex gap-2'>
              <i class="fi fi-sr-comment-alt text-3xl"></i>
             {  <p className='text-2xl'>hello</p>}
                </div>
             
            </div>

           
             </div> : <h1>Loading........</h1>
    }
    </div>
  )
}
