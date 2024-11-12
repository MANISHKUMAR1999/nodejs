import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export const AddBlog = () => {
  const {token} = useSelector((slice)=>slice.user)
  const {title,description,image} = useSelector((slice)=>slice.selectedBlog)

  const {id} = useParams()
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      return navigate("/signin");
    }
  }, []);

  async function handleUpdateBlog(){
    try {
      console.log("blog data for update",blogData)
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`,
        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }


  async function handlePostBlog() {
    console.log(blogData);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs`,
        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function fetchBlogById(){
    try{
       
            // let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`)
            // console.log(res)
            setBlogData({
              title:title,
              description:description,
              image:image
            })
        }
    
   catch(error){
    console.log(error)
toast.error(error.response.data.message)
   }
}
useEffect(()=>{
   // fetchBlogById()
   if(id){
    fetchBlogById()
   }
},[id])
  return <>
    
  {
     (  <div className="w-[500px] mx-auto">
      <label htmlFor="">Title</label>
      <input
        type="text"
        name="title"
        id=""
        placeholder="Enter the title"
        onChange={(e) =>
          setBlogData((prev) => ({ ...prev, title: e.target.value }))
        }
        value={blogData.title}
      />
      <br></br>
      <label htmlFor="">Description</label>
      <input
        type="text"
        name="description"
        id=""
        placeholder="Enter the description"
        onChange={(e) =>
          setBlogData((prev) => ({ ...prev, description: e.target.value }))
        }
        value={blogData.description}
      />
      <br></br>
      <div>
        <label htmlFor="image">
          {blogData.image  ? (
            <img
              src={ typeof blogData.image == "string" ? blogData.image : URL.createObjectURL(blogData.image)}
              alt=""
              className="aspect-video object-cover"

            />
          ) : (
            <div className=" bg-slate-500 aspect-video flex justify-center items-center text-4xl">
              Select Image
            </div>
          )}
        </label>
        <input
          className="hidden"
          type="file"
          accept=".jpeg, .png, .jpg"
          name="description"
          id="image"
          placeholder="upload your image"
          onChange={(e) =>
            setBlogData((prev) => ({ ...prev, image: e.target.files[0] }))
          }
        />
      </div>
      <br></br>
      <button onClick={id ? handleUpdateBlog: handlePostBlog}>{id ? "update blog" : "Post blog"}</button>
    </div>) 
  }
  </>
    // token == null ?<Navigate to="/signin"/> : <div>Add blog</div>
  
};
