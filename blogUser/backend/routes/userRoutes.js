
const express = require('express');

const {createUser,getAllUser,getUserById,updateUser,deleteUser, login,verifyEmail,googleAuth,followUser} = require('../controllers/userController');
const verifyUser = require('../middlewares/auth');

const routes = express.Router();


routes.post('/signup',createUser)

routes.post('/signin',login)

routes.get('/users',getAllUser)


routes.get('/users/:id',getUserById)

routes.patch('/users/:id',updateUser)

routes.delete('/users/:id',deleteUser)

// verify email/token

routes.get("/verify-email/:verificationToken",verifyEmail)

// google Auth route

routes.post("/google-auth",googleAuth)

// follow /unfollow

routes.patch("/follow/:id",verifyUser,followUser)
module.exports = routes