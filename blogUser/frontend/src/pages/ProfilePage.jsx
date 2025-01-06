import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const ProfilePage = () => {
    const {username} = useParams()


    useEffect(() => {
        async function fetchUserDetails() {
          try {
            let res = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/users/${username.split("@")[1]}`
            );
            console.log(res);
          } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
          }
        }
        fetchUserDetails();
      }, [username]);

  return (
    <div>ProfilePage</div>
  )
}
