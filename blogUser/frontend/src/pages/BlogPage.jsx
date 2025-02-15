import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { addSlectedBlog, changeLikes, removeSelectedBlog } from "../utils/selectedBlogSlice";
import { Comment } from "../components/Comment";
import { setIsOpen } from "../utils/commentSlice";
import { formatDate } from "../utils/formatDate";
//import { Comment } from "../components/Comment";
//import Comment from '../components/Comment'
//import {jwt} from 'jsonwebtoken'

export  async function handleSaveBlog(id,token){

  try {
    let res = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/save-blog/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(res.data.message);

    // dispatch(addSlectedBlog(blog));
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

export async function handleFollowCreator(id,token){
  
  try {
    let res = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/follow/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(res.data.message);

    // dispatch(addSlectedBlog(blog));
  } catch (error) {
    toast.error(error.response.data.message);
  }
}



export const BlogPage = () => {
  // const user =  JSON.parse(localStorage.getItem("user"));
  // const token =  JSON.parse(localStorage.getItem("tokn"));

  const { email, token, name, id: userId,profilePic } = useSelector((state) => state.user);
  const {isOpen} = useSelector((state)=>state.comment)

  //const {likes} = useSelector((slice)=>slice.selectedBlog)
  //console.log(likes,"likes")
  const {comments,content} = useSelector((slice)=>slice.selectedBlog)
  const dispatch = useDispatch();
  const location = useLocation();
  //console.log("token",token)

  const [blogData, setBlogData] = useState({});
  const [isLike, setIsLike] = useState(false);
  const { id } = useParams();
  console.log(id);
  async function fetchBlogById() {
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`
      );
      console.log(res, "res from blog page");
      setBlogData(res.data.blog);
      dispatch(addSlectedBlog(res.data.blog));

      if (res.data.blog.likes.includes(userId)) {
        setIsLike((prev) => !prev);
      }
    } catch (error) {
      toast.error(error);
    }
  }

  async function handleLike() {
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
      console.log(userId, "user id from store");
      dispatch(changeLikes(userId));
      console.log("res data like",res)
      toast.success(res.data.message);
    } else {
      return toast.error("Please signin for like this blog");
    }
  }

  function handleComment(){
    dispatch(setIsOpen())
  }

  useEffect(() => {
    fetchBlogById();
    return () => {
      //   console.log(window.location.pathname); // currnt path
      //   console.log(location.pathname); //previous path
      dispatch(setIsOpen(false));
      if (
        window.location.pathname !== `/edit/${id}` &&
        window.location.pathname !== `/blog/${id}`
      ) {
        dispatch(removeSelectedBlog());
      }
    };
  }, [id]);

  return (
    <div className="w-[700px] mx-auto">
      {blogData ? (
        <div>
          <h1 className="mt-10 font-bold text-6xl capitalize">
            {blogData.title}
          </h1>
          <div className="flex items-center my-5 gap-3">
            <Link to={`/@${blogData.creator&&blogData.creator.username}`}>
            <div>
              {
               blogData.creator && <div className="w-10 h-10 cursor-pointer">
               <img
                 src={
                   profilePic
                     ? profilePic
                     : `https://api.dicebear.com/9.x/initials/svg?seed=${blogData.creator.name}`
                 }
                 alt=""
                 className="rounded-full w-full h-full object-contain"
               />
             </div>
              }
              
            </div>
            </Link >
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1 ">
                <Link to={`/@${blogData.creator && blogData.creator.username}`}>
                <h2 className="text-xl hover:underline cursor-pointer">
                  {blogData.creator && blogData.creator.name}
                </h2>
                </Link>
                
                .
                <p
                  onClick={() =>
                    handleFollowCreator(blogData.creator._id, token)
                  }
                  className="text-xl my-2 font-medium text-green-700 cursor-pointer"
                >
                  {!blogData?.creator?.followers?.includes(userId)
                    ? "follow"
                    : "following"}
                </p>
              </div>
              <div>
                <span>6 min read</span>
                <span className="mx-2">{formatDate(blogData.createdAt)}</span>
              </div>
            </div>
          </div>
          <img src={blogData.image} alt="" srcset="" />
          {blogData.creator && email === blogData.creator.email && (
            <button className="bg-green-400 mt-5 px-6 py-2 rounded-xl">
              <Link to={"/edit/" + blogData.blogId}>Edit</Link>
            </button>
          )}

          <div className="flex gap-4 mt-4">
            <div onClick={handleLike} className="cursor-pointer flex gap-2">
              {isLike ? (
                <i class="fi fi-sr-thumbs-up text-blue-600 text-3xl"></i>
              ) : (
                <i className="fi fi-rr-social-network text-3xl"></i>
              )}
              {blogData.likes && (
                <p className="text-2xl">{blogData.likes.length}</p>
              )}
            </div>
           
            <div className="flex gap-2">
              <i onClick={handleComment} class="fi fi-sr-comment-alt text-3xl"></i>
              {blogData.comments && <p className="text-2xl">{comments.length}</p>}
            </div>
            <div className="flex gap-2 cursor-pointer" onClick={(e)=>handleSaveBlog(blogData._id,token)}>
              {
                blogData.totalSaves && blogData.totalSaves.includes(userId) ? <i className="fi fi-sr-bookmark text-3xl mt-1"></i>:<i className="fi fi-rr-bookmark text-3xl mt-1"></i>
              }
                
                    
                    
                  </div>

            <div className="my-10">
            { content?.blocks.map((block) => {
              if (block.type == "header") {
                if (block.data.level == 2) {
                  return (
                    <h2 className="font-bold text-4xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h2>
                  );
                } else if (block.data.level == 3) {
                  return (
                    <h3 className="font-bold text-3xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h3>
                  );
                } else if (block.data.level == 4) {
                  return (
                    <h4  className="font-bold text-2xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h4>
                  );
                }
              } else if (block.type == "paragraph") {
                return (
                  <p className="my-4" dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
                );
              }
              else if (block.type == "image") {
                return (
                  <div className="my-4">
                    <img src={block.data.file.url} alt="" />
                    <p className="text-center my-2">{block.data.caption}</p>
                  </div>
                );
              }

            })}
              </div>
          </div>
        </div>
      ) : (
        <h1>Loading........</h1>
      )}
      {
        isOpen ? ( <Comment/>) : ''
      }
     
      
      
    </div>
  );
};
