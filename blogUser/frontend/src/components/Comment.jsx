import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../utils/commentSlice";
import axios from "axios";
import { setComments, setReplies } from "../utils/selectedBlogSlice";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";
import { setCommentLikes } from "../utils/selectedBlogSlice";

export const Comment = () => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [activeReply, setActiveReply] = useState(null);

  console.log(comment, "hello");
  const { _id: blogId, comments } = useSelector((state) => state.selectedBlog);
  const { token, id: userId } = useSelector((state) => state.user);

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
      setComment("");
      dispatch(setComments(res.data.newComment));
     
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <div className="bg-white drop-shadow-xl h-screen fixed top-0 right-0 w-[300px] border-l p-5 overflow-y-scroll">
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Comment ({comments.length})</h1>
        <i
          class="fi fi-br-cross text-xl text-blue mt-1 cursor-pointer"
          onClick={() => dispatch(setIsOpen(false))}
        ></i>
      </div>
      <div className="my-4">
        <textarea
          type="text"
          value={comment}
          placeholder="Comment..."
          className=" h-[150px] resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleComment} className="bg-green-500 px-7 py-3 my-2">
          Add
        </button>
      </div>

      <div className="mt-4 ">
        <Displaycomments comments={comments} userId={userId} blogId={blogId} token={token}  activeReply={activeReply}
                  setActiveReply={setActiveReply}/>
      </div>
    </div>
  );
};

function Displaycomments({comments,userId,blogId,token,activeReply,setActiveReply}){
  const [reply,setReply] = useState('')
  const dispatch = useDispatch()

  async function handleReply(commentId) {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/${commentId}/${blogId}`,
        {
          reply,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
setReply('')
setActiveReply(null)
      dispatch(setReplies(res.data.newReply));
      // setComment("");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCommentLike(commentId) {
    console.log(commentId);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/like-comment/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("res handle like comment", res);
      toast.success(res.data.message);
      console.log(res.data);
      dispatch(setCommentLikes({ commentId, userId }));
    } catch (error) {
      console.log("error");
    }
  }
  function handleActiveReply(id) {
    setActiveReply((prev) => (prev === id ? null : id));
  }

  return <>{comments &&
    comments.map((commet) => (
      <div className="flex flex-col gap-2 my-4 border-b-2">
        <div className="flex justify-between">
          <div className="flex gap-2 justify-center items-center">
            <div className="h-10 w-10">
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${commet.user?.name}`}
                alt=""
                className="rounded-full "
              />
            </div>

            <div>
              <p className="font-medium capitalize">
                {commet.user?.name}
              </p>
              <p>{formatDate(commet.createdAt)}</p>
            </div>
            <div></div>
          </div>
          <i class="fi fi-rr-menu-dots"></i>
        </div>
        {/* <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${commet.user.name}`}
                alt=""
                className="rounded-full"
              /> */}
        <p className="capitalize font-medium text-lg">{commet.comment}</p>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="cursor-pointer flex gap-2">
              {commet.likes.includes(userId) ? (
                <i
                  class="fi fi-sr-thumbs-up text-blue-600 text-xl mt-1"
                  onClick={() => handleCommentLike(commet._id)}
                ></i>
              ) : (
                <i
                  className="fi fi-rr-social-network text-xl mt-1"
                  onClick={() => handleCommentLike(commet._id)}
                ></i>
              )}
              {true && <p className="text-xl">{commet.likes.length}</p>}
            </div>

            <div className="flex gap-2 cursor-pointer">
              <i className="fi fi-sr-comment-alt text-lg mt-1"></i>
              <p className="text-lg">{commet.replies && commet.replies.length}</p>
            </div>
          </div>

          <p className="text-lg hover:underline cursor-pointer"   onClick={() => handleActiveReply(commet._id)}>reply</p>
        </div>
        {activeReply === commet._id && (
        <div className="my-4">
          <textarea
            type="text"
           
            placeholder="Reply..."
            className=" h-[150px] resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
            onChange={(e) => setReply(e.target.value)}
          />
          <button
            onClick={() => handleReply(commet._id)}
            className="bg-green-500 px-7 py-3 my-2"
          >
            Add
          </button>
        </div>
      )}

{commet.replies && commet.replies.length > 0 && (
              <div className="pl-6 border-l ">
                <Displaycomments
                  comments={commet.replies}
                  userId={userId}
                  blogId={blogId}
                  token={token}
                  activeReply={activeReply}
                  setActiveReply={setActiveReply}
                 
                />
              </div>
            )}
      </div>
    ))}
  </>
}
