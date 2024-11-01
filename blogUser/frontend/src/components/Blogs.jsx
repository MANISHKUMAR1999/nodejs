import { useEffect, useState } from "react";

const Blogs = () => {
       
    const [blogs,setBlogs] = useState([]);
    //
    
    async function fetchBlogs(){
      const response = await fetch('http://localhost:3000/api/v1/blogs');
      const blogData = await response.json()
      setBlogs(blogData.allBlogs)
    }
  
    useEffect(()=>{
     fetchBlogs()
    },[])
  return (
    <>
    { blogs && 
      blogs.map(blog=>(
        <ul key={blog._id}>
          <li>{blog.title}</li>
          <li>{blog.description}</li>
        </ul>
      ))
     
    }
    </>
  )
}

export default Blogs