import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../utils/commentSlice";
import axios from "axios";
import { setComments } from "../utils/selectedBlogSlice";

export const Comment = () => {
    const dispatch = useDispatch()
    const [comment,setComment] = useState("")
    console.log(comment,"hello")
    const {_id:blogId,comments} = useSelector((state)=>state.selectedBlog)
    const { token, name } = useSelector((state) => state.user);

    async function handleComment() {
        try {
          let res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${blogId}`,
            {
                comment,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          console.log(res.data);
          
          dispatch(setComments(res.data.newComment));
          setComment("");
        } catch (error) {
          console.log(error);
        }
      }
  return (
    <div className="bg-white drop-shadow-xl h-screen fixed top-0 right-0 w-[300px] border-l p-5">
        <div className="flex justify-between">
        <h1 className="text-xl font-medium">Comment ({324})</h1>
        <i class="fi fi-br-cross text-xl text-blue mt-1 cursor-pointer" onClick={()=>dispatch(setIsOpen(false))}></i>
        </div>
        <div className="my-4">
        <textarea
          type="text"
          placeholder="Comment..."
          className=" h-[150px] resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
          onChange={(e)=>setComment(e.target.value)}
          
        />
        <button onClick={handleComment} className="bg-green-500 px-7 py-3 my-2">
          Add
        </button>
      </div>

      <div className="mt-4">
      
       
        {comments&&
            
            comments.map(commet=><p>{commet.comment}</p>)
        }

      </div>
     
    </div>
  );
};
