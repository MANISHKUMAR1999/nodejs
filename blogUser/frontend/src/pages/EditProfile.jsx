import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../utils/userSlice';

const EditProfile = () => {
  const {token,id:userId,name,profilePic,username,bio,email} = useSelector((state)=>state.user)
  const dispatch = useDispatch()
  const [userData,setUserData] = useState({
    profilePic:profilePic,
    username:username,
    name:name,
    bio:bio
  })
  const [initialData, setInitialData] = useState({
    profilePic,
    username,
    name,
    bio,
  });
  
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  
  function handleChange(e) {
    const { value, name, files } = e.target;
    if (files) {
      setUserData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    }
  }

  async function handleUpdateProfile() {
    //console.log(userData)
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("username", userData.username);
    if (userData.profilePic) {
      formData.append("profilePic", userData.profilePic);
    }
    formData.append("bio", userData.bio);
    console.log(formData,"form data")

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
     dispatch(login({ ...res.data.user, token, email, id: userId }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  
  useEffect(() => {
    if (initialData) {
      const isEqual = JSON.stringify(userData) === JSON.stringify(initialData);
      setIsButtonDisabled(isEqual);
    }
  }, [userData, initialData]);

  return (
    <div className="w-full">
    <div className="w-[35%] mx-auto my-10 px-10">
      <h1 className="text-center text-3xl font-medium my-4">Edit Profile</h1>
      <div>
        <div className="">
          <h2 className="text-2xl font-semibold my-2">Photo</h2>
          <div className="flex items-center flex-col gap-3">
          <label htmlFor="image" className=" ">
            {userData?.profilePic ? (
              <img
                src={
                  typeof userData?.profilePic == "string"
                    ? userData?.profilePic
                    : URL.createObjectURL(userData?.profilePic)
                }
                alt=""
                className="aspect-square w-[150px] h-[150px] object-cover border rounded-full"
              />
            ) : (
              <div className=" w-[150px] h-[150px] bg-white border-2 border-dashed rounded-full aspect-square  flex justify-center items-center text-xl">
                Select Image
              </div>
            )}
          </label>

          <h2
                className="text-lg text-red-500 font-medium cursor-pointer"
                onClick={() => {
                  setUserData((prevData) => ({
                    ...prevData,
                    profilePic: null,
                  }));
                }}
              >
                Remove
              </h2>
              </div>

          <input
            className="hidden"
            id="image"
            type="file"
            name="profilePic"
            accept=".png, .jpeg, .jpg"
            onChange={handleChange}
          />
        </div>

        <div className="my-4">
          <h2 className="text-2xl font-semibold my-2">Name</h2>
          <input
            name="name"
            type="text"
            placeholder="name"
            defaultValue={userData.name}
            onChange={handleChange}
            className="border focus:outline-none rounded-lg w-full p-2 placeholder:text-lg"
          />
        </div>
        <div className="my-4">
          <h2 className="text-2xl font-semibold my-2">Username</h2>
          <input
            type="text"
            name="username"
            placeholder="username"
            defaultValue={userData.username}
            onChange={handleChange}
            className="border focus:outline-none rounded-lg w-full p-2 placeholder:text-lg"
          />
        </div>

        <div className="my-4">
          <h2 className="text-2xl font-semibold my-2">Bio</h2>
          <textarea
            type="text"
            name="bio"
            placeholder="description"
            defaultValue={userData.bio}
            className=" h-[100px] resize-none w-full p-3 rounded-lg border text-lg focus:outline-none"
            onChange={handleChange}
          />
        </div>

        <button
          disabled={isButtonDisabled}
          className={` px-7 py-3 rounded-full text-white my-3  ${
            isButtonDisabled ? " bg-green-300 " : " bg-green-600 "
          } `}
          onClick={handleUpdateProfile}
        >
          Update
        </button>
      </div>
    </div>
  </div>
);

  
}

export default EditProfile