import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from "@editorjs/list";
import NestedList from "@editorjs/nested-list";
import CodeTool from '@editorjs/code';
import Marker from '@editorjs/marker';
import Underline from "@editorjs/underline";
import Embed from "@editorjs/embed";
import RawTool from "@editorjs/raw";
import TextVariantTune from "@editorjs/text-variant-tune";
import ImageTool from '@editorjs/image';

export const AddBlog = () => {
  const {token} = useSelector((slice)=>slice.user)
  const {title,description,image,content} = useSelector((slice)=>slice.selectedBlog)

  const {id} = useParams()
  const editorjsRef = useRef(null);
  const formData = new FormData();
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
    content:""
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      return navigate("/signin");
    }
  }, []);

  async function handleUpdateBlog(){
    console.log(blogData)
    let formData = new FormData();

    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    formData.append("image", blogData.image);

    formData.append("content", JSON.stringify(blogData.content));

    let existingImages = [];

    blogData.content.blocks.forEach((block) => {
      if (block.type === "image") {
        if (block.data.file.image) {
          formData.append("images", block.data.file.image);
        } else {
          existingImages.push({
            url: block.data.file.url,
            imageId: block.data.file.imageId,
          });
        }
      }
    });

    // for (let data of formData.entries()) {
    //   console.log(data);
    // }

    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      const res = await axios.patch(
        "http://localhost:3000/api/v1/blogs/" + id,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    // try {
    //   console.log("blog data for update",blogData)
    //   const res = await axios.patch(
    //     `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`,
    //     blogData,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    //   console.log(res);
    //   toast.success(res.data.message);
    //   navigate("/");
    // } catch (error) {
    //   toast.error(error.response.data.message);
    // }
  }


  async function handlePostBlog() {
    console.log(blogData);
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    formData.append("image", blogData.image);
    formData.append("content", JSON.stringify(blogData.content));
    blogData.content.blocks.forEach((block) => {
      if (block.type === "image") {
        formData.append("images", block.data.file.image);
      }
    });
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs`,
        formData,
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
              image:image,
              content:content
            })
        }
    
   catch(error){
    console.log(error)
toast.error(error.response.data.message)
   }
}
function intializeEditor(){
  editorjsRef.current = new EditorJS({
  holder:'editorjs',
  placeholder:'write something......',
  data:content,
  tools:{
    header:{
      class:Header,
      inlineToolbar:true,
      config:{
        placeholder:"Enter a header",
        levels:[2,3,4],
        defaultlevel:3
      }
    },
    List: {
      class: NestedList,
      config: {},
      inlineToolbar: true,
    },
    code: CodeTool,
    Marker: Marker,
    Underline: Underline,
    Embed: Embed,
    RawTool:RawTool,
    image:{
      class:ImageTool,
      config:{
        uploader:{
          uploadByFile:async(image)=>{
            return {
              success: 1,
              file: {
                url: URL.createObjectURL(image),
                image
                // any other image data you want to store, such as width, height, color, extension, etc
              }
            };

          },

        }
      }
    },
    textVariant: TextVariantTune,
  },
  tunes: ["textVariant"],
  onChange:async()=>{
    const data = await editorjsRef.current.save()
    setBlogData((blogData)=>({...blogData,content:data}))
    console.log(data,"editor js")

  }
})
}


useEffect(()=>{
   // fetchBlogById()
   if(id){
    fetchBlogById()
   }
},[id])

useEffect(()=>{
  if (editorjsRef.current === null) {
    intializeEditor();
  }
  return () => {
    //   console.log(window.location.pathname); // currnt path
    //   console.log(location.pathname); //previous path
    editorjsRef.current = null;
    dispatch(setIsOpen(false));
    if (
      window.location.pathname !== `/edit/${id}` &&
      window.location.pathname !== `/blog/${id}`
    ) {
      dispatch(removeSelectedBlog());
    }
  };
},[])



  // return <>
    
  // {
  //    (  <div className="w-[500px] mx-auto">
  //     <label htmlFor="">Title</label>
  //     <input
  //       type="text"
  //       name="title"
  //       id=""
  //       placeholder="Enter the title"
  //       onChange={(e) =>
  //         setBlogData((prev) => ({ ...prev, title: e.target.value }))
  //       }
  //       value={blogData.title}
  //     />
  //     <br></br>
  //     <label htmlFor="">Description</label>
  //     <input
  //       type="text"
  //       name="description"
  //       id=""
  //       placeholder="Enter the description"
  //       onChange={(e) =>
  //         setBlogData((prev) => ({ ...prev, description: e.target.value }))
  //       }
  //       value={blogData.description}
  //     />
  //     <br></br>
  //     <div>
  //       <label htmlFor="image">
  //         {blogData.image  ? (
  //           <img
  //             src={ typeof blogData.image == "string" ? blogData.image : URL.createObjectURL(blogData.image)}
  //             alt=""
  //             className="aspect-video object-cover"

  //           />
  //         ) : (
  //           <div className=" bg-slate-500 aspect-video flex justify-center items-center text-4xl">
  //             Select Image
  //           </div>
  //         )}
  //       </label>
  //       <input
  //         className="hidden"
  //         type="file"
  //         accept=".jpeg, .png, .jpg"
  //         name="description"
  //         id="image"
  //         placeholder="upload your image"
  //         onChange={(e) =>
  //           setBlogData((prev) => ({ ...prev, image: e.target.files[0] }))
  //         }
  //       />
  //     </div>
  //     <br></br>
  //     <div id="editorjs"></div>
  //     <button onClick={id ? handleUpdateBlog: handlePostBlog}>{id ? "update blog" : "Post blog"}</button>
  //   </div>) 
  // }
  // </>
    // token == null ?<Navigate to="/signin"/> : <div>Add blog</div>
  

    return token == null ? (
      <Navigate to={"/signin"} />
    ) : (
      <div className="w-[500px] mx-auto">
        <div className="my-4">
          <h2 className="text-2xl font-semibold my-2">Title</h2>
          <input
            type="text"
            placeholder="title"
            onChange={(e) =>
              setBlogData((blogData) => ({
                ...blogData,
                title: e.target.value,
              }))
            }
            value={blogData.title}
            className="border focus:outline-none rounded-lg w-full p-2 placeholder:text-lg"
          />
        </div>
  
        <div className="my-4">
          <h2 className="text-2xl font-semibold my-2">Description</h2>
          <textarea
            type="text"
            placeholder="description"
            className=" h-[100px] resize-none w-full p-3 rounded-lg border text-lg focus:outline-none"
            onChange={(e) =>
              setBlogData((blogData) => ({
                ...blogData,
                description: e.target.value,
              }))
            }
          />
        </div>
  
        <div>
          <h2 className="text-2xl font-semibold my-2">Image</h2>
          <label htmlFor="image" className=" ">
            {blogData.image ? (
              <img
                src={
                  typeof blogData.image == "string"
                    ? blogData.image
                    : URL.createObjectURL(blogData.image)
                }
                alt=""
                className="aspect-video object-cover border rounded-lg"
              />
            ) : (
              <div className=" bg-white border rounded-lg aspect-video opacity-50 flex justify-center items-center text-4xl">
                Select Image
              </div>
            )}
          </label>
          <input
            className="hidden"
            id="image"
            type="file"
            accept=".png, .jpeg, .jpg"
            onChange={(e) =>
              setBlogData((blogData) => ({
                ...blogData,
                image: e.target.files[0],
              }))
            }
          />
        </div>
  
        <div className="my-4">
          <h2 className="text-2xl font-semibold my-2">Content</h2>
          <div id="editorjs" className="w-full"></div>
        </div>
  
        <button
          className="bg-blue-500 text-lg py-4 px-7 rounded-full  font-semibold text-white my-6 "
          onClick={id ? handleUpdateBlog : handlePostBlog}
        >
          {id ? "Update blog" : "Post blog"}
        </button>
      </div>
    );
};
