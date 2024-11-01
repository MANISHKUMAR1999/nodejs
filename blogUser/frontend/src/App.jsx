//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import { json } from 'express'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Blogs from './components/blogs'
import SignupPage from './pages/signupPage'
import Signin from './pages/Signin'
import CreateBlog from './components/CreateBlog'



function App() {

  return (
  <Routes>
    <Route path='/' element={<Blogs/>}></Route>
    <Route path='/signup' element={<SignupPage/>}></Route>
    <Route path='/signin' element={<Signin/>}></Route>
  
    <Route path='/create-blog' element={<CreateBlog/>}></Route>
    <Route path='*' element={<h1>Not Found</h1>}></Route>
  </Routes>
  )
}

export default App
