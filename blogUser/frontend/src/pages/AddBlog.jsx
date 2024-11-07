import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

export const AddBlog = () => {
  const token = JSON.parse(localStorage.getItem("token"));
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
  return (
    <div>
      <label htmlFor="">Title</label>
      <input
        type="text"
        name="title"
        id=""
        placeholder="Enter the title"
        onChange={(e) =>
          setBlogData((prev) => ({ ...prev, title: e.target.value }))
        }
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
      />
      <br></br>
      <div>
        <label htmlFor="image">
          {blogData.image ? (
            <img
              src={URL.createObjectURL(blogData.image)}
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
      <button onClick={handlePostBlog}>Post blog</button>
    </div>
    // token == null ?<Navigate to="/signin"/> : <div>Add blog</div>
  );
};
