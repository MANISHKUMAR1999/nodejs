import { useState } from "react"
import { Navigate } from "react-router-dom"

const CreateBlog = () => {
    let user = JSON.parse(localStorage.getItem('user'))
    const [blogData, setBlogData] = useState({
        title:"",
        description:"",
       
      })
 
    async function handleSubmit() {
      const response = await fetch('http://localhost:3000/api/v1/blogs',{
        method:'POST',
        headers:{
          "CONTENT-TYPE":"application/json",
          Authorization: `Bearer ${user.token}`
        },
    
        body:JSON.stringify(blogData)
    
      })
      let res = await response.json()
      if(res.sucess){
        localStorage.setItem('user',JSON.stringify(res.User))
      }
      
      alert(res.message)
      
    }
    if(!user){
      return <Navigate to='/signup'/>
    }

  return (
    <div>
         <div>
    <h1>Sign Up</h1>
    <input type="text" onChange={(e)=>setBlogData((prev)=>({...prev,title:e.target.value}))} name="title" id="title" placeholder='title' />
    <br></br>
    <input type="email" name="email" onChange={(e)=>setBlogData((prev)=>({...prev,description:e.target.value}))} id="description" placeholder='description' />
    <br></br>
    <br></br>
    <button type="submit" onClick={handleSubmit}>Submit</button>
    
    </div>
   
    </div>
  )
}

export default CreateBlog