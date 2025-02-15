import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { handleSaveBlog } from "../pages/BlogPage";
import { useSelector } from "react-redux";

export const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const { token, id:userId } = useSelector((state) => state.user);

  async function fetchBlogs() {
    // import.meta.env.VITE_BACKEND_URL
    let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`);
    console.log(res.data.allBlogs, "res");
    setBlogs(res.data.allBlogs);
  }
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="w-[50%] mx-auto">
      {blogs &&
        blogs.map((blog) => (
          <Link to={"/blog/" + blog.blogId}>
            <div key={blog._id} className="w-full my-10 flex justify-between ">
              <div className="w-[60%] flex flex-col gap-2">
                <div>
                  <img src="" alt="" />
                  <p className="">{blog.creator?.name}</p>
                </div>
                <h2 className="font-bold text-3xl">{blog.title}</h2>
                <h4 className="line-clamp-2">{blog.description}</h4>
                <div className="flex gap-5">
                  <p>{formatDate(blog.createdAt)}</p>
                  <div className="flex gap-7">
                    <div className="cursor-pointer flex gap-2 ">
                      <i className="fi fi-rr-social-network text-lg mt-1"></i>
                      <p className="text-lg">{blog.likes.length}</p>
                    </div>

                    <div className="flex gap-2">
                      <i className="fi fi-sr-comment-alt text-lg mt-1"></i>
                      <p className="text-lg">{blog.comments.length}</p>
                    </div>
                    <div
                      className="flex gap-2 cursor-pointer"
                      onClick={(e) =>{
                        e.preventDefault()
                        handleSaveBlog(blog._id, token)}
                      }
                    >
                      
                      {blog.totalSaves &&
                      blog.totalSaves.includes(userId) ? (
                        <i className="fi fi-sr-bookmark text-lg mt-1"></i>
                      ) : (
                        <i className="fi fi-rr-bookmark text-lg mt-1"></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[25%]">
                <img src={blog.image} alt="" />
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};
